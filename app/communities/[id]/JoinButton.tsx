"use client";

import { useState } from "react";

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

    const handleJoin = async () => {
        if (joined) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/communities/${communityId}/join`, {
                method: "POST",
            });

            if (res.ok) {
                setMembers((prev) => prev + 1);
                setJoined(true);
            }
        } catch (error) {
            console.error("Failed to join");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleJoin}
            disabled={joined || loading}
            className={`px-6 py-3 rounded-full font-medium transition-all ${joined
                    ? "bg-stone-800 text-stone-400 cursor-default"
                    : "bg-white text-stone-900 hover:bg-stone-100"
                }`}
        >
            {loading ? "Joining..." : joined ? "Joined" : `Join Community (${members})`}
        </button>
    );
}
