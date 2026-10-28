export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export type ActiveTab = 'home' | 'poster' | 'thumbnail' | 'caption' | 'work' | 'earning' | 'settings';

export interface PosterConfig {
  headline: string;
  subtitle: string;
  badge: string;
  footer: string;
  bgType: 'solid' | 'gradient';
  bgColor1: string;
  bgColor2: string;
  gradientAngle: number;
  textColor: string;
  subtitleColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  textAlign: 'left' | 'center' | 'right';
  headlineSize: number; // 24 to 64
  subtitleSize: number; // 14 to 32
  frameStyle: 'none' | 'border' | 'card' | 'glow';
  fontFamily: 'sans' | 'serif' | 'display';
}

export interface ThumbnailConfig {
  title: string;
  subtitle: string;
  badge: string;
  tagline: string;
  bgStyle: 'tech' | 'fire' | 'navy' | 'gold' | 'neon' | 'dark';
  bgColor1: string;
  bgColor2: string;
  titleColor: string;
  subtitleColor: string;
  badgeColor: string;
  titleSize: number;
  subtitleSize: number;
  textAlign: 'left' | 'center' | 'right';
  hasGlow: boolean;
  hasOutline: boolean;
  sticker: 'none' | 'fire' | 'play' | 'star' | 'money' | 'warning';
}

export interface CaptionItem {
  id: string;
  topic: string;
  title: string;
  caption: string;
  hashtags: string[];
  language: Language;
  source: 'template' | 'ai';
  category: string;
}

export interface SavedProject {
  id: string;
  type: 'poster' | 'thumbnail' | 'caption';
  title: string;
  createdAt: number;
  previewUrl?: string; // Data URL for images
  data: PosterConfig | ThumbnailConfig | CaptionItem;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
