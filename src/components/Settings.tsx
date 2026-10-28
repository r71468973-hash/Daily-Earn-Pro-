import React, { useState } from 'react';
import { Language, Theme } from '../types';
import { translations } from '../translations';
import {
  Settings as SettingsIcon,
  Globe,
  Sun,
  Moon,
  Info,
  Shield,
  Trash2,
  Smartphone,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SettingsProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onClearStorage: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  onClearStorage,
  onShowToast,
}) => {
  const t = translations[language];
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showApkGuideModal, setShowApkGuideModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <SettingsIcon className="w-5 h-5" />
          </span>
          {t.settings.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Language Preferences */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <span>{t.settings.languageSection}</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onLanguageChange('en')}
            className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
              language === 'en'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>English</span>
          </button>
          <button
            onClick={() => onLanguageChange('hi')}
            className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
              language === 'hi'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>हिंदी (Hindi)</span>
          </button>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>{t.settings.themeSection}</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onThemeChange('light')}
            className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
              theme === 'light'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>{t.settings.light}</span>
          </button>
          <button
            onClick={() => onThemeChange('dark')}
            className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
              theme === 'dark'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>{t.settings.dark}</span>
          </button>
        </div>
      </div>

      {/* Android Phone APK Guide Button */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl shadow-lg space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              {t.settings.apkSection}
            </h3>
            <p className="text-[11px] text-blue-200">
              {language === 'hi'
                ? 'बिना कंप्यूटर अपने मोबाइल से APK फाइल बनाएं और इंस्टॉल करें'
                : 'Generate and install the Android APK directly using your smartphone'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowApkGuideModal(true)}
          className="w-full py-2.5 px-4 bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-xs sm:text-sm rounded-xl active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>{t.settings.viewApkGuide}</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* App Info & Storage Box */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>{t.settings.appInfoSection}</span>
        </h3>
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span>App Name</span>
            <span className="font-bold text-slate-900 dark:text-white">Daily Earn Pro</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span>Package ID</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">{t.settings.packageId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span>Version</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{t.settings.version}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Platform Support</span>
            <span className="font-semibold text-emerald-600">Android & Progressive Web</span>
          </div>
        </div>

        {/* Clear Data Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.settings.clearStorageBtn}</span>
          </button>
        </div>
      </div>

      {/* Quick Links: Privacy Policy & FAQ */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowPrivacyModal(true)}
          className="p-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-1 transition-all"
        >
          <Shield className="w-4 h-4 text-blue-600 mb-1" />
          <p className="font-bold text-xs text-slate-900 dark:text-white">{t.settings.privacySection}</p>
          <p className="text-[10px] text-slate-400">{t.settings.viewPrivacyBtn}</p>
        </button>

        <button
          onClick={() => setShowFaqModal(true)}
          className="p-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-1 transition-all"
        >
          <HelpCircle className="w-4 h-4 text-indigo-600 mb-1" />
          <p className="font-bold text-xs text-slate-900 dark:text-white">{t.settings.helpSection}</p>
          <p className="text-[10px] text-slate-400">{t.settings.viewFaq}</p>
        </button>
      </div>

      {/* Android Mobile Phone APK Guide Modal */}
      {showApkGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {language === 'hi' ? 'फोन से APK बनाने का तरीका' : 'Build APK using only Android Phone'}
                </h3>
              </div>
              <button
                onClick={() => setShowApkGuideModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900">
                <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">
                  {language === 'hi' ? '100% फ्री - कंप्यूटर की कोई जरूरत नहीं!' : '100% Free - No Computer Required!'}
                </p>
                <p>
                  {language === 'hi'
                    ? 'हमने GitHub Actions का ऑटोमेटेड वर्कफ्लो (.github/workflows/build-android.yml) सेट कर दिया है। आप अपने फोन के Chrome ब्राउज़र से सीधे APK फाइल डाउनलोड कर सकते हैं।'
                    : 'A fully automated GitHub Actions workflow is pre-configured. GitHub builds the Android APK in the cloud and lets you download the .apk file on your phone.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                    {language === 'hi' ? 'स्टेप 1: कोड को GitHub पर डालें' : 'Step 1: Push code to your GitHub repository'}
                  </p>
                  <p className="text-[11px]">
                    {language === 'hi'
                      ? 'अपने प्रोजेक्ट को GitHub पर "daily-earn-pro" नाम से एक नए रिपॉजिटरी में अपलोड करें।'
                      : 'Create a GitHub repo and push all project files including capacitor.config.json and .github/workflows/build-android.yml.'}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                    {language === 'hi' ? 'स्टेप 2: फोन में Actions टैब खोलें' : 'Step 2: Open "Actions" Tab on your Phone'}
                  </p>
                  <p className="text-[11px]">
                    {language === 'hi'
                      ? 'अपने फोन के Chrome ब्राउज़र में GitHub रिपोजिटरी खोलें। ऊपर "Actions" टैब पर क्लिक करें।'
                      : 'In your mobile browser on GitHub, tap the "Actions" tab. You will see "Build Android Debug APK".'}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                    {language === 'hi' ? 'स्टेप 3: "Run workflow" पर क्लिक करें' : 'Step 3: Trigger "Run workflow"'}
                  </p>
                  <p className="text-[11px]">
                    {language === 'hi'
                      ? '"Run workflow" बटन दबाएं। GitHub क्लाउड में 2-3 मिनट में आपकी APK फाइल तैयार हो जाएगी।'
                      : 'Tap "Run workflow" on main branch. GitHub Actions will run Gradle and package the Android APK.'}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                    {language === 'hi' ? 'स्टेप 4: APK डाउनलोड करके इंस्टॉल करें' : 'Step 4: Download APK Artifact & Install'}
                  </p>
                  <p className="text-[11px]">
                    {language === 'hi'
                      ? 'वर्कफ्लो पूरा होने पर "DailyEarnPro-v1.0.0-Debug-APK" नाम का लिंक दिखेगा। उसपर क्लिक करते ही APK फाइल आपके फोन में डाउनलोड हो जाएगी।'
                      : 'When the run turns green, scroll down to "Artifacts", tap "DailyEarnPro-v1.0.0-Debug-APK", unzip and install the APK on your phone!'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowApkGuideModal(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl active:scale-98 transition-transform"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Privacy Policy & Terms
                </h3>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-white">
                1. 100% Local Device Storage
              </p>
              <p>
                All your posters, thumbnails, and saved captions are stored exclusively inside your phone's browser/local device storage. Daily Earn Pro does not collect your phone number, contacts, location, or private photos.
              </p>

              <p className="font-semibold text-slate-900 dark:text-white">
                2. No Automated Payment or Investment Guarantees
              </p>
              <p>
                Daily Earn Pro is a creator utility application. It does not operate investment schemes, pay-to-click schemes, or promise automated income. Users earn solely by creating digital assets and rendering freelance services to their own independent clients.
              </p>

              <p className="font-semibold text-slate-900 dark:text-white">
                3. Commercial Rights
              </p>
              <p>
                Any image or caption you export from this application belongs completely to you. You are free to sell designs to clients, use them for business marketing, or publish them commercially.
              </p>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl active:scale-98 transition-transform"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Help & Frequently Asked Questions
                </h3>
              </div>
              <button
                onClick={() => setShowFaqModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="font-bold text-slate-900 dark:text-white mb-1">
                  Q: क्या मैं डाउनलोड किए गए पोस्टर्स को बेच सकता हूँ?
                </p>
                <p>
                  A: हाँ! आप जो भी पोस्टर या थंबनेल बनाते हैं, उसके 100% मालिक आप हैं। आप स्थानीय दुकानदारों और यूट्यूबर्स को इसे बेचकर पैसे कमा सकते हैं।
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="font-bold text-slate-900 dark:text-white mb-1">
                  Q: क्या यह ऐप बिना इंटरनेट (ऑफलाइन) काम करता है?
                </p>
                <p>
                  A: बिल्कुल! पोस्टर मेकर, थंबनेल मेकर, लोकल कैप्शंस और सेव की गई फाइलें 100% ऑफलाइन काम करती हैं।
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="font-bold text-slate-900 dark:text-white mb-1">
                  Q: पहला क्लाइंट कैसे ढूंढें?
                </p>
                <p>
                  A: 'कमाई गाइड' टैब पर जाएं। वहां रेडीमेड मैसेज (Pitch) दिए गए हैं। अपने इलाके की 5 दुकानों को 1 फ्री पोस्टर बनाकर भेजें, 2 जरूर ऑर्डर देंगे!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFaqModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl active:scale-98 transition-transform"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.work.clearAll}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t.work.clearAllConfirm}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                {t.work.cancel}
              </button>
              <button
                onClick={() => {
                  onClearStorage();
                  setShowClearConfirm(false);
                  onShowToast('success', language === 'hi' ? 'डाटा साफ़ कर दिया गया' : 'Data cleared successfully');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {t.work.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
