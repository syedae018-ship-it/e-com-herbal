import { ThemeDefinition, ThemeId } from './types';

export const CURATED_THEMES: ThemeDefinition[] = [
  {
    id: 'herbal-beige-brown',
    name: 'Herbal Beige & Brown',
    style: 'Warm Earth & Organic',
    vibe: 'Warm, earthy, organic, traditional, natural, and premium.',
    description:
      'Natural herbs + earth + handmade products + warm organic wellness. Deep grounding browns meet creamy beige tones.',
    palette: [
      { name: 'Primary Background', value: '#F5EFE4', role: 'Main page & canvas background' },
      { name: 'Secondary Background', value: '#E8DCCB', role: 'Section & container surfaces' },
      { name: 'Primary Brown', value: '#6B4F3A', role: 'Buttons, badges, & primary CTAs' },
      { name: 'Dark Brown', value: '#3F2E22', role: 'Deep contrast cards & footer' },
      { name: 'Warm Beige', value: '#D8C3A5', role: 'Borders & subtle accents' },
      { name: 'Soft Cream', value: '#FFFDF8', role: 'Cards, inputs, & elevated modals' },
      { name: 'Accent Green', value: '#66724A', role: 'Badges, botanical icons, & tags' },
      { name: 'Primary Text', value: '#2E241E', role: 'Headings & readable body copy' },
    ],
    colors: {
      primaryBg: '#F5EFE4',
      secondaryBg: '#E8DCCB',
      primaryMain: '#6B4F3A',
      darkMain: '#3F2E22',
      accent: '#66724A',
      surface: '#FFFDF8',
      textPrimary: '#2E241E',
      textMuted: '#6B5B52',
      border: '#D8C3A5',
      navbar: 'rgba(255, 253, 248, 0.95)',
      footer: '#3F2E22',
    },
  },
  {
    id: 'fresh-green-contrast',
    name: 'Fresh Green Contrast',
    style: 'Clean Botanical',
    vibe: 'Fresh, healthy, clean, modern, botanical, and energetic.',
    description:
      'Fresh leaves + clean wellness + modern nature. Crisp light greens with striking dark forest contrast sections.',
    palette: [
      { name: 'Light Green Background', value: '#EAF3E4', role: 'Main page & clean backdrop' },
      { name: 'Soft Green', value: '#CFE1C6', role: 'Subtle section containers' },
      { name: 'Primary Green', value: '#5F7F55', role: 'Primary buttons & active accents' },
      { name: 'Dark Green', value: '#1F4D36', role: 'Dark highlight sections & cards' },
      { name: 'Deep Forest', value: '#183C2A', role: 'Footer & rich contrast banner' },
      { name: 'Soft Cream', value: '#FFFDF5', role: 'Card surfaces & popovers' },
      { name: 'Accent Sage', value: '#8EAD80', role: 'Badges & active category pills' },
      { name: 'Primary Text', value: '#173025', role: 'Headings & sharp readable copy' },
    ],
    colors: {
      primaryBg: '#EAF3E4',
      secondaryBg: '#CFE1C6',
      primaryMain: '#5F7F55',
      darkMain: '#1F4D36',
      accent: '#8EAD80',
      surface: '#FFFDF5',
      textPrimary: '#173025',
      textMuted: '#4C6356',
      border: '#CFE1C6',
      navbar: 'rgba(255, 253, 245, 0.95)',
      footer: '#183C2A',
    },
  },
  {
    id: 'eucalyptus-sea-salt',
    name: 'Eucalyptus & Sea Salt',
    style: 'Botanical Spa',
    vibe: 'Calm, refreshing, luxurious, minimal, clean, and relaxing.',
    description:
      'Luxury spa + eucalyptus leaves + fresh air + clean botanical wellness. Calming sea salt with deep eucalyptus greens.',
    palette: [
      { name: 'Sea Salt Background', value: '#F4F6F2', role: 'Clean airy canvas background' },
      { name: 'Soft Eucalyptus', value: '#C8D8D0', role: 'Spa-style secondary blocks' },
      { name: 'Muted Sage', value: '#8FA69A', role: 'Subtle highlights & icons' },
      { name: 'Deep Eucalyptus', value: '#4E6B61', role: 'Primary buttons & CTAs' },
      { name: 'Botanical Dark', value: '#29443C', role: 'Luxury dark story sections & footer' },
      { name: 'Soft Mist', value: '#E2EAE5', role: 'Card surfaces & subtle tags' },
      { name: 'Accent Stone', value: '#B8B3A5', role: 'Natural mineral accents & borders' },
      { name: 'Primary Text', value: '#2C3935', role: 'Luxury typography & body copy' },
    ],
    colors: {
      primaryBg: '#F4F6F2',
      secondaryBg: '#E2EAE5',
      primaryMain: '#4E6B61',
      darkMain: '#29443C',
      accent: '#8FA69A',
      surface: '#FFFFFF',
      textPrimary: '#2C3935',
      textMuted: '#586E67',
      border: '#C8D8D0',
      navbar: 'rgba(244, 246, 242, 0.95)',
      footer: '#29443C',
    },
  },
  {
    id: 'vetiver-forest-moss',
    name: 'Vetiver & Forest Moss',
    style: 'Root & Bark',
    vibe: 'Deep, earthy, grounded, masculine, premium, raw, and natural.',
    description:
      'Forest roots + bark + moss + vetiver + deep natural earth. Grounded moss greens with clay and earth bark tones.',
    palette: [
      { name: 'Root Cream Background', value: '#E8E0D2', role: 'Grounded organic background' },
      { name: 'Vetiver Sand', value: '#C9B99C', role: 'Secondary blocks & subtle cards' },
      { name: 'Forest Moss', value: '#66724A', role: 'Primary actions & highlights' },
      { name: 'Deep Moss', value: '#3F4A2D', role: 'Buttons & focal points' },
      { name: 'Forest Bark', value: '#2E3526', role: 'Dark storytelling section & footer' },
      { name: 'Earth Brown', value: '#5C4634', role: 'Rich grounding accents & icons' },
      { name: 'Natural Clay', value: '#9A7B5D', role: 'Pill tags & warm badges' },
      { name: 'Primary Text', value: '#242A20', role: 'Deep wood typography' },
    ],
    colors: {
      primaryBg: '#E8E0D2',
      secondaryBg: '#C9B99C',
      primaryMain: '#66724A',
      darkMain: '#3F4A2D',
      accent: '#9A7B5D',
      surface: '#FAF7F0',
      textPrimary: '#242A20',
      textMuted: '#586150',
      border: '#C9B99C',
      navbar: 'rgba(232, 224, 210, 0.95)',
      footer: '#2E3526',
    },
  },
];

export const DEFAULT_THEME_ID: ThemeId = 'herbal-beige-brown';

export function getThemeById(id?: string): ThemeDefinition {
  return CURATED_THEMES.find((t) => t.id === id) || CURATED_THEMES[0];
}
