import axios from 'axios';
import cookie from 'react-cookies';
import { API_URL } from '@utils/constants';
import { COOKIE_TOKEN, COOKIE_USER } from '@utils/constants/cookies';

const token = cookie.load(COOKIE_TOKEN);
const userData = cookie.load(COOKIE_USER);

/*
 * The shared instance of student-frontend: one base URL, the bearer token from the cookie as the
 * default Authorization header, and the account's course sent along as its own header. The token
 * read here is the one present at module load; `login()` sets
 * `axiosInstance.defaults.headers['Authorization']` itself so the first call after signing in
 * does not have to wait for a reload.
 */
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 60000,
    headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        accept: 'application/json',
        course: userData?.course,
    },
});

export default axiosInstance;
