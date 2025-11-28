import mongoose, { Schema, model, models } from "mongoose";

export interface ICommunity {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    type: "Family" | "Organization" | "Cause" | "Other";
    createdAt: Date;
    members: number;
    spotifyPlaylistId?: string;
    spotifyRefreshToken?: string;
}

const CommunitySchema = new Schema<ICommunity>(
    {
        name: {
            type: String,
            required: [true, "Please provide a name for the community."],
            maxlength: [60, "Name cannot be more than 60 characters"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description."],
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        imageUrl: {
            type: String,
            required: [true, "Please provide an image URL."],
        },
        type: {
            type: String,
            enum: ["Family", "Organization", "Cause", "Other"],
            default: "Other",
        },
        members: {
            type: Number,
            default: 0,
        },
        spotifyPlaylistId: {
            type: String,
        },
        spotifyRefreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

const Community = models.Community || model<ICommunity>("Community", CommunitySchema);

export default Community;
