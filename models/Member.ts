import mongoose, { Schema, model, models } from "mongoose";

export interface IMember {
    _id: string;
    communityId: mongoose.Types.ObjectId;
    email: string;
    joinedAt: Date;
}

const MemberSchema = new Schema<IMember>(
    {
        communityId: {
            type: Schema.Types.ObjectId,
            ref: "Community",
            required: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email."],
        },
    },
    {
        timestamps: { createdAt: "joinedAt", updatedAt: false },
    }
);

// Compound index to ensure unique membership per community
MemberSchema.index({ communityId: 1, email: 1 }, { unique: true });

const Member = models.Member || model<IMember>("Member", MemberSchema);

export default Member;
