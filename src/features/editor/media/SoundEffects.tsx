'use client';

import { useState } from 'react';
import { Play, Pause, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SOUND_EFFECTS,
  SOUND_EFFECT_CATEGORIES,
  SoundEffect,
} from './sound-effects-data';

interface SoundEffectsProps {
  onAddEffect?: (effect: SoundEffect) => void;
}

const SoundEffects = ({ onAddEffect }: SoundEffectsProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('transitions');

  const categoryEffects = SOUND_EFFECTS.filter(
    (effect) => effect.category === selectedCategory
  );

  const handlePlayPause = (effectId: string) => {
    setPlayingId(playingId === effectId ? null : effectId);
  };

  const handleAddEffect = (effect: SoundEffect) => {
    onAddEffect?.(effect);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Category Tabs */}
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 pb-4">
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full px-4 pt-4"
        >
          <TabsList className="grid w-full grid-cols-3 gap-1 h-auto bg-transparent">
            {SOUND_EFFECT_CATEGORIES.slice(0, 3).map((cat) => (
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
        <div className="grid grid-cols-2 gap-1 mt-2 px-4">
          {SOUND_EFFECT_CATEGORIES.slice(3).map((cat) => (
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

      {/* Effects Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {categoryEffects.map((effect) => (
            <div
              key={effect.id}
              className="flex flex-col p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              {/* Header with Play Button */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">{effect.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {effect.description}
                  </p>
                </div>
                <button
                  onClick={() => handlePlayPause(effect.id)}
                  className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  aria-label={playingId === effect.id ? 'Pause' : 'Play'}
                >
                  {playingId === effect.id ? (
                    <Pause size={14} className="text-primary" />
                  ) : (
                    <Play size={14} className="text-primary fill-current" />
                  )}
                </button>
              </div>

              {/* Emoji and Add Button */}
              <div className="flex items-center justify-between">
                <span className="text-2xl">{effect.emoji}</span>
                <button
                  onClick={() => handleAddEffect(effect)}
                  className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors text-primary-foreground touch-target"
                  aria-label="Add effect"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoundEffects;
