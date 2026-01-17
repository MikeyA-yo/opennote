import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Community from "@/models/Community";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectToDatabase();

        const community = await Community.findByIdAndUpdate(
            id,
            { $set: body },
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
        return NextResponse.json(
            { error: "Failed to update community" },
            { status: 500 }
        );
    }
}
