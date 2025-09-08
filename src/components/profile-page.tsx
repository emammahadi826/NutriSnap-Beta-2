
"use client";

export function ProfilePage() {
    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">User Profile</h1>
                <p className="text-muted-foreground">View your profile information below.</p>
            </header>
            <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-card">
                <h2 className="text-xl font-semibold">Under Construction</h2>
                <p className="text-muted-foreground mt-2">
                    This profile page is currently being built. More features coming soon!
                </p>
            </div>
        </div>
    );
}
