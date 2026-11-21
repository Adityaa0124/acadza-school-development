import '@styles/global.css';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { store } from '@redux/Store/index';
import AuthProvider from '@context/auth/authProvider';

/*
 * The provider order matters: AuthProvider dispatches the signed-in account into redux, so it
 * has to sit inside the store's Provider.
 */
export default function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Head>
                    <title>Acadza Schools</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <Component {...pageProps} />
            </AuthProvider>
        </Provider>
    );
}
