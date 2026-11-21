import React from 'react';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import { AuthContext } from '@context/auth/authContext';
import { COOKIE_TOKEN, COOKIE_USER, COOKIE_AUTHTOKEN } from '@utils/constants/cookies';
import axiosInstance from '@utils/axios';
import { API_EMAIL_LOGIN, API_USER_DETAILS } from '@utils/constants/api_routes/auth';
import update_user_data from '@redux/Actions/UserDataAction';
import { safeUser } from '@utils/functions/safe_user';

/*
 * THE THREE COOKIES, AND WHY THERE ARE THREE.
 *
 *   A_USER      the cached account, so a reload paints the dashboard without a round trip
 *   A_TOKEN     the bearer token every request carries
 *   A_AUTHTOKEN "this session is usable" — a token ALONE is not enough; the account must also
 *               have a verified email or phone. The login screen watches this one and nothing
 *               else to decide it is time to leave for the dashboard.
 *
 * Same names and same nine-day life as student-frontend, so the shape of a signed-in browser is
 * recognisable between the two.
 */
function AuthProvider(props) {
    const { updateUserData } = props; // Redux prop for userData stored in global state
    const authenticTokenLoad = cookie.load(COOKIE_AUTHTOKEN);

    const [user, setUser] = React.useState(safeUser(cookie.load(COOKIE_USER)) || {});
    const [token, setToken] = React.useState(cookie.load(COOKIE_TOKEN) || null);
    const [loading, setLoading] = React.useState(false);
    const [authenticToken, setAuthenticToken] = React.useState(null);
    const [loginError, setLoginError] = React.useState();

    const expires = new Date();
    expires.setDate(expires.getDate() + 9);

    /*
     * `null` until the cookie has been read, and only then true or false. The three states are
     * what let the dashboard tell "not signed in" from "not checked yet" and avoid bouncing a
     * signed-in student back to /login for one frame on a hard refresh.
     */
    React.useEffect(() => {
        setAuthenticToken(authenticTokenLoad === true || authenticTokenLoad === 'true');
    }, [authenticTokenLoad]);

    const initProcess = () => {
        setLoading(true);
        setLoginError('');
    };

    const handleUser = async (data) => {
        const safe = safeUser(data);

        await cookie.save(COOKIE_USER, safe, { path: '/', expires: expires });

        setUser(safe);
        axiosInstance.defaults.headers['course'] = data?.course;
        updateUserData(safe);
    };

    const handleToken = (data) => {
        cookie.save(COOKIE_TOKEN, data, { path: '/', expires: expires });
        setToken(data);
    };

    const handleAuthToken = async (Authtoken, emailVerified, phoneVerified) => {
        if (Authtoken && (emailVerified === true || phoneVerified === true)) {
            cookie.save(COOKIE_AUTHTOKEN, true, { path: '/', expires: expires });
            setAuthenticToken(true);
        } else {
            cookie.save(COOKIE_AUTHTOKEN, false, { path: '/', expires: expires });
            setAuthenticToken(false);
        }
    };

    /*
     * POST /user/login with { username, password }, where `username` is the one field the
     * student typed — login, email or mobile. The endpoint answers
     * { isSuccessful, message, user, token }; a failure is a 200 with `isSuccessful: false` and
     * a message meant to be shown as it is ("User not found", "Incorrect password"), which is
     * why the message is read off the body and not off an HTTP status.
     */
    const login = async (data) => {
        var res;
        initProcess();

        res = await axiosInstance
            .post(API_EMAIL_LOGIN, { username: data?.username, password: data?.password })
            .catch((error) => {
                console.log('cred login error: ', error);
                logout();
                setLoginError('Unable to login, please try again');
            });

        if (res?.data?.isSuccessful) {
            axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res?.data?.token;

            await handleUser(res.data.user);

            // Saving User Token
            handleAuthToken(res.data.token, res.data.user.emailVerified, res.data.user.phoneVerified);
            handleToken(res.data.token);
        } else {
            logout();
            setLoginError(res?.data?.message);
        }
        setLoading(false);
    };

    const loadUserData = async () => {
        if (!user?._id) return;
        const res = await axiosInstance.post(API_USER_DETAILS, { userid: user._id }).catch((error) => {
            console.log('load user error: ', error);
        });
        if (res?.data) {
            await handleUser(res.data);
        }
    };

    const logout = () => {
        setAuthenticToken(false);
        cookie.remove(COOKIE_USER, { path: '/' });
        cookie.remove(COOKIE_TOKEN, { path: '/' });
        cookie.remove(COOKIE_AUTHTOKEN, { path: '/' });
        delete axiosInstance.defaults.headers['Authorization'];
        setUser(null);
        setToken(null);
        setLoginError('');
        setLoading(false);

        updateUserData(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                authenticToken,
                // Auth
                loginError,

                login,
                logout,
                loadUserData,
                handleToken,
                handleAuthToken,
                handleUser,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserData: (userData) => {
            dispatch(update_user_data(userData));
        },
    };
};

export default connect(null, mapDispatchToProps)(AuthProvider);
