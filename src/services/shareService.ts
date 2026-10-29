import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Language } from '../types';

// ============================================================================
// CONFIGURE YOUR OFFICIAL DOWNLOAD / PLAY STORE LINK HERE
// जब ऐप Google Play Store या वेबसाइट पर लाइव हो, तो यहाँ अपना असली लिंक दर्ज करें।
// कोई भी नकली या टूटा लिंक न रखें।
// ============================================================================
export const OFFICIAL_PLAY_STORE_URL: string = ''; // e.g., 'https://play.google.com/store/apps/details?id=com.dailyearn.pro'

export function getAppShareUrl(): string {
  const customUrl: string = OFFICIAL_PLAY_STORE_URL;
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl.trim();
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return 'https://dailyearn.pro';
}

export function getSharePayload(language: Language) {
  const url = getAppShareUrl();
  const isHindi = language === 'hi';

  const title = isHindi ? 'Daily Earn Pro - मोबाइल क्रिएटर स्टूडियो' : 'Daily Earn Pro - Mobile Creator Studio';
  const text = isHindi
    ? `🔥 Daily Earn Pro - सिर्फ अपने फोन से सोशल मीडिया पोस्टर, 16:9 यूट्यूब थंबनेल और वायरल कैप्शन्स बनाएं और फ्रीलांस कमाई शुरू करें!\n\n📲 ऐप डाउनलोड करें: ${url}`
    : `🔥 Daily Earn Pro - Design high-converting social media posters, 16:9 YouTube thumbnails & viral captions on your smartphone!\n\n📲 Download here: ${url}`;

  return { title, text, url };
}

export interface ShareResult {
  success: boolean;
  method: 'native' | 'webshare' | 'clipboard';
  message: string;
}

export async function shareApp(language: Language): Promise<ShareResult> {
  const { title, text, url } = getSharePayload(language);
  const isHindi = language === 'hi';

  // 1. If running inside native Android/iOS Capacitor APK
  if (Capacitor.isNativePlatform()) {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: isHindi ? 'Daily Earn Pro शेयर करें' : 'Share Daily Earn Pro',
      });
      return {
        success: true,
        method: 'native',
        message: isHindi ? 'शेयर मेनू सफलतापूर्वक खुला।' : 'Shared successfully!',
      };
    } catch (error: any) {
      if (error?.message?.includes('canceled') || error?.name === 'AbortError') {
        return {
          success: true,
          method: 'native',
          message: '',
        };
      }
      console.warn('Capacitor Share failed, attempting web share fallback:', error);
    }
  }

  // 2. If running in Web Browser with Web Share API (Mobile Chrome, Safari, etc.)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return {
        success: true,
        method: 'webshare',
        message: isHindi ? 'शेयर मेनू सफलतापूर्वक खुला।' : 'Shared successfully!',
      };
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        return {
          success: true,
          method: 'webshare',
          message: '',
        };
      }
      console.warn('Web Share failed, falling back to clipboard:', error);
    }
  }

  // 3. Fallback: Copy link and message to clipboard
  try {
    const fullMessage = `${text}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(fullMessage);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = fullMessage;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    return {
      success: true,
      method: 'clipboard',
      message: isHindi ? 'ऐप शेयर लिंक क्लिपबोर्ड में कॉपी हो गया!' : 'App share link copied to clipboard!',
    };
  } catch (err: any) {
    return {
      success: false,
      method: 'clipboard',
      message: isHindi ? 'शेयर करने में समस्या हुई। कृपया पुनः प्रयास करें।' : 'Failed to share. Please try again.',
    };
  }
}
