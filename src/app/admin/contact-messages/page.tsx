"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Contact = {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    status: "new" | "read";
    createdAt: string;
};
export default function ContactMessages() {

    const [messages, setMessages] = useState<Contact[]>([]);
    const [open, setOpen] = useState<string | null>(null);

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [readingId, setReadingId] = useState<string | null>(null);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get("/api/contact-us");
            setMessages(data);
        } catch {
            toast.error("Failed to load messages");
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const toggleAccordion = async (msg: Contact) => {

        if (open === msg.id) {
            setOpen(null);
            return;
        }

        setOpen(msg.id);

        if (msg.status === "new") {

            setReadingId(msg.id);

            try {

                await axios.patch(`/api/contact-us/${msg.id}`);

                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === msg.id ? { ...m, status: "read" } : m
                    )
                );

            } catch {
                toast.error("Failed to update status");
            } finally {
                setReadingId(null);
            }
        }
    };

    const deleteMessage = async (id: string) => {

        setDeletingId(id);

        try {

            await axios.delete(`/api/contact-us/${id}`);

            setMessages((prev) => prev.filter((m) => m.id !== id));

            toast.success("Message deleted");

        } catch {

            toast.error("Delete failed");

        } finally {
            setDeletingId(null);
        }
    };

    if (messages.length === 0) {
        return (
            <div className="text-center py-16 border rounded-lg bg-muted/20">
                <h2 className="text-xl font-semibold mb-2">
                    No Messages Yet
                </h2>
                <p className="text-muted-foreground">
                    When someone submits the contact form, their message will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-w-4xl">

            {messages.map((msg) => {

                const isOpen = open === msg.id;

                return (
                    <div key={msg.id} className="border rounded-lg">

                        {/* Header */}
                        <div
                            onClick={() => toggleAccordion(msg)}
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted"
                        >

                            <div className="flex items-center gap-3">

                                {/* Status indicator */}
                                <span className="flex items-center justify-center w-4 h-4">

                                    {readingId === msg.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                                    ) : (
                                        <span
                                            className={`w-3 h-3 rounded-full ${msg.status === "new"
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                                }`}
                                        />
                                    )}

                                </span>

                                <div>
                                    <p className="font-semibold">{msg.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {msg.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">

                                <Button
                                    variant="destructive"
                                    size="icon"
                                    disabled={!!deletingId}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteMessage(msg.id);
                                    }}
                                >

                                    {deletingId === msg.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}

                                </Button>

                                {isOpen ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </div>
                        </div>

                        {/* Body */}
                        {isOpen && (
                            <div className="p-4 border-t space-y-3">

                                {msg.subject && (
                                    <div>
                                        <p className="font-semibold">Subject</p>
                                        <p>{msg.subject}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="font-semibold">Message</p>
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {msg.message}
                                    </p>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </p>

                            </div>
                        )}
                    </div>
                );
            })}

        </div>
    );
}