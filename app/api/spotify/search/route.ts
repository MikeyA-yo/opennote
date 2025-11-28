import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    try {
        // 1. Get Client Credentials Token
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64"),
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
            }),
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Search Spotify
        const searchResponse = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        const searchData = await searchResponse.json();

        return NextResponse.json(searchData.tracks.items);
    } catch (error) {
        console.error("Spotify Search Error:", error);
        return NextResponse.json({ error: "Failed to search Spotify" }, { status: 500 });
    }
}
