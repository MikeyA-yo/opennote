"use client";

import { useState } from "react";

interface Track {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    uri: string;
}

export default function PlaylistManager({
    communityId,
    playlistId,
}: {
    communityId: string;
    playlistId: string;
}) {
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState<string | null>(null);

    const [refreshKey, setRefreshKey] = useState(0);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data || []);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTrack = async (trackUri: string, trackId: string) => {
        setAdding(trackId);
        try {
            const res = await fetch(`/api/communities/${communityId}/playlist/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trackUri }),
            });

            if (res.ok) {
                alert("Track added!");
                setIsSearching(false);
                setQuery("");
                setResults([]);
                setRefreshKey((prev) => prev + 1); // Force refresh of iframe
            } else {
                alert("Failed to add track.");
            }
        } catch (error) {
            console.error("Add failed", error);
        } finally {
            setAdding(null);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-stone-900">Community Playlist</h2>
                <div className="flex gap-2">
                    <a
                        href={`https://open.spotify.com/playlist/${playlistId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#1DB954] text-white text-sm font-medium rounded-full hover:bg-[#1ed760] transition-colors flex items-center gap-2"
                    >
                        <span>Open in Spotify</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                    </a>
                    <button
                        onClick={() => setRefreshKey((prev) => prev + 1)}
                        className="px-4 py-2 bg-stone-100 text-stone-600 text-sm font-medium rounded-full hover:bg-stone-200 transition-colors"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsSearching(!isSearching)}
                        className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-full hover:bg-stone-800 transition-colors"
                    >
                        {isSearching ? "Close" : "Add Song"}
                    </button>
                </div>
            </div>

            {isSearching && (
                <div className="mb-8 p-6 bg-white border border-stone-200 rounded-xl shadow-sm">
                    <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for a song..."
                            className="flex-grow px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-base focus:outline-none focus:border-stone-400"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 disabled:opacity-50"
                        >
                            {loading ? "..." : "Search"}
                        </button>
                    </form>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {results.map((track) => (
                            <div
                                key={track.id}
                                className="flex items-center gap-4 p-3 hover:bg-stone-50 rounded-xl group transition-colors"
                            >
                                <img
                                    src={track.album.images[2]?.url}
                                    alt={track.name}
                                    className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                />
                                <div className="flex-grow min-w-0">
                                    <div className="font-medium text-stone-900 truncate">{track.name}</div>
                                    <div className="text-sm text-stone-500 truncate">
                                        {track.artists.map((a) => a.name).join(", ")}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddTrack(track.uri, track.id)}
                                    disabled={adding === track.id}
                                    className="px-4 py-2 text-sm bg-stone-900 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                                >
                                    {adding === track.id ? "Adding..." : "Add"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <iframe
                key={refreshKey}
                style={{ borderRadius: "12px" }}
                src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&t=${refreshKey}`}
                width="100%"
                height="600"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="shadow-sm"
            ></iframe>
        </div>
    );
}
