export type AspectRatio = '16:9' | '9:16' | '1:1';
export type TemplateCategory = 'intro' | 'outro' | 'lower-third' | 'social' | 'story' | 'reel';

export interface VideoTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  duration: number; // seconds
  aspectRatio: AspectRatio;
  description: string;
  gradient: string; // preview gradient
}

export const TEMPLATES: VideoTemplate[] = [
  // Intros
  {
    id: 'intro-clean-fade',
    name: 'Clean Fade',
    category: 'intro',
    duration: 3,
    aspectRatio: '16:9',
    description: 'Smooth fade-in with text overlay',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'intro-dynamic-slide',
    name: 'Dynamic Slide',
    category: 'intro',
    duration: 4,
    aspectRatio: '16:9',
    description: 'Text slides in from left with background',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'intro-neon-pop',
    name: 'Neon Pop',
    category: 'intro',
    duration: 3,
    aspectRatio: '16:9',
    description: 'Vibrant neon effect with pop animation',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #ff00ff 100%)',
  },
  {
    id: 'intro-minimalist',
    name: 'Minimalist',
    category: 'intro',
    duration: 2,
    aspectRatio: '16:9',
    description: 'Clean, minimal title reveal',
    gradient: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
  },

  // Outros
  {
    id: 'outro-subscribe-cta',
    name: 'Subscribe CTA',
    category: 'outro',
    duration: 4,
    aspectRatio: '16:9',
    description: 'Call-to-action with subscribe button',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: 'outro-social-links',
    name: 'Social Links',
    category: 'outro',
    duration: 3,
    aspectRatio: '16:9',
    description: 'Display social media handles and links',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  },
  {
    id: 'outro-thank-you',
    name: 'Thank You',
    category: 'outro',
    duration: 3,
    aspectRatio: '16:9',
    description: 'Simple thank you slide with animation',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },

  // Lower Thirds
  {
    id: 'lower-minimal-name',
    name: 'Minimal Name',
    category: 'lower-third',
    duration: 5,
    aspectRatio: '16:9',
    description: 'Clean name and title bar',
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
  },
  {
    id: 'lower-gradient-bar',
    name: 'Gradient Bar',
    category: 'lower-third',
    duration: 5,
    aspectRatio: '16:9',
    description: 'Colorful gradient lower third',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #44a08d 100%)',
  },
  {
    id: 'lower-animated-tag',
    name: 'Animated Tag',
    category: 'lower-third',
    duration: 5,
    aspectRatio: '16:9',
    description: 'Animated badge with role/title',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },

  // Social Posts
  {
    id: 'social-quote-card',
    name: 'Quote Card',
    category: 'social',
    duration: 6,
    aspectRatio: '1:1',
    description: 'Quote with background image overlay',
    gradient: 'linear-gradient(135deg, #FFA751 0%, #FFE259 100%)',
  },
  {
    id: 'social-product-showcase',
    name: 'Product Showcase',
    category: 'social',
    duration: 5,
    aspectRatio: '9:16',
    description: 'Product reveal with details',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 'social-before-after',
    name: 'Before/After',
    category: 'social',
    duration: 4,
    aspectRatio: '1:1',
    description: 'Side-by-side before and after comparison',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },

  // Story Templates
  {
    id: 'story-highlight',
    name: 'Story Highlight',
    category: 'story',
    duration: 3,
    aspectRatio: '9:16',
    description: 'Instagram story template',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'story-text-overlay',
    name: 'Text Overlay',
    category: 'story',
    duration: 3,
    aspectRatio: '9:16',
    description: 'Large text with background',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },

  // Reels
  {
    id: 'reel-trending',
    name: 'Trending Format',
    category: 'reel',
    duration: 6,
    aspectRatio: '9:16',
    description: 'Trending reel format with music beat sync',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'reel-transitions',
    name: 'Smooth Transitions',
    category: 'reel',
    duration: 5,
    aspectRatio: '9:16',
    description: 'Multiple clips with smooth transitions',
    gradient: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'intro', name: 'Intros' },
  { id: 'outro', name: 'Outros' },
  { id: 'lower-third', name: 'Lower Thirds' },
  { id: 'social', name: 'Social' },
  { id: 'story', name: 'Stories' },
  { id: 'reel', name: 'Reels' },
] as const;
