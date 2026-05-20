'use client';

import { useState } from 'react';
import { EFFECTS, EFFECT_CATEGORIES, VideoEffect } from './effects-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface EffectsPanelProps {
  onEffectApply?: (effect: VideoEffect) => void;
}

const EffectsPanel = ({ onEffectApply }: EffectsPanelProps) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const handleEffectClick = (effect: VideoEffect) => {
    if (selectedEffect === effect.id) {
      setSelectedEffect(null);
    } else {
      setSelectedEffect(effect.id);
      onEffectApply?.(effect);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="filter" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          {EFFECT_CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {EFFECT_CATEGORIES.map((category) => {
          const categoryEffects = EFFECTS.filter((e) => e.category === category.id);

          return (
            <TabsContent key={category.id} value={category.id} className="flex-1">
              <div className="grid grid-cols-2 gap-3 pb-4">
                {categoryEffects.map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => handleEffectClick(effect)}
                    className={`flex flex-col items-center justify-center rounded-lg p-4 transition-all touch-target ${
                      selectedEffect === effect.id
                        ? 'ring-2 ring-primary bg-primary/10'
                        : 'hover:bg-muted border border-border'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded mb-2"
                      style={{
                        background: effect.thumbnail || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    />
                    <span className="text-xs font-medium text-center">{effect.name}</span>
                  </button>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {selectedEffect && (
        <div className="border-t border-border/50 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedEffect(null)}
            className="w-full"
          >
            Clear Effect
          </Button>
        </div>
      )}
    </div>
  );
};

export default EffectsPanel;
