import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginSignupCommonScreen from '@components/Authentication/CommonScreen';
import InputField from '@components/Custom/InputField';
import Typography from '@components/Custom/Typography';
import Button from '@components/Custom/Button';
import Loader2 from '@components/Custom/Loader2';
import { useAuth } from '@context/auth/authContext';
import { useWindowSize } from '@hooks/useWindowSize';
import { SCREEN_SIZES } from '@utils/constants/screen_size';
import { ROUTE_DASHBOARD, ROUTE_ADMIN_DASHBOARD, ROUTE_SIGNUP } from '@utils/constants/page_routes';

/*
 * ONE FIELD FOR THE IDENTIFIER, which is why it is labelled three ways.
 *
 * `POST /user/login` matches whatever is typed here against the account's username, its email
 * (lower-cased) and its phone, so the student does not have to remember which one they signed up
 * with. The value is `.trim()`ed on the way in — Android keyboards add a trailing space after an
 * autocompleted email often enough to matter.
 *
 * WHAT COUNTS AS SIGNED IN IS NOT DECIDED HERE. `login()` writes the A_AUTHTOKEN cookie only
 * once the response carries both a token and a verified email or phone; this screen watches that
 * one flag and leaves for the dashboard when it turns true. So a login that succeeded but landed
 * on an unverified account does not navigate — which is the behaviour of the reference screen.
 */
export default function LoginScreen(props) {
    const { minimal, text } = props;
    const screenSize = useWindowSize();
    const router = useRouter();

    const { loading, login, demoLogin, demoAdminLogin, loginError, authenticToken, user } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const usernameRef = useRef();

    /*
     * In an effect rather than in the render body: `router.push` during a render is a side
     * effect React is entitled to run twice, and in StrictMode it does.
     */
    useEffect(() => {
        if (authenticToken) {
            const isAdmin = ['superadmin', 'admin', 'staff'].includes(user?.role);
            router.push(isAdmin ? ROUTE_ADMIN_DASHBOARD : ROUTE_DASHBOARD);
        }
    }, [authenticToken, user, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        await login({ username, password });
    };

    const goToSignup = () => router.push(ROUTE_SIGNUP);

    const fieldWidth = screenSize === SCREEN_SIZES.MOBILE ? '20rem' : '24.125rem';

    const loginContent = (
        <div className="flex flex-col gap-3">
            {minimal ? null : (
                <Typography variant="h1" className="font-extrabold tracking-wide">
                    {text ? text : 'Welcome!'}
                </Typography>
            )}
            <Typography variant="h5" className="tracking-widest">
                Don’t have an account?
                <button type="button" className="ml-1 text-primary focus:outline-none" onClick={goToSignup}>
                    Sign up
                </button>
            </Typography>

            {/* A named form with a method is another signal Chrome uses to decide this is a
                sign-in form worth offering credentials for. `onSubmit` still preventDefaults,
                so nothing is actually posted anywhere. */}
            <form id="login-form" name="login" method="post" onSubmit={handleLogin}>
                <div className="mt-5 flex flex-col gap-5">
                    <label>
                        <Typography variant="small">Login/Email/Mobile Number</Typography>
                        {/*
                         * THE AUTOFILL ATTRIBUTES ARE LOAD-BEARING, NOT POLISH.
                         *
                         * `autocomplete="username"` + `current-password` is the pair Chrome
                         * matches on directly, with no guessing. autoCapitalize/autoCorrect off
                         * because Android keyboards otherwise capitalise and autocorrect an
                         * email address, and the value is `.trim()`ed but not un-corrected.
                         */}
                        <InputField
                            ref={usernameRef}
                            name="username"
                            id="login-username"
                            autoComplete="username"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            enterKeyHint="next"
                            minWidth={fieldWidth}
                            placeholder="Enter the email id or mobile no."
                            errorText={loginError}
                            onChange={(e) => setUsername(e.target.value.trim())}
                            required
                        />
                    </label>
                    <label>
                        <Typography variant="small">Password</Typography>
                        <InputField
                            name="password"
                            id="login-password"
                            autoComplete="current-password"
                            enterKeyHint="go"
                            minWidth={fieldWidth}
                            type="password"
                            placeholder="Enter the password."
                            errorText={loginError}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <Button icon="rightArrowIcon" className="mt-6 flex-row-reverse gap-3" size="lg" disabled={loading}>
                    {loading ? 'Loading...' : 'Continue'}
                </Button>

                {/* Temporary demo shortcuts: signs in a fake user or admin with no backend call. */}
                <div className="mt-3 flex gap-3">
                    <Button
                        type="button"
                        color="link"
                        icon="rightArrowIcon"
                        className="flex-1 flex-row-reverse gap-2 text-xs"
                        size="sm"
                        disabled={loading}
                        onClick={demoLogin}
                    >
                        {loading ? '...' : 'Demo Student'}
                    </Button>
                    <Button
                        type="button"
                        color="link"
                        icon="rightArrowIcon"
                        className="flex-1 flex-row-reverse gap-2 text-xs"
                        size="sm"
                        disabled={loading}
                        onClick={demoAdminLogin}
                    >
                        {loading ? '...' : 'Demo Admin'}
                    </Button>
                </div>
            </form>
        </div>
    );

    if (loading && !minimal) return <Loader2 />;

    /*
     * `minimal` drops the illustration wrapper so this form can be embedded. The FORM is
     * identical either way; only the surroundings differ.
     */
    return minimal ? (
        loginContent
    ) : (
        <LoginSignupCommonScreen showImage="boyWithLaptop">{loginContent}</LoginSignupCommonScreen>
    );
}
