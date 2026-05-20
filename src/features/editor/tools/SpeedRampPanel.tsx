'use client';

import { useState } from 'react';
import { RotateCcw, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SpeedRampPanelProps {
  onSpeedChange?: (speed: number) => void;
  onReverseToggle?: (reversed: boolean) => void;
  onFreezeFrame?: () => void;
}

const PRESET_SPEEDS = [
  { id: 'slow', label: '0.5x', value: 0.5 },
  { id: 'normal', label: '1x', value: 1 },
  { id: 'fast', label: '1.5x', value: 1.5 },
  { id: 'faster', label: '2x', value: 2 },
  { id: 'fastest', label: '4x', value: 4 },
];

const SpeedRampPanel = ({
  onSpeedChange,
  onReverseToggle,
  onFreezeFrame,
}: SpeedRampPanelProps) => {
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [isReversed, setIsReversed] = useState(false);

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setCurrentSpeed(newSpeed);
    onSpeedChange?.(newSpeed);
  };

  const handlePresetSpeed = (speed: number) => {
    setCurrentSpeed(speed);
    onSpeedChange?.(speed);
  };

  const handleReverseToggle = () => {
    setIsReversed(!isReversed);
    onReverseToggle?.(!isReversed);
  };

  return (
    <div className="w-full h-full flex flex-col pb-4">
      {/* Current Speed Display */}
      <div className="px-4 pt-4 pb-4 border-b border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Current Speed</p>
          <p className="text-3xl font-bold text-primary">
            {currentSpeed.toFixed(2)}x
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="px-4 py-4 space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Quick Presets
          </label>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_SPEEDS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSpeed(preset.value)}
                className={`py-3 rounded-lg transition-all touch-target ${
                  Math.abs(currentSpeed - preset.value) < 0.01
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-muted hover:bg-muted/80 border border-border'
                }`}
              >
                <span className="text-sm font-medium">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Speed Slider */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Custom Speed (0.25x to 4x)
          </label>
          <Slider
            value={[currentSpeed]}
            onValueChange={handleSpeedChange}
            min={0.25}
            max={4}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.25x</span>
            <span>4x</span>
          </div>
        </div>

        {/* Reverse Toggle */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={handleReverseToggle}
            variant={isReversed ? 'default' : 'outline'}
            className="w-full gap-2"
          >
            <RotateCcw size={16} />
            {isReversed ? 'Playing Reversed' : 'Play Reverse'}
          </Button>
        </div>

        {/* Freeze Frame */}
        <Button
          onClick={onFreezeFrame}
          variant="outline"
          className="w-full gap-2"
        >
          <Pause size={16} />
          Freeze Frame
        </Button>
      </div>

      {/* Speed Curve Visualization */}
      <div className="flex-1 overflow-y-auto px-4 py-4 border-t border-border">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Speed Curve Visualization
          </label>
          <div className="relative h-32 bg-muted/30 rounded-lg border border-border p-3">
            {/* Simple curve representation */}
            <svg
              className="w-full h-full"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
            >
              {/* Grid background */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.1"
                  />
                </pattern>
              </defs>
              <rect width="200" height="100" fill="url(#grid)" />

              {/* Speed curve line */}
              <line x1="0" y1="100" x2="200" y2={100 - currentSpeed * 20} />

              {/* Current speed indicator */}
              <circle
                cx="200"
                cy={100 - currentSpeed * 20}
                r="3"
                fill="currentColor"
                className="text-primary"
              />
            </svg>

            {/* Speed labels */}
            <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
              Start: 1x
            </div>
            <div className="absolute top-2 right-2 text-xs text-muted-foreground">
              End: {currentSpeed.toFixed(2)}x
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground">
            Tip: Create dynamic clips by ramping speed. Slow motion at start,
            then accelerate for dramatic effect.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeedRampPanel;
