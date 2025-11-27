import mongoose, { Schema, model, models } from "mongoose";

export interface INote {
    _id: string;
    communityId: mongoose.Types.ObjectId;
    authorEmail: string;
    content: string;
    imageUrl?: string;
    createdAt: Date;
}

const NoteSchema = new Schema<INote>(
    {
        communityId: {
            type: Schema.Types.ObjectId,
            ref: "Community",
            required: true,
        },
        authorEmail: {
            type: String,
            required: [true, "Please provide an email."],
        },
        content: {
            type: String,
            required: [true, "Please provide content for the note."],
            maxlength: [1000, "Note cannot be more than 1000 characters"],
        },
        imageUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Note = models.Note || model<INote>("Note", NoteSchema);

export default Note;
