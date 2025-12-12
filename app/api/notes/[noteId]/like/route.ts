import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Note from "@/models/Note";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ noteId: string }> }
) {
    try {
        const { noteId } = await params;
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const note = await Note.findById(noteId);
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        const isLiked = note.likes.includes(email);

        if (isLiked) {
            // Unlike
            note.likes = note.likes.filter((e: string) => e !== email);
        } else {
            // Like
            note.likes.push(email);
        }

        await note.save();

        return NextResponse.json({
            likes: note.likes,
            count: note.likes.length,
            isLiked: !isLiked,
        });
    } catch (error) {
        console.error("Like error:", error);
        return NextResponse.json(
            { error: "Failed to update like status" },
            { status: 500 }
        );
    }
}
