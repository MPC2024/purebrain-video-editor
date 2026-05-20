export interface BrandFont {
  name: string;
  category: string;
}

export interface BrandKit {
  id: string;
  name: string;
  colors: string[];
  fonts: BrandFont[];
  logoUrl?: string;
  createdAt?: number;
  updatedAt?: number;
}

export const DEFAULT_BRAND_COLORS = [
  '#000000',
  '#FFFFFF',
  '#3B82F6',
  '#EF4444',
];

export const GOOGLE_FONTS_SAMPLE = [
  { name: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', category: 'sans-serif' },
  { name: 'Lato', category: 'sans-serif' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Bebas Neue', category: 'display' },
  { name: 'Poppins', category: 'sans-serif' },
  { name: 'Inter', category: 'sans-serif' },
];
