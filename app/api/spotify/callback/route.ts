import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Community from "@/models/Community";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:3000/api/spotify/callback";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const communityId = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.json({ error: `Spotify Auth Error: ${error}` }, { status: 400 });
    }

    if (!code || !communityId) {
        return NextResponse.json({ error: "Missing code or community ID" }, { status: 400 });
    }

    try {
        // 1. Exchange code for access token
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64"),
            },
            body: new URLSearchParams({
                code,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(tokenData.error_description || "Failed to get access token");
        }

        const accessToken = tokenData.access_token;

        // 2. Get User ID
        const userResponse = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const userData = await userResponse.json();
        const spotifyUserId = userData.id;

        // 3. Get Community Details
        await connectToDatabase();
        const community = await Community.findById(communityId);

        if (!community) {
            return NextResponse.json({ error: "Community not found" }, { status: 404 });
        }

        // 4. Create Playlist
        const playlistResponse = await fetch(
            `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: `${community.name} Community Playlist`,
                    description: `A playlist for the ${community.name} community on OpenNote.`,
                    public: true,
                }),
            }
        );

        const playlistData = await playlistResponse.json();

        if (!playlistResponse.ok) {
            throw new Error(playlistData.error?.message || "Failed to create playlist");
        }

        // 5. Update Community with Playlist ID and Refresh Token
        console.log("Updating community:", communityId);
        console.log("Playlist ID:", playlistData.id);

        community.spotifyPlaylistId = playlistData.id;
        if (tokenData.refresh_token) {
            community.spotifyRefreshToken = tokenData.refresh_token;
        }

        const updatedCommunity = await community.save();
        console.log("Community updated:", updatedCommunity);

        // 6. Redirect back to community page
        return NextResponse.redirect(new URL(`/communities/${communityId}`, request.url));
    } catch (err: any) {
        console.error("Spotify Integration Error:", err);
        return NextResponse.json(
            { error: "Failed to complete Spotify integration", details: err.message },
            { status: 500 }
        );
    }
}
