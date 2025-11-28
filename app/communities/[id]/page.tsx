import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Community from "@/models/Community";
import Member from "@/models/Member";
import { notFound } from "next/navigation";
import JoinButton from "./JoinButton";
import CommunityNotes from "./CommunityNotes";
import PlaylistManager from "./PlaylistManager";

export const dynamic = "force-dynamic";

async function getCommunity(id: string) {
    try {
        await connectToDatabase();
        const community = await Community.findById(id).lean();
        if (!community) return null;

        // Get real member count
        const memberCount = await Member.countDocuments({ communityId: id });
        community.members = memberCount;

        return JSON.parse(JSON.stringify(community));
    } catch (error) {
        return null;
    }
}

export default async function CommunityPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ view?: string }>;
}) {
    const { id } = await params;
    const { view } = await searchParams;
    const community = await getCommunity(id);

    if (!community) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                {/* Header Section */}
                <div className="relative h-80 md:h-96 w-full bg-stone-900">
                    <img
                        src={community.imageUrl}
                        alt={community.name}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                        <div className="max-w-7xl mx-auto">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium uppercase tracking-wider rounded-full mb-4">
                                {community.type}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">{community.name}</h1>
                            <p className="text-lg text-stone-200 max-w-2xl mb-8">{community.description}</p>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                <JoinButton communityId={community._id} initialMembers={community.members || 0} />
                                <div className="text-stone-300 text-sm">
                                    Created {new Date(community.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto py-12 px-6">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="flex-grow">
                            {/* Tabs */}
                            <div className="flex gap-8 border-b border-stone-200 mb-8">
                                <Link
                                    href={`/communities/${id}`}
                                    className={`pb-4 text-sm font-medium transition-colors relative ${!view || view === "notes"
                                        ? "text-stone-900"
                                        : "text-stone-500 hover:text-stone-700"
                                        }`}
                                >
                                    Notes
                                    {(!view || view === "notes") && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-900" />
                                    )}
                                </Link>
                                <Link
                                    href={`/communities/${id}?view=playlist`}
                                    className={`pb-4 text-sm font-medium transition-colors relative ${view === "playlist"
                                        ? "text-stone-900"
                                        : "text-stone-500 hover:text-stone-700"
                                        }`}
                                >
                                    Playlist
                                    {view === "playlist" && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-900" />
                                    )}
                                </Link>
                            </div>

                            {view === "playlist" ? (
                                community.spotifyPlaylistId ? (
                                    <PlaylistManager
                                        communityId={community._id}
                                        playlistId={community.spotifyPlaylistId}
                                    />
                                ) : (
                                    <div className="bg-stone-50 rounded-xl p-12 text-center border border-stone-100">
                                        <h3 className="font-serif text-xl mb-4">Community Playlist</h3>
                                        <p className="text-stone-600 mb-6 max-w-md mx-auto">
                                            Create a collaborative playlist for this community on Spotify.
                                        </p>
                                        <a
                                            href={`/api/spotify/login?communityId=${community._id}`}
                                            className="inline-block px-6 py-3 bg-[#1DB954] text-white font-medium rounded-full hover:bg-[#1ed760] transition-colors"
                                        >
                                            Connect Spotify
                                        </a>
                                    </div>
                                )
                            ) : (
                                <>
                                    <h2 className="text-2xl font-serif mb-6 text-stone-900">Community Notes</h2>
                                    <CommunityNotes communityId={community._id} />
                                </>
                            )}
                        </div>

                        <div className="w-full md:w-80 flex-shrink-0">
                            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 sticky top-6">
                                <h3 className="font-serif text-lg mb-4">About</h3>
                                <p className="text-sm text-stone-600 mb-6">
                                    This community is a space for memories, messages, and open notes dedicated to {community.name}.
                                </p>
                                <div className="border-t border-stone-200 pt-4">
                                    <div className="text-xs text-stone-400 uppercase tracking-wider mb-2">Stats</div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-stone-600">Members</span>
                                        <span className="font-medium">{community.members || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
