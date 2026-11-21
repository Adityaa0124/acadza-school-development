import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@context/auth/authContext';
import { ROUTE_DASHBOARD, ROUTE_ADMIN_DASHBOARD, ROUTE_LOGIN } from '@utils/constants/page_routes';
import Loader2 from '@components/Custom/Loader2';

/*
 * There is no landing page in this project — the root is a fork. `authenticToken` is `null`
 * until the cookie has been read, so the effect waits for a real answer rather than sending a
 * signed-in user to /login for one frame.
 */
export default function Home() {
    const router = useRouter();
    const { authenticToken, user } = useAuth();

    useEffect(() => {
        if (authenticToken === null) return;
        if (authenticToken) {
            const isAdmin = ['superadmin', 'admin', 'staff'].includes(user?.role);
            router.replace(isAdmin ? ROUTE_ADMIN_DASHBOARD : ROUTE_DASHBOARD);
        } else {
            router.replace(ROUTE_LOGIN);
        }
    }, [authenticToken, user, router]);

    return <Loader2 />;
}
