import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Community from "@/models/Community";
import Member from "@/models/Member";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await connectToDatabase();

        // Check if already a member
        const existingMember = await Member.findOne({ communityId: id, email });
        if (existingMember) {
            return NextResponse.json({ message: "Already a member" }, { status: 200 });
        }

        // Create member
        await Member.create({ communityId: id, email });

        // Increment community count
        const community = await Community.findByIdAndUpdate(
            id,
            { $inc: { members: 1 } },
            { new: true }
        );

        if (!community) {
            return NextResponse.json(
                { error: "Community not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(community);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to join community" },
            { status: 500 }
        );
    }
}
