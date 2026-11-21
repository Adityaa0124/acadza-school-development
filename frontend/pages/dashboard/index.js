import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@context/auth/authContext';
import Typography from '@components/Custom/Typography';
import Button from '@components/Custom/Button';
import Loader2 from '@components/Custom/Loader2';
import { ROUTE_LOGIN } from '@utils/constants/page_routes';

/*
 * The only page behind the sign-in, and it is deliberately one screen: this project exists to
 * carry login and register, and the dashboard is where they land.
 *
 * `authenticToken` has three states and all three are handled: `null` means the cookie has not
 * been read yet and the page waits, `false` sends the visitor to /login, `true` renders. Treating
 * `null` as "not signed in" would bounce a signed-in student out on every hard refresh.
 */
export default function Dashboard() {
    const router = useRouter();
    const { user, authenticToken, logout } = useAuth();

    useEffect(() => {
        if (authenticToken === false) router.replace(ROUTE_LOGIN);
    }, [authenticToken, router]);

    const handleLogout = () => {
        logout();
        router.replace(ROUTE_LOGIN);
    };

    if (!authenticToken) return <Loader2 />;

    return (
        <div className="min-h-screen bg-hotlightgreen">
            <header className="flex items-center justify-between bg-white px-5 py-4 md:px-10">
                <div>
                    <span className="text-[1.5rem] font-extrabold tracking-wide text-primary">Acadza</span>
                    <span className="ml-2 text-[0.875rem] text-muted">Schools</span>
                </div>
                <Button type="button" size="sm" onClick={handleLogout} className="w-auto">
                    Logout
                </Button>
            </header>

            <main className="mx-auto max-w-3xl px-5 py-16 md:py-24">
                <Typography variant="h1" className="font-extrabold tracking-wide">
                    Welcome to dashboard
                </Typography>
                {user?.name ? (
                    <Typography variant="h3" className="mt-2 text-muted">
                        {user.name}
                    </Typography>
                ) : null}

                <div className="mt-10 rounded-xl bg-white p-6">
                    <Typography variant="h5" className="font-bold">
                        Your account
                    </Typography>
                    <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            ['Username', user?.username],
                            ['Email', user?.email],
                            ['Mobile', user?.phone],
                            ['Course', user?.course],
                            ['Role', user?.role],
                            ['Plan', user?.planType],
                        ].map(([label, value]) => (
                            <div key={label}>
                                <dt className="text-[0.75rem] uppercase tracking-widest text-muted">{label}</dt>
                                <dd className="text-[0.875rem] text-black">{value || '—'}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </main>
        </div>
    );
}
