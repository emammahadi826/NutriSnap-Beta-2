
"use client";

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, User, Loader2, Plus, Upload, Camera } from 'lucide-react';
import { nutrisnapChat } from '@/ai/flows/nutrisnap-chat';
import type { NutrisnapChatInput } from '@/lib/chat-types';
import { useAuth } from '@/hooks/use-auth';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMealLogger } from '@/hooks/use-meal-logger';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MealLogDialog } from './meal-log-dialog';


type Message = {
    role: 'user' | 'model';
    content: string;
};


export function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { addMeal, guestMealCount } = useMealLogger();
    const isGuest = !user;


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        try {
             const chatHistory: NutrisnapChatInput['history'] = [...messages, userMessage].map(msg => ({
                role: msg.role,
                content: [{ text: msg.content }]
            }));

            const result = await nutrisnapChat({ history: chatHistory });
            
            const botMessage: Message = { role: 'model', content: result.response };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Error calling chat flow:", error);
            const errorMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
      useEffect(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
    }, [messages]);
    
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                 <div className="space-y-6">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Bot className="w-16 h-16 mb-4" />
                            <h2 className="text-2xl font-bold">NutriSnap Bot</h2>
                            <p>Ask me anything about nutrition, fitness, or your meals!</p>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : '')}>
                            {message.role === 'model' && (
                                <Avatar className="w-8 h-8 border">
                                    <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-prose p-3 rounded-lg",
                                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            )}>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                             {message.role === 'user' && (
                                <Avatar className="w-8 h-8">
                                     <AvatarImage src={user?.photoURL ?? undefined} />
                                    <AvatarFallback>
                                         <User className="w-5 h-5" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-4">
                            <Avatar className="w-8 h-8 border">
                                <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                            </Avatar>
                            <div className="max-w-prose p-3 rounded-lg bg-muted">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
             <div className="p-4 bg-background border-t">
                 <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-muted p-2 rounded-full">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start">
                            <MealLogDialog 
                                onMealLog={addMeal} 
                                isGuest={isGuest} 
                                guestMealCount={guestMealCount}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Meal
                                    </DropdownMenuItem>
                                }
                            />
                            <MealLogDialog 
                                onMealLog={addMeal} 
                                isGuest={isGuest} 
                                guestMealCount={guestMealCount}
                                startWithCamera={true}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Camera className="mr-2 h-4 w-4" />
                                        Take Photo
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full flex-shrink-0">
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
