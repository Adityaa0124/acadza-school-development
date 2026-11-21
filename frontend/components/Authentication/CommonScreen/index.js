/*
 * The two-column frame both auth screens sit in: the form on the left, an illustration panel on
 * the right that is hidden below `md` so a phone gets the full width for the form.
 *
 * student-frontend puts a different illustration behind each step (`boyWithLaptop` on login,
 * `boyWithMobile` / `boyWithOtp` / `enjoyingBoy` across the three signup steps). There are no
 * image assets in this project, so the same keys select a caption instead — the structure and
 * the prop are the ones from there, so dropping real artwork in means changing only this file.
 */
const PANEL = {
    boyWithLaptop: 'Welcome back',
    boyWithMobile: 'Let’s get you started',
    boyWithOtp: 'Check your messages',
    enjoyingBoy: 'Almost there',
};

export default function LoginSignupCommonScreen(props) {
    const { children, showImage } = props;

    return (
        <div className="flex min-h-screen w-full">
            <div className="w-full flex-col md:w-1/2">
                <div className="mt-5 pl-5 md:mt-20 md:pl-24">
                    <span className="text-[1.5rem] font-extrabold tracking-wide text-primary">Acadza</span>
                    <span className="ml-2 text-[0.875rem] text-muted">Schools</span>
                </div>
                <div className="flex h-auto w-full items-center justify-center px-5 py-10 md:mt-14">{children}</div>
            </div>
            <div className="hidden w-1/2 items-center justify-center bg-hotlightgreen md:flex">
                <div className="max-w-sm px-10 text-center">
                    <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-primary-8">
                        <span className="text-[2.75rem] font-extrabold text-primary">A</span>
                    </div>
                    <p className="text-[1.5rem] font-bold leading-[140%] text-black">
                        {PANEL[showImage] || PANEL.boyWithLaptop}
                    </p>
                    <p className="mt-3 text-[0.875rem] leading-[140%] text-muted">
                        Log in or create an account to reach your dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
}
