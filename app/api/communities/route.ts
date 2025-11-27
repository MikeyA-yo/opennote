import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Community from "@/models/Community";

export async function GET() {
    try {
        await connectToDatabase();
        const communities = await Community.find({}).sort({ createdAt: -1 });
        return NextResponse.json(communities);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch communities" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const community = await Community.create(body);
        return NextResponse.json(community, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create community" },
            { status: 500 }
        );
    }
}
