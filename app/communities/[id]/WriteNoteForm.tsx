"use client";

import { useState, useEffect } from "react";

export default function WriteNoteForm({ communityId, onNoteCreated }: { communityId: string, onNoteCreated: () => void }) {
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        const checkMembership = () => {
            // Check if user has joined this specific community
            const joinedEmail = localStorage.getItem(`joined_${communityId}`);
            if (joinedEmail) {
                setIsMember(true);
                setEmail(joinedEmail);
            } else {
                // Fallback to global email if available, but they still need to join
                const globalEmail = localStorage.getItem("user_email");
                if (globalEmail) setEmail(globalEmail);
            }
        };
        checkMembership();
        window.addEventListener("community_joined", checkMembership);
        return () => window.removeEventListener("community_joined", checkMembership);
    }, [communityId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";

            if (file) {
                setUploading(true);
                const uploadData = new FormData();
                uploadData.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadRes.ok) throw new Error("Image upload failed");

                const uploadJson = await uploadRes.json();
                imageUrl = uploadJson.secure_url;
                setUploading(false);
            }

            const res = await fetch(`/api/communities/${communityId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, content, imageUrl }),
            });

            if (res.ok) {
                setContent("");
                setFile(null);
                onNoteCreated();
            } else {
                alert("Failed to post note");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    if (!isMember) {
        return (
            <div className="bg-stone-50 rounded-xl p-12 text-center border border-stone-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center mb-4 text-2xl">
                    🔒
                </div>
                <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">Members Only</h3>
                <p className="text-stone-500 mb-6 max-w-sm">
                    You must be a member of this community to share your notes and memories.
                </p>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                    Join Community
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm mb-8">
            <h3 className="font-serif text-lg mb-4">Write a Note</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        required
                        rows={3}
                        placeholder="Share your memory..."
                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-stone-500 mb-2">Add an Image (Optional)</label>
                    <div className="flex items-center gap-4">
                        <label className="cursor-pointer px-4 py-2 border border-stone-200 rounded-lg text-xs hover:bg-stone-50 transition-colors">
                            Choose File
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                        {file && <span className="text-xs text-stone-600 truncate max-w-[200px]">{file.name}</span>}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? (uploading ? "Uploading..." : "Posting...") : "Post Note"}
                    </button>
                </div>
            </form>
        </div>
    );
}
