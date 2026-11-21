export default function Loader2() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div
                className="h-10 w-10 animate-spin rounded-full border-4 border-primary-16 border-t-primary"
                role="status"
                aria-label="Loading"
            />
        </div>
    );
}
