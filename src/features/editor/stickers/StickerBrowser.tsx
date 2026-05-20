'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STICKERS, STICKER_CATEGORIES, Sticker } from './sticker-data';

interface StickerBrowserProps {
  onAddSticker?: (sticker: Sticker) => void;
}

const StickerBrowser = ({ onAddSticker }: StickerBrowserProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('emoji');

  // Filter stickers based on search and category
  const filteredStickers = STICKERS.filter((sticker) => {
    const matchesSearch =
      searchQuery === '' ||
      sticker.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || sticker.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddSticker = (sticker: Sticker) => {
    onAddSticker?.(sticker);
  };

  return (
    <div className="w-full h-full flex flex-col pb-4">
      {/* Search Input */}
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 pb-4">
        <div className="flex items-center gap-2 px-4 pt-4">
          <Search size={18} className="text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Search stickers..."
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
            <TabsList className="grid w-full grid-cols-3 gap-1 h-auto bg-transparent">
              {STICKER_CATEGORIES.slice(0, 3).map((cat) => (
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
          <div className="grid grid-cols-3 gap-1 mt-2 px-2">
            {STICKER_CATEGORIES.slice(3).map((cat) => (
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

      {/* Stickers Grid */}
      <div className="flex-1 overflow-y-auto px-4">
        {filteredStickers.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">No stickers found</p>
              <p className="text-xs mt-1">Try a different search or category</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 py-4">
            {filteredStickers.map((sticker) => (
              <button
                key={sticker.id}
                onClick={() => handleAddSticker(sticker)}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors hover:border-primary touch-target"
                title={sticker.name}
              >
                {/* Sticker Content */}
                <div className="text-4xl leading-none flex items-center justify-center h-12 w-12">
                  {sticker.content}
                </div>

                {/* Sticker Name */}
                <span className="text-xs text-center text-muted-foreground">
                  {sticker.name}
                </span>

                {/* Add Icon */}
                <Plus
                  size={12}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickerBrowser;
