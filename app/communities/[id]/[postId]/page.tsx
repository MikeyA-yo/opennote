"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";

interface Note {
    _id: string;
    authorEmail: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    likes: string[];
    commentsCount: number;
}

interface Comment {
    _id: string;
    authorEmail: string;
    content: string;
    createdAt: string;
}

export default function PostDetailPage({
    params,
}: {
    params: Promise<{ id: string; postId: string }>;
}) {
    const { id: communityId, postId } = use(params);

    const [note, setNote] = useState<Note | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentContent, setCommentContent] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // Try to get email from community specific join or global
        const joinedEmail = localStorage.getItem(`joined_${communityId}`);
        const globalEmail = localStorage.getItem("user_email");
        setCurrentUserEmail(joinedEmail || globalEmail);
    }, [communityId]);

    const fetchNote = useCallback(async () => {
        try {
            const res = await fetch(`/api/notes/${postId}`);
            if (res.ok) {
                const data = await res.json();
                setNote(data);
            } else {
                // Handle 404 or error
            }
        } catch (error) {
            console.error("Failed to fetch note", error);
        }
    }, [postId]);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/notes/${postId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    }, [postId]);

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchNote(), fetchComments()]).finally(() => setLoading(false));
    }, [fetchNote, fetchComments]);

    const handleLike = async () => {
        if (!currentUserEmail || !note) return;

        // Optimistic update
        const isLiked = note.likes.includes(currentUserEmail);
        const newLikes = isLiked
            ? note.likes.filter((e) => e !== currentUserEmail)
            : [...note.likes, currentUserEmail];

        setNote({ ...note, likes: newLikes });

        try {
            await fetch(`/api/notes/${postId}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: currentUserEmail }),
            });
            // Ideally re-fetch or rely on optimistic update
        } catch (error) {
            console.error("Like failed", error);
            // Revert on error (could implement revert logic here)
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim() || !currentUserEmail) return;

        setSubmittingComment(true);
        try {
            const res = await fetch(`/api/notes/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: currentUserEmail,
                    content: commentContent,
                }),
            });

            if (res.ok) {
                setCommentContent("");
                fetchComments(); // Refresh comments
                // Update comment count locally
                if (note) {
                    setNote({ ...note, commentsCount: (note.commentsCount || 0) + 1 });
                }
            }
        } catch (error) {
            console.error("Comment failed", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-stone-400">Loading...</div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-stone-500">Note not found</div>
            </div>
        );
    }

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

    const isLiked = currentUserEmail ? note.likes.includes(currentUserEmail) : false;

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <Link
                    href={`/communities/${communityId}`}
                    className="inline-flex items-center text-stone-500 hover:text-stone-900 mb-8 transition-colors"
                >
                    ← Back to Community
                </Link>

                <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-sm font-medium text-stone-900">{note.authorEmail}</div>
                            <div className="text-xs text-stone-400">
                                {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="text-lg text-stone-800 whitespace-pre-wrap font-serif leading-relaxed mb-6 wrap-break-word">
                            {renderContentWithLinks(note.content)}
                        </div>
                        {note.imageUrl && (
                            <img
                                src={note.imageUrl}
                                alt="Note attachment"
                                className="rounded-lg max-h-[500px] object-cover w-full mb-6"
                            />
                        )}

                        <div className="flex items-center gap-6 pt-6 border-t border-stone-100">
                            <button
                                onClick={handleLike}
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
                                {note.likes.length}
                            </button>
                            <div className="flex items-center gap-2 text-sm font-medium text-stone-400">
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
                                {note.commentsCount || comments.length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="font-serif text-xl text-stone-900 mb-6">Comments</h3>

                    {currentUserEmail ? (
                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm mb-3"
                                rows={3}
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submittingComment || !commentContent.trim()}
                                    className="px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                                >
                                    {submittingComment ? "Posting..." : "Post Comment"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-stone-100 p-6 rounded-xl text-center mb-8">
                            <p className="text-stone-500 text-sm">Join the community to like and comment.</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-stone-400 text-sm italic">No comments yet.</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id} className="bg-white p-6 rounded-xl border border-stone-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm font-medium text-stone-900">{comment.authorEmail}</div>
                                        <div className="text-xs text-stone-400">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-stone-700 text-sm">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
