"use client";

import { useState, useEffect, useCallback } from "react";
import WriteNoteForm from "./WriteNoteForm";

interface Note {
    _id: string;
    authorEmail: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

export default function CommunityNotes({ communityId }: { communityId: string }) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

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
                    {notes.map((note) => (
                        <div key={note._id} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-sm font-medium text-stone-900">{note.authorEmail}</div>
                                <div className="text-xs text-stone-400">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <p className="text-stone-700 whitespace-pre-wrap font-serif leading-relaxed mb-4">
                                {note.content}
                            </p>
                            {note.imageUrl && (
                                <img
                                    src={note.imageUrl}
                                    alt="Note attachment"
                                    className="rounded-lg max-h-96 object-cover w-full"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
