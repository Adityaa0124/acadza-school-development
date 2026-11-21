import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@context/auth/authContext';
import { ROUTE_DASHBOARD, ROUTE_LOGIN } from '@utils/constants/page_routes';
import Loader2 from '@components/Custom/Loader2';

/*
 * There is no landing page in this project — the root is a fork. `authenticToken` is `null`
 * until the cookie has been read, so the effect waits for a real answer rather than sending a
 * signed-in student to /login for one frame.
 */
export default function Home() {
    const router = useRouter();
    const { authenticToken } = useAuth();

    useEffect(() => {
        if (authenticToken === null) return;
        router.replace(authenticToken ? ROUTE_DASHBOARD : ROUTE_LOGIN);
    }, [authenticToken, router]);

    return <Loader2 />;
}
