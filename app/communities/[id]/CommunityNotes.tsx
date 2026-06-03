"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import WriteNoteForm from "./WriteNoteForm";

interface Note {
    _id: string;
    authorEmail: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    likes: string[];
    commentsCount: number;
}

export default function CommunityNotes({ communityId }: { communityId: string }) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const checkMembership = () => {
            const joinedEmail = localStorage.getItem(`joined_${communityId}`);
            const globalEmail = localStorage.getItem("user_email");
            setCurrentUserEmail(joinedEmail || globalEmail);
        };
        checkMembership();
        window.addEventListener("community_joined", checkMembership);
        return () => window.removeEventListener("community_joined", checkMembership);
    }, [communityId]);

    const fetchNotes = useCallback(async () => {
        try {
            const res = await fetch(`/api/communities/${communityId}/notes`);
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (error) {
            console.error("Failed to fetch notes");
        } finally {
            setLoading(false);
        }
    }, [communityId]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleLike = async (noteId: string, currentLikes: string[]) => {
        if (!currentUserEmail) return;

        // Optimistic update
        const isLiked = currentLikes.includes(currentUserEmail);
        const newLikes = isLiked
            ? currentLikes.filter((e) => e !== currentUserEmail)
            : [...currentLikes, currentUserEmail];

        setNotes((prev) =>
            prev.map((n) => (n._id === noteId ? { ...n, likes: newLikes } : n))
        );

        try {
            await fetch(`/api/notes/${noteId}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: currentUserEmail }),
            });
        } catch (error) {
            console.error("Like failed", error);
            fetchNotes(); // Revert on error
        }
    };

    const renderContentWithLinks = (text: string) => {
        const parts: React.ReactNode[] = [];
        const urlRegex = /https?:\/\/[^\s]+/g;
        let lastIndex = 0;
        let match = urlRegex.exec(text);

        while (match) {
            const rawUrl = match[0];
            const start = match.index;
            const end = start + rawUrl.length;

            if (start > lastIndex) {
                parts.push(text.slice(lastIndex, start));
            }

            // Keep trailing punctuation outside the anchor.
            const cleanedUrl = rawUrl.replace(/[),.!?;:]+$/, "");
            const trailing = rawUrl.slice(cleanedUrl.length);

            parts.push(
                <a
                    key={`${cleanedUrl}-${start}`}
                    href={cleanedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-900 underline decoration-stone-400 underline-offset-2 hover:decoration-stone-900 cursor-pointer pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {cleanedUrl}
                </a>
            );

            if (trailing) {
                parts.push(trailing);
            }

            lastIndex = end;
            match = urlRegex.exec(text);
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts;
    };

    return (
        <div className="space-y-8">
            <WriteNoteForm communityId={communityId} onNoteCreated={fetchNotes} />

            {loading ? (
                <div className="text-center py-12 text-stone-400">Loading notes...</div>
            ) : notes.length === 0 ? (
                <div className="bg-stone-50 rounded-xl p-12 text-center border border-stone-100">
                    <p className="text-stone-500">No notes yet. Be the first to write one.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {notes.map((note) => {
                        const isLiked = currentUserEmail ? note.likes?.includes(currentUserEmail) : false;
                        return (
                            <div key={note._id} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-sm font-medium text-stone-900">{note.authorEmail}</div>
                                    <div className="text-xs text-stone-400">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-stone-700 whitespace-pre-wrap font-serif leading-relaxed mb-4 wrap-break-word">
                                    {renderContentWithLinks(note.content)}
                                </div>
                                {note.imageUrl && (
                                    <img
                                        src={note.imageUrl}
                                        alt="Note attachment"
                                        className="rounded-lg max-h-64 object-cover w-full mb-4"
                                    />
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => handleLike(note._id, note.likes || [])}
                                            disabled={!currentUserEmail}
                                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? "text-red-500" : "text-stone-400 hover:text-stone-600"
                                                }`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill={isLiked ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                                />
                                            </svg>
                                            {note.likes?.length || 0}
                                        </button>
                                        <Link
                                            href={`/communities/${communityId}/${note._id}`}
                                            className="flex items-center gap-2 text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                                />
                                            </svg>
                                            {note.commentsCount || 0}
                                        </Link>
                                    </div>

                                    <Link
                                        href={`/communities/${communityId}/${note._id}`}
                                        className="px-4 py-2 bg-stone-100 text-stone-600 text-sm font-medium rounded-full hover:bg-stone-200 transition-colors"
                                    >
                                        View Full
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
