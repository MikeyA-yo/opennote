import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Community from "@/models/Community";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { trackUri } = await request.json();

    if (!trackUri) {
        return NextResponse.json({ error: "Track URI is required" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        // Explicitly select spotifyRefreshToken as it's excluded by default
        const community = await Community.findById(id).select("+spotifyRefreshToken");

        if (!community || !community.spotifyRefreshToken) {
            return NextResponse.json(
                { error: "Community not found or not connected to Spotify" },
                { status: 404 }
            );
        }

        // 1. Refresh Access Token
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64"),
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: community.spotifyRefreshToken,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error("Failed to refresh token");
        }

        const accessToken = tokenData.access_token;

        // 2. Add Track to Playlist
        const addResponse = await fetch(
            `https://api.spotify.com/v1/playlists/${community.spotifyPlaylistId}/tracks`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uris: [trackUri],
                }),
            }
        );

        if (!addResponse.ok) {
            const errorData = await addResponse.json();
            throw new Error(errorData.error?.message || "Failed to add track");
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Add Track Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to add track" },
            { status: 500 }
        );
    }
}
