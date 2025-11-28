import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "http://127.0.0.1:3000/api/spotify/callback"; // Adjust for production
const SCOPES = "playlist-modify-public playlist-modify-private";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get("communityId");

    if (!communityId) {
        return NextResponse.json({ error: "Community ID is required" }, { status: 400 });
    }

    if (!SPOTIFY_CLIENT_ID) {
        return NextResponse.json({ error: "Spotify Client ID is not configured" }, { status: 500 });
    }

    const params = new URLSearchParams({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        state: communityId, // Pass communityId as state to retrieve it in callback
    });

    return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
