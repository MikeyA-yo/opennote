import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Note from "@/models/Note";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const notes = await Note.find({ communityId: id }).sort({ createdAt: -1 });
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch notes" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { email, content, imageUrl } = await request.json();

        if (!email || !content) {
            return NextResponse.json(
                { error: "Email and content are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const note = await Note.create({
            communityId: id,
            authorEmail: email,
            content,
            imageUrl,
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create note" },
            { status: 500 }
        );
    }
}
