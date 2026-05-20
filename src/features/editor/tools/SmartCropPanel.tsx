'use client';

import { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AspectRatioPreset {
  id: string;
  name: string;
  ratio: number;
  width: number;
  height: number;
  platform?: string;
}

const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { id: '16_9', name: '16:9', ratio: 16 / 9, width: 16, height: 9, platform: 'YouTube' },
  { id: '9_16', name: '9:16', ratio: 9 / 16, width: 9, height: 16, platform: 'TikTok/Reels' },
  { id: '1_1', name: '1:1', ratio: 1, width: 1, height: 1, platform: 'Instagram' },
  { id: '4_5', name: '4:5', ratio: 4 / 5, width: 4, height: 5, platform: 'Instagram Feed' },
  { id: '21_9', name: '21:9', ratio: 21 / 9, width: 21, height: 9, platform: 'Cinematic' },
];

interface SmartCropPanelProps {
  videoWidth?: number;
  videoHeight?: number;
  onCropApply?: (aspectRatio: AspectRatioPreset) => void;
}

const SmartCropPanel = ({
  videoWidth = 1920,
  videoHeight = 1080,
  onCropApply,
}: SmartCropPanelProps) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('16_9');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');

  const selectedAspectRatio = ASPECT_RATIO_PRESETS.find(
    (p) => p.id === selectedPreset
  ) || ASPECT_RATIO_PRESETS[0];

  // Calculate crop preview dimensions
  const previewWidth = 200;
  const previewHeight = previewWidth / selectedAspectRatio.ratio;

  const handleApplyCrop = () => {
    onCropApply?.(selectedAspectRatio);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Video Preview with Crop Overlay */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <div
          className="relative bg-black/10 rounded-lg overflow-hidden"
          style={{
            width: previewWidth,
            height: Math.min(previewHeight, 300),
            aspectRatio: selectedAspectRatio.ratio,
          }}
        >
          {/* Crop Rectangle */}
          <div
            className="absolute inset-0 border-2 border-primary bg-primary/5"
            style={{
              aspectRatio: selectedAspectRatio.ratio,
            }}
          />

          {/* Video Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
            <span className="text-white text-xs">
              {selectedAspectRatio.width}:{selectedAspectRatio.height}
            </span>
          </div>

          {/* Crop Guides */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
          </div>
        </div>
      </div>

      {/* Preset Selection */}
      <div className="px-4 py-4 border-t border-border">
        <div className="space-y-3">
          {/* Platform Presets */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Platform Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASPECT_RATIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-3 rounded-lg transition-all text-sm touch-target ${
                    selectedPreset === preset.id
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/80 border border-border'
                  }`}
                >
                  <div className="font-medium">{preset.name}</div>
                  {preset.platform && (
                    <div className="text-xs opacity-75">{preset.platform}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Alignment Controls */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Crop Alignment
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setAlignment('left')}
                className={`flex-1 h-10 rounded-lg transition-all flex items-center justify-center ${
                  alignment === 'left'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 border border-border'
                }`}
                aria-label="Align left"
              >
                <AlignLeft size={16} />
              </button>
              <button
                onClick={() => setAlignment('center')}
                className={`flex-1 h-10 rounded-lg transition-all flex items-center justify-center ${
                  alignment === 'center'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 border border-border'
                }`}
                aria-label="Align center"
              >
                <AlignCenter size={16} />
              </button>
              <button
                onClick={() => setAlignment('right')}
                className={`flex-1 h-10 rounded-lg transition-all flex items-center justify-center ${
                  alignment === 'right'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 border border-border'
                }`}
                aria-label="Align right"
              >
                <AlignRight size={16} />
              </button>
            </div>
          </div>

          {/* Smart Mode Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
          >
            <Sparkles size={16} />
            Smart Crop (AI)
          </Button>

          {/* Apply Button */}
          <Button
            onClick={handleApplyCrop}
            className="w-full"
            size="sm"
          >
            Apply Crop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SmartCropPanel;
