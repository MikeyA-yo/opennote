import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Note from "@/models/Note";
import Comment from "@/models/Comment";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ noteId: string }> }
) {
    try {
        const { noteId } = await params;
        await connectToDatabase();

        const comments = await Comment.find({ noteId }).sort({ createdAt: 1 }); // Oldest first

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Fetch comments error:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ noteId: string }> }
) {
    try {
        const { noteId } = await params;
        const { email, content } = await req.json();

        if (!email || !content) {
            return NextResponse.json(
                { error: "Email and content are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const comment = await Comment.create({
            noteId,
            authorEmail: email,
            content,
        });

        // Update comment count on Note
        await Note.findByIdAndUpdate(noteId, { $inc: { commentsCount: 1 } });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("Add comment error:", error);
        return NextResponse.json(
            { error: "Failed to add comment" },
            { status: 500 }
        );
    }
}
