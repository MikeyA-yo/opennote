import mongoose, { Schema, model, models } from "mongoose";

export interface IComment {
    _id: string;
    noteId: mongoose.Types.ObjectId;
    authorEmail: string;
    content: string;
    createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        noteId: {
            type: Schema.Types.ObjectId,
            ref: "Note",
            required: true,
        },
        authorEmail: {
            type: String,
            required: [true, "Please provide an email."],
        },
        content: {
            type: String,
            required: [true, "Please provide content for the comment."],
            maxlength: [500, "Comment cannot be more than 500 characters"],
        },
    },
    {
        timestamps: true,
    }
);

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
