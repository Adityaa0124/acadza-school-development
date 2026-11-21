import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginSignupCommonScreen from '@components/Authentication/CommonScreen';
import InputField from '@components/Custom/InputField';
import Typography from '@components/Custom/Typography';
import Button from '@components/Custom/Button';
import OtpInputBox from '@components/Authentication/CustomOtpInput';
import axiosInstance from '@utils/axios';
import { useAuth } from '@context/auth/authContext';
import { useWindowSize } from '@hooks/useWindowSize';
import { SCREEN_SIZES } from '@utils/constants/screen_size';
import { COURSE_MODE } from '@utils/constants/course_mode';
import {
    API_MOBILE_OTP_SIGNUP,
    API_MOBILE_OTP_VERIFICATION_SIGNUP,
    API_CREATE_ACCOUNT_SIGNUP,
} from '@utils/constants/api_routes/auth';
import { ROUTE_DASHBOARD, ROUTE_LOGIN } from '@utils/constants/page_routes';

/*
 * WHAT COUNTS AS A COMPLETE ENTRY in the mobile field.
 *
 * Ten digits OR an email address — the field is labelled "Mobile Number" but the submit path has
 * always accepted an email here, and gating on digits alone would quietly kill that.
 *
 * The first-digit rule (6-9) is deliberately NOT part of this. It belongs to submit, which can
 * explain itself; folded in here it would leave someone who typed a wrong leading digit staring
 * at a dead button with nothing on screen saying why.
 */
const MOBILE_OR_EMAIL = /^(?:\d{10}|\w+@\w+\.\w{2,3})$/;

/*
 * THE THREE STEPS, and why registration is split across them.
 *
 *   1  mobile number + class           -> POST /user/register/phoneOtp
 *   2  the six-digit code              -> POST /user/register/phoneOtp/verify
 *   3  name, email, password           -> POST /user/register, then log straight in
 *
 * The account cannot be created before step 2: `/user/register` refuses any phone that has no
 * verified holding record, which is what stops an account being made for someone else's number.
 */
export default function SignupScreen(props) {
    const { onlyStepsShow, minimal, signupReference } = props;

    const screenSize = useWindowSize();
    const { login, authenticToken } = useAuth();
    const router = useRouter();
    const refrenceSignup = signupReference || router?.query?.reference || router?.query?.ref;

    const [step, setStep] = useState(1);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        /*
         * FIXED, NOT CHOSEN. Every account registered here is a JEE account; there is no
         * course picker on step 1. It stays in this object rather than being inlined at the
         * POST because `course` is still a field of the account the backend writes, and one
         * day it may be chosen again — the screen is the only thing that has to change.
         */
        courseMode: COURSE_MODE.JEE,
        orionClass: null,
    });

    /**
     * How long the OTP screen says the code is good for, and how long before Resend unlocks.
     *
     * THE CLIENT DOES NOT DECIDE WHEN AN OTP EXPIRES. This is a countdown drawn on screen; the
     * real lifetime is whatever /user/register/phoneOtp set server-side. Raising it here without
     * raising it there means the screen promises time the code does not have, and the student is
     * told "Invalid OTP, please try again!!" — the server returns the same message for an expired
     * code as for a wrong one, so nothing on screen would say why.
     */
    const OTP_VALIDITY_SECONDS = 5 * 60;
    const OTP_RESEND_COOLDOWN_SECONDS = 40;

    const [mobileOtp, setMobileOtp] = useState(null);
    const [timer, setTimer] = useState(OTP_VALIDITY_SECONDS);
    const [loading, setLoading] = useState(false);
    const [errorDetails, setErrorDetails] = useState({
        errorType: null,
        errorMessage: null,
    });
    const [reSendOtpStep, setReSendOtpStep] = useState(0);
    const [timeLeft, setTimeLeft] = useState(OTP_RESEND_COOLDOWN_SECONDS);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    /*
     * Classes 6 to 12 — schools only, so there is no 13/"Dropper" entry the way there is in
     * student-frontend, and the list does not vary by course because the course does not vary.
     */
    const userClass = ['6', '7', '8', '9', '10', '11', '12'];

    // ONE interval for the life of the component, with a functional update so it never needs to
    // see the current value. Recreated on every render it would restart its own 1000ms window,
    // and the countdown would stall for as long as the student was typing into the OTP boxes.
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((current) => (current > 0 ? current - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timeout = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearTimeout(timeout);
        }
        setIsResendDisabled(false);
        return undefined;
    }, [timeLeft]);

    ///////Common Error Handling function/////
    const errorMessage = (errorSubmit) => {
        setErrorDetails(errorSubmit);
        setLoading(false);
    };

    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
        });
    };

    ///////Mobile Number Verification function/////
    const handleMobileVerification = (e) => {
        e.preventDefault();
        setLoading(true);
        const mobileVerification = MOBILE_OR_EMAIL.test(userDetails.mobile);
        const mobileFirstDigit = ['9', '8', '7', '6'].includes(userDetails.mobile[0]);

        if (mobileVerification && mobileFirstDigit) {
            handleCreateMobileOtp();
        } else {
            errorMessage({
                errorType: 'mobileNumber',
                errorMessage: 'Enter the correct mobile number',
            });
        }
    };

    ///////Create Mobile Otp function/////
    const handleCreateMobileOtp = (resend) => {
        axiosInstance
            .post(API_MOBILE_OTP_SIGNUP, { phone: userDetails.mobile })
            .then((res) => {
                if (res.data.isSuccessful) {
                    setLoading(false);
                    setErrorDetails({ errorType: null, errorMessage: null });
                    resend ? setStep(step) : setStep(step + 1);
                    resend ? setReSendOtpStep(reSendOtpStep + 1) : setReSendOtpStep(reSendOtpStep);
                    setTimer(OTP_VALIDITY_SECONDS);
                    setTimeLeft(OTP_RESEND_COOLDOWN_SECONDS);
                    setIsResendDisabled(true);
                } else {
                    errorMessage({
                        errorType: 'mobileNumber',
                        errorMessage: 'Enter valid Mobile no.',
                    });
                }
            })
            .catch(() => {
                errorMessage({
                    errorType: 'mobileNumber',
                    errorMessage: 'some problem occured, please try after sometimes',
                });
            });
    };

    ///////Mobile Otp Verification function/////
    const handleOtpVerification = (e) => {
        e.preventDefault();
        setLoading(true);
        axiosInstance
            .post(API_MOBILE_OTP_VERIFICATION_SIGNUP, { phone: userDetails.mobile, otp: mobileOtp })
            .then((res) => {
                if (res.data.isSuccessful) {
                    setLoading(false);
                    setErrorDetails({ errorType: null, errorMessage: null });
                    // The number is verified; the details screen is what creates the account.
                    setStep(3);
                } else {
                    errorMessage({ errorType: 'otpWrong', errorMessage: 'Enter valid OTP' });
                }
            })
            .catch(() => {
                errorMessage({ errorType: 'otpWrong', errorMessage: 'Wrong OTP' });
            });
    };

    ///////Submit User Details function/////
    const handleSignup = (e) => {
        e.preventDefault();
        setLoading(true);
        //eslint-disable-next-line
        const emailValidation = /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/.test(userDetails.email);
        if (!emailValidation) {
            errorMessage({ errorType: 'emailWrong', errorMessage: 'Please Enter valid Email' });
            return;
        }
        if (userDetails.password.length < 6) {
            errorMessage({
                errorType: 'setPassError',
                errorMessage: 'Password should be more then six characters',
            });
            return;
        }
        if (userDetails.password.length > 15) {
            errorMessage({
                errorType: 'setPassError',
                errorMessage: 'Your password should be below sixteen characters',
            });
            return;
        }
        handleCreateAccount();
    };

    /**
     * Turns whatever /user/register said into something a student can act on.
     *
     * The raw server text used to be rendered straight into the box. For the single most common
     * failure that meant "username already exists !" — developer wording, stray space before the
     * exclamation mark, and no hint that the fix is to log in rather than try again.
     */
    const signupFailure = (serverMessage) => {
        const text = String(serverMessage ?? '');

        if (/username already exists/i.test(text) || /already\s+(exists|registered)/i.test(text)) {
            return {
                errorType: 'accountExists',
                errorMessage: 'You already have an account, Login to use Acadza',
            };
        }

        return {
            errorType: 'createError',
            // A failure with no message used to render an empty error box — the student saw the
            // screen do nothing at all.
            errorMessage: text.trim() || 'Something went wrong. Please try again.',
        };
    };

    ///////Final Create Account function/////
    const handleCreateAccount = () => {
        const metaData = { ...router.query };
        delete metaData?.reference;

        const userData = {
            name: userDetails.name,
            email: userDetails.email,
            password: userDetails.password || userDetails.mobile,
            phone: userDetails.mobile,
            role: 'student',
            course: userDetails.courseMode,
            orionClass: userDetails.orionClass,
            reference: refrenceSignup ? refrenceSignup : 'acadza',
            meta: metaData,
        };

        axiosInstance
            .post(API_CREATE_ACCOUNT_SIGNUP, userData)
            .then((res) => {
                if (res.data.isSuccessful) {
                    setLoading(false);
                    /*
                     * Registration does NOT hand back a token — the account is created, then
                     * logged in through the ordinary login endpoint with the credentials just
                     * set. One place issues sessions, so a student who signs up is in exactly
                     * the state a student who logged in is.
                     */
                    login({
                        username: userDetails.email || userDetails.mobile,
                        password: userDetails.password || userDetails.mobile,
                    });
                } else {
                    setErrorDetails(signupFailure(res?.data?.message));
                    setLoading(false);
                }
            })
            .catch((err) => {
                setLoading(false);
                setErrorDetails(signupFailure(err?.response?.data?.message));
            });
    };

    const goToLogin = () => router.push(ROUTE_LOGIN);

    /*
     * Signing up ends on the dashboard, and it gets there the same way a login does: through the
     * A_AUTHTOKEN flag `login()` sets, not through the register response. `setLoading(true)`
     * alongside it keeps the step from flashing under the redirect.
     */
    useEffect(() => {
        if (authenticToken) {
            setLoading(true);
            router.push(ROUTE_DASHBOARD);
        }
    }, [authenticToken, router]);

    const handleShowImage = useCallback(() => {
        if (step === 1) return 'boyWithMobile';
        if (step === 2) return 'boyWithOtp';
        return 'enjoyingBoy';
    }, [step]);

    const stepProps = {
        step,
        setStep,
        screenSize,
        timer,
        handleChange,
        handleMobileVerification,
        handleCreateMobileOtp,
        handleOtpVerification,
        handleSignup,
        userDetails,
        errorDetails,
        loading,
        setUserDetails,
        setMobileOtp,
        reSendOtpStep,
        goToLogin,
        userClass,
        isResendDisabled,
        timeLeft,
        minimal,
    };

    const steps = (
        <>
            {step === 1 && <Step1 {...stepProps} />}
            {step === 2 && <Step2 {...stepProps} />}
            {step === 3 && <Step3 {...stepProps} />}
        </>
    );

    return onlyStepsShow ? (
        steps
    ) : (
        <LoginSignupCommonScreen showImage={handleShowImage()}>{steps}</LoginSignupCommonScreen>
    );
}

const fieldWidth = (screenSize) => (screenSize === SCREEN_SIZES.MOBILE ? '20rem' : '24.125rem');

/* STEP 1 — the number the OTP will go to, and which class the student is in. */
const Step1 = (props) => {
    const { screenSize, handleMobileVerification, handleChange, userDetails, errorDetails, loading, goToLogin, userClass } =
        props;

    return (
        <form onSubmit={handleMobileVerification} className="flex flex-col gap-3" style={{ maxWidth: fieldWidth(screenSize) }}>
            <Typography variant="h1" className="font-extrabold tracking-wide">
                Sign up
            </Typography>
            <Typography variant="h5" className="tracking-widest">
                Already have an account?
                <button type="button" className="ml-1 text-primary focus:outline-none" onClick={goToLogin}>
                    Login
                </button>
            </Typography>

            <div className="mt-5 flex flex-col gap-5">
                <label>
                    <Typography variant="small">Mobile Number</Typography>
                    <InputField
                        name="mobile"
                        id="signup-mobile"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        enterKeyHint="next"
                        maxLength={10}
                        minWidth={fieldWidth(screenSize)}
                        placeholder="Enter your mobile number"
                        errorText={errorDetails.errorType === 'mobileNumber' ? errorDetails.errorMessage : ''}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    <Typography variant="small">Class</Typography>
                    {/*
                     * `required` with an empty placeholder option, so the browser's own
                     * validation stops a blank class at submit — it is the only thing the
                     * student picks on this step now, and an account with no class is not
                     * useful to anything downstream.
                     */}
                    <select
                        name="orionClass"
                        value={userDetails.orionClass || ''}
                        onChange={handleChange}
                        className="h-[3.375em] w-full rounded-lg border border-disabled bg-white px-5 text-black focus:border-black focus:outline-none"
                        style={{ minWidth: fieldWidth(screenSize) }}
                        required
                    >
                        <option value="">Select your class</option>
                        {userClass.map((value) => (
                            <option key={value} value={value}>
                                Class {value}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <Button icon="rightArrowIcon" className="mt-6 flex-row-reverse gap-3" size="lg" disabled={loading}>
                {loading ? 'Loading...' : 'Send OTP'}
            </Button>
        </form>
    );
};

/* STEP 2 — the code. */
const Step2 = (props) => {
    const {
        screenSize,
        handleOtpVerification,
        handleCreateMobileOtp,
        setMobileOtp,
        userDetails,
        errorDetails,
        loading,
        timer,
        timeLeft,
        isResendDisabled,
        setStep,
    } = props;

    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');

    return (
        <form onSubmit={handleOtpVerification} className="flex flex-col gap-3" style={{ maxWidth: fieldWidth(screenSize) }}>
            <Typography variant="h1" className="font-extrabold tracking-wide">
                Verify OTP
            </Typography>
            <Typography variant="h5" className="tracking-widest text-muted">
                Sent to {userDetails.mobile}
                <button type="button" className="ml-2 text-primary focus:outline-none" onClick={() => setStep(1)}>
                    Change
                </button>
            </Typography>

            <div className="mt-5">
                <OtpInputBox onChange={setMobileOtp} />
                {errorDetails.errorType === 'otpWrong' && (
                    <div className="mt-2 text-[0.875rem] text-red">{errorDetails.errorMessage}</div>
                )}
            </div>

            <Typography variant="small" className="mt-3 block text-muted">
                {timer > 0 ? `Code valid for ${minutes}:${seconds}` : 'The code has expired — send a new one.'}
            </Typography>

            <button
                type="button"
                disabled={isResendDisabled}
                onClick={() => handleCreateMobileOtp(true)}
                className={`w-fit text-[0.875rem] focus:outline-none ${
                    isResendDisabled ? 'text-disabled' : 'text-primary underline'
                }`}
            >
                {isResendDisabled ? `Resend OTP in ${timeLeft}s` : 'Resend OTP'}
            </button>

            <Button icon="rightArrowIcon" className="mt-5 flex-row-reverse gap-3" size="lg" disabled={loading}>
                {loading ? 'Loading...' : 'Verify'}
            </Button>
        </form>
    );
};

/* STEP 3 — the account itself. */
const Step3 = (props) => {
    const { screenSize, handleSignup, handleChange, errorDetails, loading } = props;

    return (
        <form onSubmit={handleSignup} className="flex flex-col gap-3" style={{ maxWidth: fieldWidth(screenSize) }}>
            <Typography variant="h1" className="font-extrabold tracking-wide">
                Your details
            </Typography>
            <Typography variant="h5" className="tracking-widest text-muted">
                Number verified. One step to go.
            </Typography>

            <div className="mt-5 flex flex-col gap-5">
                <label>
                    <Typography variant="small">Name</Typography>
                    <InputField
                        name="name"
                        id="signup-name"
                        autoComplete="name"
                        enterKeyHint="next"
                        minWidth={fieldWidth(screenSize)}
                        placeholder="Enter your full name"
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    <Typography variant="small">Email</Typography>
                    <InputField
                        name="email"
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        enterKeyHint="next"
                        minWidth={fieldWidth(screenSize)}
                        placeholder="Enter your email id"
                        errorText={errorDetails.errorType === 'emailWrong' ? errorDetails.errorMessage : ''}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    <Typography variant="small">Set password</Typography>
                    <InputField
                        name="password"
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        enterKeyHint="go"
                        minWidth={fieldWidth(screenSize)}
                        placeholder="6 to 15 characters"
                        errorText={errorDetails.errorType === 'setPassError' ? errorDetails.errorMessage : ''}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            {['accountExists', 'createError'].includes(errorDetails.errorType) && (
                <div className="mt-2 text-[0.875rem] text-red">{errorDetails.errorMessage}</div>
            )}

            <Button icon="rightArrowIcon" className="mt-6 flex-row-reverse gap-3" size="lg" disabled={loading}>
                {loading ? 'Loading...' : 'Create account'}
            </Button>
        </form>
    );
};
