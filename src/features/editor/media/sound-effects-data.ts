// Sound effects library data
export interface SoundEffect {
  id: string;
  name: string;
  category: 'transitions' | 'ui' | 'nature' | 'impact' | 'comedy';
  description: string;
  emoji: string;
  audioUrl?: string;
}

export const SOUND_EFFECT_CATEGORIES = [
  { id: 'transitions', name: 'Transitions', emoji: '✨' },
  { id: 'ui', name: 'UI Sounds', emoji: '🔔' },
  { id: 'nature', name: 'Nature', emoji: '🌿' },
  { id: 'impact', name: 'Impact', emoji: '💥' },
  { id: 'comedy', name: 'Comedy', emoji: '😄' },
];

export const SOUND_EFFECTS: SoundEffect[] = [
  // Transitions
  {
    id: 'sfx_whoosh_1',
    name: 'Whoosh',
    category: 'transitions',
    description: 'Quick swipe sound effect',
    emoji: '⚡',
  },
  {
    id: 'sfx_whoosh_2',
    name: 'Swoosh',
    category: 'transitions',
    description: 'Smooth transition sound',
    emoji: '💨',
  },
  {
    id: 'sfx_pop',
    name: 'Pop',
    category: 'transitions',
    description: 'Quick pop sound',
    emoji: '🎯',
  },
  {
    id: 'sfx_slide',
    name: 'Slide',
    category: 'transitions',
    description: 'Sliding transition',
    emoji: '🎪',
  },

  // UI Sounds
  {
    id: 'sfx_click',
    name: 'Click',
    category: 'ui',
    description: 'Button click sound',
    emoji: '🖱️',
  },
  {
    id: 'sfx_ding',
    name: 'Ding',
    category: 'ui',
    description: 'Bell ding sound',
    emoji: '🔔',
  },
  {
    id: 'sfx_notification',
    name: 'Notification',
    category: 'ui',
    description: 'Message notification sound',
    emoji: '📬',
  },
  {
    id: 'sfx_success',
    name: 'Success',
    category: 'ui',
    description: 'Success chime',
    emoji: '✅',
  },

  // Nature Sounds
  {
    id: 'sfx_rain',
    name: 'Rain',
    category: 'nature',
    description: 'Light rain sound',
    emoji: '🌧️',
  },
  {
    id: 'sfx_wind',
    name: 'Wind',
    category: 'nature',
    description: 'Gentle wind sound',
    emoji: '💨',
  },
  {
    id: 'sfx_birds',
    name: 'Birds',
    category: 'nature',
    description: 'Birds chirping',
    emoji: '🐦',
  },
  {
    id: 'sfx_thunder',
    name: 'Thunder',
    category: 'nature',
    description: 'Thunder rumble',
    emoji: '⛈️',
  },

  // Impact Sounds
  {
    id: 'sfx_boom',
    name: 'Boom',
    category: 'impact',
    description: 'Heavy impact sound',
    emoji: '💣',
  },
  {
    id: 'sfx_crash',
    name: 'Crash',
    category: 'impact',
    description: 'Glass crash sound',
    emoji: '💔',
  },
  {
    id: 'sfx_hit',
    name: 'Hit',
    category: 'impact',
    description: 'Punch hit sound',
    emoji: '👊',
  },
  {
    id: 'sfx_explosion',
    name: 'Explosion',
    category: 'impact',
    description: 'Big explosion',
    emoji: '🎆',
  },

  // Comedy Sounds
  {
    id: 'sfx_boing',
    name: 'Boing',
    category: 'comedy',
    description: 'Spring boing sound',
    emoji: '🎪',
  },
  {
    id: 'sfx_slide_whistle',
    name: 'Slide Whistle',
    category: 'comedy',
    description: 'Cartoon slide whistle',
    emoji: '🎵',
  },
  {
    id: 'sfx_scratch',
    name: 'Record Scratch',
    category: 'comedy',
    description: 'Vinyl record scratch',
    emoji: '🎼',
  },
  {
    id: 'sfx_laugh',
    name: 'Laugh Track',
    category: 'comedy',
    description: 'Audience laughter',
    emoji: '😂',
  },
  {
    id: 'sfx_fart',
    name: 'Fart',
    category: 'comedy',
    description: 'Comedic fart sound',
    emoji: '💨',
  },
  {
    id: 'sfx_honk',
    name: 'Honk',
    category: 'comedy',
    description: 'Silly honk sound',
    emoji: '🎺',
  },
];
