import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Community from "@/models/Community";
import { notFound } from "next/navigation";
import JoinButton from "./JoinButton";
import CommunityNotes from "./CommunityNotes";
async function getCommunity(id: string) {
    try {
        await connectToDatabase();
        const community = await Community.findById(id).lean();
        if (!community) return null;
        return JSON.parse(JSON.stringify(community));
    } catch (error) {
        return null;
    }
}

export default async function CommunityPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const community = await getCommunity(id);

    if (!community) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="text-2xl font-serif font-bold tracking-tight">OpenNote.</Link>
                <div className="space-x-6 text-sm font-medium text-stone-600">
                    <Link href="#" className="hover:text-stone-900 transition-colors">Read</Link>
                    <Link href="/communities" className="text-stone-900 transition-colors">Communities</Link>
                    <Link href="/about" className="hover:text-stone-900 transition-colors">About</Link>
                    <Link href="/communities/create" className="px-4 py-2 bg-stone-900 text-stone-50 rounded-full hover:bg-stone-800 transition-colors">
                        Write a Note
                    </Link>
                </div>
            </nav>

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

                            <div className="flex items-center gap-6">
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
                            <h2 className="text-2xl font-serif mb-6 text-stone-900">Community Notes</h2>
                            <CommunityNotes communityId={community._id} />
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
