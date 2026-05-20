// Pixabay Music API integration types
export interface PixabayMusicResult {
  id: string;
  title: string;
  artist: string;
  duration: number;
  previewUrl: string;
  downloadUrl: string;
  category: string;
  thumb?: string;
}

export const MUSIC_CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🎵' },
  { id: 'pop', name: 'Pop', emoji: '🎤' },
  { id: 'rock', name: 'Rock', emoji: '🎸' },
  { id: 'electronic', name: 'Electronic', emoji: '🎹' },
  { id: 'hiphop', name: 'Hip Hop', emoji: '🎧' },
  { id: 'ambient', name: 'Ambient', emoji: '🌙' },
  { id: 'classical', name: 'Classical', emoji: '🎼' },
  { id: 'jazz', name: 'Jazz', emoji: '🎺' },
];

// Mock data for development - replace with real Pixabay API calls
export const MOCK_MUSIC_RESULTS: PixabayMusicResult[] = [
  {
    id: 'music_1',
    title: 'Uplifting Symphony',
    artist: 'PureBrain Studios',
    duration: 180,
    previewUrl: 'https://example.com/preview1.mp3',
    downloadUrl: 'https://example.com/download1.mp3',
    category: 'pop',
  },
  {
    id: 'music_2',
    title: 'Digital Dreams',
    artist: 'Electronic Masters',
    duration: 240,
    previewUrl: 'https://example.com/preview2.mp3',
    downloadUrl: 'https://example.com/download2.mp3',
    category: 'electronic',
  },
  {
    id: 'music_3',
    title: 'Peaceful Meditation',
    artist: 'Zen Studio',
    duration: 300,
    previewUrl: 'https://example.com/preview3.mp3',
    downloadUrl: 'https://example.com/download3.mp3',
    category: 'ambient',
  },
];
