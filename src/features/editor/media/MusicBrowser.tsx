'use client';

import { useState } from 'react';
import { Search, Play, Pause, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MUSIC_CATEGORIES, MOCK_MUSIC_RESULTS, PixabayMusicResult } from './pixabay-music-data';

interface MusicBrowserProps {
  onAddMusic?: (track: PixabayMusicResult) => void;
}

const MusicBrowser = ({ onAddMusic }: MusicBrowserProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter results based on search and category
  const filteredResults = MOCK_MUSIC_RESULTS.filter((track) => {
    const matchesSearch =
      searchQuery === '' ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || track.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (trackId: string) => {
    setPlayingId(playingId === trackId ? null : trackId);
  };

  const handleAddTrack = (track: PixabayMusicResult) => {
    onAddMusic?.(track);
  };

  return (
    <div className="w-full h-full flex flex-col pb-4">
      {/* Search Input */}
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 pb-4">
        <div className="flex items-center gap-2 px-4 pt-4">
          <Search size={18} className="text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Search music..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm h-9"
          />
        </div>

        {/* Category Tabs */}
        <div className="mt-3 px-2">
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 gap-1 h-auto bg-transparent">
              {MUSIC_CATEGORIES.slice(0, 4).map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="text-xs py-2 data-[state=active]:bg-primary"
                >
                  {cat.emoji} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Second row of categories */}
          <div className="grid grid-cols-4 gap-1 mt-2">
            {MUSIC_CATEGORIES.slice(4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs py-2 px-2 rounded transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto px-4">
        {filteredResults.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">No music found</p>
              <p className="text-xs mt-1">Try a different search or category</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredResults.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                {/* Play Button */}
                <button
                  onClick={() => handlePlayPause(track.id)}
                  className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  aria-label={playingId === track.id ? 'Pause' : 'Play'}
                >
                  {playingId === track.id ? (
                    <Pause size={16} className="text-primary" />
                  ) : (
                    <Play size={16} className="text-primary fill-current" />
                  )}
                </button>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artist}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatDuration(track.duration)}
                </span>

                {/* Add Button */}
                <button
                  onClick={() => handleAddTrack(track)}
                  className="flex-shrink-0 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors text-primary-foreground touch-target"
                  aria-label="Add to timeline"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicBrowser;
