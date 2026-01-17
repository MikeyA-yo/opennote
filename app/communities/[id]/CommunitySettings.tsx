"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CommunitySettingsProps {
    communityId: string;
    creatorEmail: string;
    initialIsPrivate: boolean;
}

export default function CommunitySettings({
    communityId,
    creatorEmail,
    initialIsPrivate,
}: CommunitySettingsProps) {
    const router = useRouter();
    const [isCreator, setIsCreator] = useState(false);
    const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem("user_email");
        if (userEmail === creatorEmail) {
            setIsCreator(true);
        }
    }, [creatorEmail]);

    const handleToggle = async () => {
        setLoading(true);
        try {
            const newState = !isPrivate;
            const res = await fetch(`/api/communities/${communityId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPrivate: newState }),
            });

            if (res.ok) {
                setIsPrivate(newState);
                router.refresh();
            } else {
                alert("Failed to update settings");
            }
        } catch (error) {
            console.error("Failed to update settings", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isCreator) return null;

    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 mt-8">
            <h3 className="font-serif text-lg mb-4 text-stone-900">Community Settings</h3>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-stone-900">Private Community</h4>
                    <p className="text-sm text-stone-500">
                        {isPrivate
                            ? "Only visible via direct link or specific search."
                            : "Visible to everyone on the communities page."}
                    </p>
                </div>
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 ${isPrivate ? "bg-stone-900" : "bg-stone-200"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivate ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
            </div>
        </div>
    );
}
