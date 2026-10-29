import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  AdOptions,
} from '@capacitor-community/admob';

/**
 * Google Official Test Ad Unit IDs for Android:
 * https://developers.google.com/admob/android/test-ads
 */
export const ADMOB_TEST_CONFIG = {
  // Official Google Sample App ID for Android development
  appId: 'ca-app-pub-3940256099942544~3347511713',
  // Official Google Test Banner Ad Unit ID
  bannerId: 'ca-app-pub-3940256099942544/6300978111',
  // Official Google Test Interstitial Ad Unit ID
  interstitialId: 'ca-app-pub-3940256099942544/1033173712',
};

// Check for user-defined production or environment ad IDs (configured via .env or VITE_ vars)
const IS_TEST_MODE = import.meta.env.VITE_ADMOB_IS_TESTING !== 'false';
export const ADMOB_BANNER_AD_ID =
  (import.meta.env.VITE_ADMOB_BANNER_ID as string) || ADMOB_TEST_CONFIG.bannerId;
export const ADMOB_INTERSTITIAL_AD_ID =
  (import.meta.env.VITE_ADMOB_INTERSTITIAL_ID as string) || ADMOB_TEST_CONFIG.interstitialId;

// Minimum cooldown in milliseconds between interstitial ads to comply with AdMob policy
// (Never show ads repeatedly or unexpectedly)
const INTERSTITIAL_COOLDOWN_MS = 60 * 1000; // 60 seconds

class AdMobService {
  private initialized = false;
  private initializingPromise: Promise<boolean> | null = null;
  private bannerVisible = false;
  private interstitialPrepared = false;
  private lastInterstitialShownAt = 0;
  private isAdRestricted = false;

  public isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Initialize the Google Mobile Ads SDK on native Android/iOS.
   * Safe to call multiple times.
   */
  public async initialize(): Promise<boolean> {
    if (!this.isNative()) {
      // Running in web browser / preview
      this.initialized = true;
      return true;
    }

    if (this.initialized) return true;
    if (this.initializingPromise) return this.initializingPromise;

    this.initializingPromise = (async () => {
      try {
        await AdMob.initialize({
          initializeForTesting: IS_TEST_MODE,
        });

        this.initialized = true;

        // Pre-prepare an interstitial ad in background
        this.prepareInterstitial().catch(() => {});

        return true;
      } catch (error) {
        console.warn('AdMob SDK initialization warning:', error);
        // Do not crash the app if ad SDK fails to load
        return false;
      } finally {
        this.initializingPromise = null;
      }
    })();

    return this.initializingPromise;
  }

  /**
   * Set restricted mode (e.g., when Auth Modal, Login/Signup, or Admin Dashboard is open).
   * Automatically suppresses banner and blocks interstitial ads.
   */
  public setRestrictedMode(restricted: boolean) {
    this.isAdRestricted = restricted;
    if (restricted && this.bannerVisible) {
      this.hideBanner().catch(() => {});
    }
  }

  /**
   * Display Banner Ad in Home Dashboard (bottom or designated container).
   * Complies with AdMob policy: never displayed on auth or admin screens.
   */
  public async showBanner(): Promise<void> {
    if (this.isAdRestricted) {
      return;
    }

    if (!this.isNative()) {
      this.bannerVisible = true;
      return;
    }

    try {
      await this.initialize();
      const options: BannerAdOptions = {
        adId: ADMOB_BANNER_AD_ID,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 64, // Leaves space for bottom navigation bar
        isTesting: IS_TEST_MODE,
      };

      await AdMob.showBanner(options);
      this.bannerVisible = true;
    } catch (error) {
      console.warn('AdMob showBanner warning:', error);
    }
  }

  /**
   * Hide banner ad (when user navigates away from Home Dashboard or opens Auth/Admin).
   */
  public async hideBanner(): Promise<void> {
    this.bannerVisible = false;

    if (!this.isNative()) {
      return;
    }

    try {
      await AdMob.hideBanner();
    } catch {
      try {
        await AdMob.removeBanner();
      } catch {
        // Ignored
      }
    }
  }

  /**
   * Pre-load an interstitial ad in the background so it is ready when the user reaches
   * a natural transition (e.g. saving or exporting a design).
   */
  public async prepareInterstitial(): Promise<boolean> {
    if (!this.isNative()) return true;

    try {
      await this.initialize();
      const options: AdOptions = {
        adId: ADMOB_INTERSTITIAL_AD_ID,
        isTesting: IS_TEST_MODE,
      };

      await AdMob.prepareInterstitial(options);
      this.interstitialPrepared = true;
      return true;
    } catch (err) {
      this.interstitialPrepared = false;
      return false;
    }
  }

  /**
   * Show Interstitial Ad ONLY after a natural transition (e.g., after poster or thumbnail export).
   * Strictly adheres to Google AdMob policy:
   * - No ads on Login, Sign Up, Password Reset, or Admin screens.
   * - Frequency capped (minimum 60s cooldown).
   * - Never shown unexpectedly during active editing.
   */
  public async showInterstitial(transitionName: string = 'export'): Promise<boolean> {
    if (this.isAdRestricted) {
      return false;
    }

    const now = Date.now();
    if (now - this.lastInterstitialShownAt < INTERSTITIAL_COOLDOWN_MS) {
      // Cooldown in effect, skip ad to respect user experience
      return false;
    }

    if (!this.isNative()) {
      // In web preview, record cooldown and proceed without interrupting user
      this.lastInterstitialShownAt = now;
      return true;
    }

    try {
      if (!this.interstitialPrepared) {
        await this.prepareInterstitial();
      }

      await AdMob.showInterstitial();
      this.lastInterstitialShownAt = Date.now();
      this.interstitialPrepared = false;

      // Prepare the next one quietly for the next action transition
      setTimeout(() => {
        this.prepareInterstitial().catch(() => {});
      }, 5000);

      return true;
    } catch (error) {
      console.warn(`Interstitial failed to show during ${transitionName}:`, error);
      this.interstitialPrepared = false;
      return false;
    }
  }
}

export const admobService = new AdMobService();
