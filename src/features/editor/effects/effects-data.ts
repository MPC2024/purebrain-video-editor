export interface VideoEffect {
  id: string;
  name: string;
  category: 'filter' | 'adjustment' | 'overlay' | 'stylize';
  cssFilter?: string;
  opacity?: number;
  blendMode?: string;
  thumbnail?: string;
}

export const EFFECTS: VideoEffect[] = [
  // Filters
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'filter',
    cssFilter: 'sepia(0.4) contrast(1.1) brightness(0.9) saturate(0.8)',
    thumbnail: 'linear-gradient(135deg, #8B7355 0%, #D2B48C 100%)',
  },
  {
    id: 'warm',
    name: 'Warm',
    category: 'filter',
    cssFilter: 'hue-rotate(10deg) contrast(1.05) brightness(1.1) saturate(1.1)',
    thumbnail: 'linear-gradient(135deg, #FF8C42 0%, #FFB366 100%)',
  },
  {
    id: 'cool',
    name: 'Cool',
    category: 'filter',
    cssFilter: 'hue-rotate(-20deg) contrast(1.05) brightness(0.95) saturate(1.1)',
    thumbnail: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    category: 'filter',
    cssFilter: 'saturate(1.3) contrast(1.2) brightness(0.95) hue-rotate(-5deg)',
    thumbnail: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
  },
  {
    id: 'bw',
    name: 'B&W',
    category: 'filter',
    cssFilter: 'grayscale(1) contrast(1.1)',
    thumbnail: 'linear-gradient(135deg, #333333 0%, #CCCCCC 100%)',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    category: 'filter',
    cssFilter: 'sepia(1)',
    thumbnail: 'linear-gradient(135deg, #704214 0%, #C4A57B 100%)',
  },
  {
    id: 'vivid',
    name: 'Vivid',
    category: 'filter',
    cssFilter: 'saturate(1.8) contrast(1.15) brightness(1.05)',
    thumbnail: 'linear-gradient(135deg, #FF0080 0%, #FF8C00 100%)',
  },
  {
    id: 'muted',
    name: 'Muted',
    category: 'filter',
    cssFilter: 'saturate(0.5) brightness(1.05) contrast(0.95)',
    thumbnail: 'linear-gradient(135deg, #A29BFE 0%, #DFE6E9 100%)',
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    category: 'filter',
    cssFilter: 'saturate(1.2) brightness(1.1) blur(0.5px)',
    opacity: 0.95,
    thumbnail: 'linear-gradient(135deg, #F8B88B 0%, #FAE3D9 100%)',
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    category: 'filter',
    cssFilter: 'hue-rotate(15deg) saturate(1.4) brightness(1.15) contrast(1.05)',
    thumbnail: 'linear-gradient(135deg, #D4A574 0%, #F0D9B5 100%)',
  },

  // Adjustments
  {
    id: 'brightness_up',
    name: 'Bright',
    category: 'adjustment',
    cssFilter: 'brightness(1.3)',
    thumbnail: 'linear-gradient(135deg, #FFEB3B 0%, #FFF9C4 100%)',
  },
  {
    id: 'contrast_up',
    name: 'High Contrast',
    category: 'adjustment',
    cssFilter: 'contrast(1.5)',
    thumbnail: 'linear-gradient(135deg, #000000 0%, #FFFFFF 100%)',
  },
  {
    id: 'saturation_up',
    name: 'Saturated',
    category: 'adjustment',
    cssFilter: 'saturate(1.8)',
    thumbnail: 'linear-gradient(135deg, #00FF00 0%, #0000FF 100%)',
  },
  {
    id: 'hue_shift',
    name: 'Hue Shift',
    category: 'adjustment',
    cssFilter: 'hue-rotate(45deg)',
    thumbnail: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
  },
  {
    id: 'blur',
    name: 'Blur',
    category: 'adjustment',
    cssFilter: 'blur(3px)',
    thumbnail: 'linear-gradient(135deg, #CCCCCC 0%, #EEEEEE 100%)',
  },

  // Stylize
  {
    id: 'vhs',
    name: 'VHS',
    category: 'stylize',
    cssFilter: 'saturate(1.3) contrast(1.1) brightness(0.95) hue-rotate(-10deg)',
    thumbnail: 'linear-gradient(135deg, #EC407A 0%, #AB47BC 100%)',
  },
  {
    id: 'film_grain',
    name: 'Film Grain',
    category: 'stylize',
    cssFilter: 'contrast(1.1) brightness(0.98)',
    thumbnail: 'linear-gradient(135deg, #757575 0%, #BDBDBD 100%)',
  },
  {
    id: 'glitch',
    name: 'Glitch',
    category: 'stylize',
    cssFilter: 'hue-rotate(180deg) saturate(1.5) contrast(1.3)',
    thumbnail: 'linear-gradient(135deg, #FF0000 0%, #00FF00 50%, #0000FF 100%)',
  },
  {
    id: 'neon_glow',
    name: 'Neon Glow',
    category: 'stylize',
    cssFilter: 'saturate(2) contrast(1.2) brightness(1.1) hue-rotate(300deg)',
    thumbnail: 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)',
  },

  // Overlays
  {
    id: 'light_leak',
    name: 'Light Leak',
    category: 'overlay',
    cssFilter: 'brightness(1.2)',
    opacity: 0.85,
    blendMode: 'screen',
    thumbnail: 'linear-gradient(135deg, #FFEB3B 0%, #FFB74D 50%, transparent 100%)',
  },
  {
    id: 'dark_vignette',
    name: 'Vignette',
    category: 'overlay',
    cssFilter: 'brightness(0.9)',
    thumbnail: 'radial-gradient(circle at 50% 50%, transparent 0%, #000000 100%)',
  },
];

export const EFFECT_CATEGORIES = [
  { id: 'filter', name: 'Filters', icon: 'Sparkles' },
  { id: 'adjustment', name: 'Adjustments', icon: 'Sliders' },
  { id: 'stylize', name: 'Stylize', icon: 'Wand' },
  { id: 'overlay', name: 'Overlays', icon: 'Layers' },
] as const;
