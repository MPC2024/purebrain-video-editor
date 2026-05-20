'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnimatableProperty, Keyframe } from './keyframe-types';

interface KeyframePanelProps {
  duration?: number;
  onPropertyUpdate?: (property: AnimatableProperty) => void;
  onKeyframeAdd?: (propertyId: string, keyframe: Keyframe) => void;
  onKeyframeRemove?: (propertyId: string, time: number) => void;
}

const ANIMATABLE_PROPERTIES: AnimatableProperty[] = [
  {
    id: 'position-x',
    name: 'Position X',
    min: -100,
    max: 100,
    step: 1,
    unit: '%',
    keyframes: [],
  },
  {
    id: 'position-y',
    name: 'Position Y',
    min: -100,
    max: 100,
    step: 1,
    unit: '%',
    keyframes: [],
  },
  {
    id: 'scale',
    name: 'Scale',
    min: 0,
    max: 200,
    step: 1,
    unit: '%',
    keyframes: [],
  },
  {
    id: 'rotation',
    name: 'Rotation',
    min: 0,
    max: 360,
    step: 1,
    unit: 'deg',
    keyframes: [],
  },
  {
    id: 'opacity',
    name: 'Opacity',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    keyframes: [],
  },
];

const INTERPOLATION_TYPES = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
] as const;

const KeyframePanel = ({
  duration = 5000,
  onPropertyUpdate,
  onKeyframeAdd,
  onKeyframeRemove,
}: KeyframePanelProps) => {
  const [properties, setProperties] = useState<AnimatableProperty[]>(
    ANIMATABLE_PROPERTIES,
  );
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [selectedInterpolation, setSelectedInterpolation] = useState<
    'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  >('linear');

  const handleAddKeyframe = (propertyId: string, currentTime: number) => {
    const property = properties.find((p) => p.id === propertyId);
    if (!property) return;

    const newKeyframe: Keyframe = {
      time: currentTime,
      value: (property.min + property.max) / 2,
      interpolation: selectedInterpolation,
    };

    const updatedProperties = properties.map((p) =>
      p.id === propertyId
        ? {
            ...p,
            keyframes: [
              ...p.keyframes,
              newKeyframe,
            ].sort((a, b) => a.time - b.time),
          }
        : p,
    );

    setProperties(updatedProperties);
    onPropertyUpdate?.(updatedProperties.find((p) => p.id === propertyId)!);
    onKeyframeAdd?.(propertyId, newKeyframe);
  };

  const handleRemoveKeyframe = (propertyId: string, time: number) => {
    const updatedProperties = properties.map((p) =>
      p.id === propertyId
        ? {
            ...p,
            keyframes: p.keyframes.filter((k) => k.time !== time),
          }
        : p,
    );

    setProperties(updatedProperties);
    onKeyframeRemove?.(propertyId, time);
  };

  const handleKeyframeValueChange = (
    propertyId: string,
    time: number,
    newValue: number,
  ) => {
    const updatedProperties = properties.map((p) =>
      p.id === propertyId
        ? {
            ...p,
            keyframes: p.keyframes.map((k) =>
              k.time === time ? { ...k, value: newValue } : k,
            ),
          }
        : p,
    );

    setProperties(updatedProperties);
    onPropertyUpdate?.(updatedProperties.find((p) => p.id === propertyId)!);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="space-y-2 pb-3 border-b border-border/50">
        <label className="text-xs font-semibold text-muted-foreground">
          Interpolation Type
        </label>
        <Select
          value={selectedInterpolation}
          onValueChange={(val: any) => setSelectedInterpolation(val)}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INTERPOLATION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Properties */}
      <div className="space-y-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setExpandedProperty(
                    expandedProperty === property.id ? null : property.id,
                  )
                }
                className="flex-1 text-left text-sm font-medium hover:text-primary transition-colors"
              >
                {property.name}
              </button>
              <span className="text-xs text-muted-foreground">
                {property.keyframes.length} keyframes
              </span>
            </div>

            {expandedProperty === property.id && (
              <div className="space-y-2 pt-2 border-t border-border/30">
                {/* Value Input */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground w-20">
                    Default:
                  </span>
                  <Slider
                    value={[(property.min + property.max) / 2]}
                    onValueChange={() => {}}
                    min={property.min}
                    max={property.max}
                    step={property.step}
                    className="flex-1"
                    disabled
                  />
                  <span className="text-xs font-mono w-12">
                    {(property.min + property.max) / 2}
                    {property.unit}
                  </span>
                </div>

                {/* Add Keyframe Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddKeyframe(property.id, 0)}
                  className="w-full h-8"
                >
                  <Plus size={14} className="mr-1" />
                  Add Keyframe
                </Button>

                {/* Keyframes List */}
                {property.keyframes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    {property.keyframes.map((keyframe) => (
                      <div
                        key={`${property.id}-${keyframe.time}`}
                        className="flex gap-2 items-center text-xs bg-background p-2 rounded"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              T: {(keyframe.time / 1000).toFixed(2)}s
                            </span>
                            <span className="font-mono">
                              {keyframe.value}
                              {property.unit}
                            </span>
                          </div>
                          <Slider
                            value={[keyframe.value]}
                            onValueChange={(val) =>
                              handleKeyframeValueChange(
                                property.id,
                                keyframe.time,
                                val[0],
                              )
                            }
                            min={property.min}
                            max={property.max}
                            step={property.step}
                            className="w-full"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveKeyframe(property.id, keyframe.time)
                          }
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
        <p>Expand properties to add keyframes and control animation timing.</p>
      </div>
    </div>
  );
};

export default KeyframePanel;
