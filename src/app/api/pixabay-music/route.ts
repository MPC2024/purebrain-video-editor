import { NextRequest, NextResponse } from 'next/server';

// Pixabay Music API endpoint wrapper
// For now, returns mock data. To enable real API:
// 1. Get free API key from https://pixabay.com/api/users/
// 2. Set PIXABAY_API_KEY env variable
// 3. Uncomment API call below

interface PixabayMusicTrack {
  id: number;
  title: string;
  artist: string;
  duration: number;
  previewUrl?: string;
  downloadUrl?: string;
}

interface PixabayMusicResponse {
  total: number;
  hits: PixabayMusicTrack[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '20';

  const apiKey = process.env.PIXABAY_API_KEY;

  try {
    // For now, return empty results
    // In production, uncomment below to call real Pixabay API:
    /*
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Pixabay API key not configured' },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      key: apiKey,
      per_page: perPage,
      page,
      order: 'popular',
    });

    if (query) {
      params.append('q', query);
    }

    if (category) {
      params.append('category', category);
    }

    const response = await fetch(
      `https://pixabay.com/api/music/?${params.toString()}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }

    const data: PixabayMusicResponse = await response.json();

    return NextResponse.json({
      total: data.total,
      hits: data.hits,
      page: parseInt(page),
      per_page: parseInt(perPage),
    });
    */

    // Return mock data for development
    return NextResponse.json({
      total: 0,
      hits: [],
      page: parseInt(page),
      per_page: parseInt(perPage),
      message: 'Configure PIXABAY_API_KEY to enable music search',
    });
  } catch (error) {
    console.error('Pixabay Music API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music from Pixabay' },
      { status: 500 }
    );
  }
}
