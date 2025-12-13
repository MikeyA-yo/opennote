"use client";

import { useState } from "react";

interface Track {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    uri: string;
}

import { useToast } from "@/app/components/Toast";

// ... (keep Track interface)

export default function PlaylistManager({
    communityId,
    playlistId,
}: {
    communityId: string;
    playlistId: string;
}) {
    const { success, error } = useToast();
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState<string | null>(null);
    const [recentlyAdded, setRecentlyAdded] = useState<Track[]>([]);

    const [refreshKey, setRefreshKey] = useState(0);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data || []);
        } catch (err) {
            console.error("Search failed", err);
            error("Failed to search tracks");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTrack = async (track: Track) => {
        setAdding(track.id);
        try {
            const res = await fetch(`/api/communities/${communityId}/playlist/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trackUri: track.uri }),
            });

            if (res.ok) {
                success(`Added "${track.name}" to playlist!`);
                setRecentlyAdded((prev) => [track, ...prev]);
                setIsSearching(false);
                setQuery("");
                setResults([]);
                setRefreshKey((prev) => prev + 1); // Force refresh of iframe
            } else {
                error("Failed to add track.");
            }
        } catch (err) {
            console.error("Add failed", err);
            error("Something went wrong");
        } finally {
            setAdding(null);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
                <h2 className="text-2xl font-serif text-stone-900">Community Playlist</h2>
                <div className="flex flex-wrap gap-2">
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

            {recentlyAdded.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <h4 className="text-sm font-medium text-green-900 mb-3 flex items-center gap-2">
                        <span>✨</span> Recently Added
                    </h4>
                    <div className="space-y-2">
                        {recentlyAdded.map((track, i) => (
                            <div key={`${track.id}-${i}`} className="flex items-center gap-3 bg-white/50 p-2 rounded-lg">
                                <img src={track.album.images[2]?.url} alt={track.name} className="w-8 h-8 rounded shadow-sm" />
                                <div className="text-sm min-w-0">
                                    <div className="font-medium text-green-900 truncate">{track.name}</div>
                                    <div className="text-green-700 text-xs truncate">{track.artists[0].name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isSearching && (
                <div className="mb-8 p-6 bg-white border border-stone-200 rounded-xl shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
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
                            className="w-full sm:w-auto px-6 py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 disabled:opacity-50"
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
                                    onClick={() => handleAddTrack(track)}
                                    disabled={adding === track.id}
                                    className="px-4 py-2 text-sm bg-stone-900 text-white rounded-full transition-all disabled:opacity-50"
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
                src={`https://open.spotify.com/embed/playlist/${playlistId}?v=${refreshKey}`}
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
