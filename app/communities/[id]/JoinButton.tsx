"use client";

import { useState, useEffect } from "react";

export default function JoinButton({
    communityId,
    initialMembers
}: {
    communityId: string;
    initialMembers: number;
}) {
    const [members, setMembers] = useState(initialMembers);
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const savedEmail = localStorage.getItem(`joined_${communityId}`);
        if (savedEmail) {
            setJoined(true);
        }
    }, [communityId]);

    const handleJoinClick = () => {
        if (joined) return;
        setShowInput(true);
    };

    const handleConfirmJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/communities/${communityId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setMembers((prev) => prev + 1);
                setJoined(true);
                setShowInput(false);
                localStorage.setItem(`joined_${communityId}`, email);
                localStorage.setItem("user_email", email); // Save globally for writing notes
            }
        } catch (error) {
            console.error("Failed to join", error);
        } finally {
            setLoading(false);
        }
    };

    if (showInput && !joined) {
        return (
            <form onSubmit={handleConfirmJoin} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="px-4 py-3 rounded-full bg-stone-800 text-white border border-stone-700 focus:outline-none focus:border-stone-500 w-full sm:w-auto"
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-full bg-white text-stone-900 font-medium hover:bg-stone-100 disabled:opacity-50 w-full sm:w-auto"
                >
                    {loading ? "..." : "Join"}
                </button>
            </form>
        );
    }

    return (
        <button
            onClick={handleJoinClick}
            disabled={joined || loading}
            className={`px-6 py-3 rounded-full font-medium transition-all ${joined
                ? "bg-stone-800 text-stone-400 cursor-default"
                : "bg-white text-stone-900 hover:bg-stone-100"
                }`}
        >
            {loading ? "Joining..." : joined ? `Joined (${members})` : `Join Community (${members})`}
        </button>
    );
}
