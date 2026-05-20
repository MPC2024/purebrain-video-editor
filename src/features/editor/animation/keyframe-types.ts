export interface Keyframe {
  time: number; // ms from clip start
  value: number;
  interpolation: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface AnimatableProperty {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  keyframes: Keyframe[];
}

export interface AnimationClipData {
  clipId: string;
  duration: number; // ms
  properties: AnimatableProperty[];
}
