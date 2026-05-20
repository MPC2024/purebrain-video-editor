// Sticker library data
export type StickerType = 'emoji' | 'svg' | 'shape';

export interface Sticker {
  id: string;
  name: string;
  category: 'emoji' | 'shapes' | 'arrows' | 'social' | 'decorative' | 'badges';
  type: StickerType;
  content: string; // emoji char or SVG path
  width?: number;
  height?: number;
}

export const STICKER_CATEGORIES = [
  { id: 'emoji', name: 'Emoji', emoji: '😊' },
  { id: 'shapes', name: 'Shapes', emoji: '⭐' },
  { id: 'arrows', name: 'Arrows', emoji: '➜' },
  { id: 'social', name: 'Social', emoji: '📱' },
  { id: 'decorative', name: 'Decorative', emoji: '✨' },
  { id: 'badges', name: 'Badges', emoji: '🏷️' },
];

export const STICKERS: Sticker[] = [
  // Emoji Stickers
  {
    id: 'sticker_emoji_love',
    name: 'Love',
    category: 'emoji',
    type: 'emoji',
    content: '❤️',
  },
  {
    id: 'sticker_emoji_fire',
    name: 'Fire',
    category: 'emoji',
    type: 'emoji',
    content: '🔥',
  },
  {
    id: 'sticker_emoji_star',
    name: 'Star',
    category: 'emoji',
    type: 'emoji',
    content: '⭐',
  },
  {
    id: 'sticker_emoji_sparkle',
    name: 'Sparkle',
    category: 'emoji',
    type: 'emoji',
    content: '✨',
  },
  {
    id: 'sticker_emoji_check',
    name: 'Check',
    category: 'emoji',
    type: 'emoji',
    content: '✅',
  },
  {
    id: 'sticker_emoji_boom',
    name: 'Boom',
    category: 'emoji',
    type: 'emoji',
    content: '💥',
  },
  {
    id: 'sticker_emoji_rocket',
    name: 'Rocket',
    category: 'emoji',
    type: 'emoji',
    content: '🚀',
  },
  {
    id: 'sticker_emoji_target',
    name: 'Target',
    category: 'emoji',
    type: 'emoji',
    content: '🎯',
  },

  // Shape Stickers
  {
    id: 'sticker_shape_circle',
    name: 'Circle',
    category: 'shapes',
    type: 'shape',
    content: '●',
  },
  {
    id: 'sticker_shape_square',
    name: 'Square',
    category: 'shapes',
    type: 'shape',
    content: '■',
  },
  {
    id: 'sticker_shape_triangle',
    name: 'Triangle',
    category: 'shapes',
    type: 'shape',
    content: '▲',
  },
  {
    id: 'sticker_shape_diamond',
    name: 'Diamond',
    category: 'shapes',
    type: 'shape',
    content: '◆',
  },
  {
    id: 'sticker_shape_heart',
    name: 'Heart',
    category: 'shapes',
    type: 'shape',
    content: '♥',
  },
  {
    id: 'sticker_shape_star',
    name: 'Star Shape',
    category: 'shapes',
    type: 'shape',
    content: '★',
  },

  // Arrow Stickers
  {
    id: 'sticker_arrow_right',
    name: 'Right Arrow',
    category: 'arrows',
    type: 'emoji',
    content: '➜',
  },
  {
    id: 'sticker_arrow_left',
    name: 'Left Arrow',
    category: 'arrows',
    type: 'emoji',
    content: '⬅',
  },
  {
    id: 'sticker_arrow_up',
    name: 'Up Arrow',
    category: 'arrows',
    type: 'emoji',
    content: '⬆',
  },
  {
    id: 'sticker_arrow_down',
    name: 'Down Arrow',
    category: 'arrows',
    type: 'emoji',
    content: '⬇',
  },
  {
    id: 'sticker_arrow_diagonal',
    name: 'Diagonal',
    category: 'arrows',
    type: 'emoji',
    content: '↗',
  },
  {
    id: 'sticker_arrow_curved',
    name: 'Curved',
    category: 'arrows',
    type: 'emoji',
    content: '↪',
  },

  // Social Media Icons
  {
    id: 'sticker_social_instagram',
    name: 'Instagram',
    category: 'social',
    type: 'emoji',
    content: '📷',
  },
  {
    id: 'sticker_social_tiktok',
    name: 'TikTok',
    category: 'social',
    type: 'emoji',
    content: '🎵',
  },
  {
    id: 'sticker_social_youtube',
    name: 'YouTube',
    category: 'social',
    type: 'emoji',
    content: '▶️',
  },
  {
    id: 'sticker_social_twitter',
    name: 'Twitter',
    category: 'social',
    type: 'emoji',
    content: '𝕏',
  },
  {
    id: 'sticker_social_facebook',
    name: 'Facebook',
    category: 'social',
    type: 'emoji',
    content: '📘',
  },
  {
    id: 'sticker_social_thumbsup',
    name: 'Thumbs Up',
    category: 'social',
    type: 'emoji',
    content: '👍',
  },

  // Decorative Stickers
  {
    id: 'sticker_deco_snowflake',
    name: 'Snowflake',
    category: 'decorative',
    type: 'emoji',
    content: '❄️',
  },
  {
    id: 'sticker_deco_sun',
    name: 'Sun',
    category: 'decorative',
    type: 'emoji',
    content: '☀️',
  },
  {
    id: 'sticker_deco_moon',
    name: 'Moon',
    category: 'decorative',
    type: 'emoji',
    content: '🌙',
  },
  {
    id: 'sticker_deco_cloud',
    name: 'Cloud',
    category: 'decorative',
    type: 'emoji',
    content: '☁️',
  },
  {
    id: 'sticker_deco_wave',
    name: 'Wave',
    category: 'decorative',
    type: 'emoji',
    content: '〰️',
  },
  {
    id: 'sticker_deco_flower',
    name: 'Flower',
    category: 'decorative',
    type: 'emoji',
    content: '🌸',
  },
  {
    id: 'sticker_deco_leaf',
    name: 'Leaf',
    category: 'decorative',
    type: 'emoji',
    content: '🍃',
  },

  // Badge Stickers
  {
    id: 'sticker_badge_new',
    name: 'NEW',
    category: 'badges',
    type: 'emoji',
    content: '🆕',
  },
  {
    id: 'sticker_badge_hot',
    name: 'HOT',
    category: 'badges',
    type: 'emoji',
    content: '🔥',
  },
  {
    id: 'sticker_badge_sale',
    name: 'SALE',
    category: 'badges',
    type: 'emoji',
    content: '🏷️',
  },
  {
    id: 'sticker_badge_vip',
    name: 'VIP',
    category: 'badges',
    type: 'emoji',
    content: '👑',
  },
  {
    id: 'sticker_badge_premium',
    name: 'PREMIUM',
    category: 'badges',
    type: 'emoji',
    content: '⭐',
  },
  {
    id: 'sticker_badge_exclusive',
    name: 'EXCLUSIVE',
    category: 'badges',
    type: 'emoji',
    content: '✨',
  },
];
