import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Community from "@/models/Community";

async function getCommunities(search?: string) {
    try {
        await connectToDatabase();

        let query: any = {};
        if (search) {
            query.name = { $regex: search, $options: "i" };
        } else {
            query.isPrivate = { $ne: true };
        }

        // Plain object serialization for Next.js
        const communities = await Community.find(query).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(communities));
    } catch (error) {
        return [];
    }
}

import CommunitySearch from "./CommunitySearch";

export default async function CommunitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const { search } = await searchParams;
    const communities = await getCommunities(search);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow py-12 px-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-serif font-medium mb-4 text-stone-900">Explore Communities</h1>
                        <p className="text-stone-600">Find a space to share your memories.</p>
                    </div>
                    <CommunitySearch />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {communities.map((community: any) => (
                        <Link href={`/communities/${community._id}`} key={community._id} className="group cursor-pointer">
                            <div className="bg-white border border-stone-100 rounded-2xl shadow-sm group-hover:shadow-md transition-all h-full flex flex-col overflow-hidden">
                                <div className="h-48 w-full relative bg-stone-200">
                                    <img src={community.imageUrl} alt={community.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                                        {community.type}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-serif mb-2 group-hover:text-stone-700 transition-colors">
                                        {community.name}
                                    </h3>
                                    <p className="text-stone-500 text-sm line-clamp-3 mb-4 flex-grow">
                                        {community.description}
                                    </p>
                                    <div className="text-xs text-stone-400">
                                        Created {new Date(community.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {communities.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-stone-500 mb-6">No communities found yet.</p>
                        <Link href="/communities/create" className="px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors">
                            Create the first one
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
