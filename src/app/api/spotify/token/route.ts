import { NextRequest, NextResponse } from 'next/server';

let cachedToken: {
  access_token: string;
  expires_at: number;
} | null = null;

export async function GET() {
  try {
    // Check if we have a valid cached token
    if (cachedToken && cachedToken.expires_at > Date.now()) {
      return NextResponse.json({ access_token: cachedToken.access_token });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    // Get new token using Client Credentials Flow
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Spotify token error:', errorData);
      throw new Error(`Spotify token request failed: ${response.status}`);
    }

    const tokenData = await response.json();
    
    // Cache the token (expires in 1 hour, we'll refresh 5 minutes early)
    cachedToken = {
      access_token: tokenData.access_token,
      expires_at: Date.now() + (tokenData.expires_in - 300) * 1000 // 5 minutes early
    };

    return NextResponse.json({ access_token: tokenData.access_token });
    
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return NextResponse.json(
      { error: 'Failed to get Spotify access token' },
      { status: 500 }
    );
  }
}