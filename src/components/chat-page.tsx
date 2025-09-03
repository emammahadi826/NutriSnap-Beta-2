
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ChatPage() {
    return (
        <Card className="w-full h-[calc(100vh-10rem)]">
            <CardHeader>
                <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This is the chat page. Content coming soon!</p>
            </CardContent>
        </Card>
    );
}
