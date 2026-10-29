import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../types';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onLoginSuccess?: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onShowToast,
  onLoginSuccess,
}) => {
  const { loginWithEmail, signUpWithEmail, resetPassword, authError, clearAuthError } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email.trim()) {
      setLocalError(language === 'hi' ? 'कृपया ईमेल दर्ज करें।' : 'Please enter your email.');
      return;
    }

    if (mode !== 'forgot' && (!password || password.length < 6)) {
      setLocalError(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password, language);
        onShowToast('success', language === 'hi' ? 'सफलतापूर्वक लॉगिन हो गया!' : 'Logged in successfully!');
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, displayName, language);
        onShowToast('success', language === 'hi' ? 'खाता सफलतापूर्वक बन गया! आपका स्वागत है।' : 'Account created successfully! Welcome.');
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email, language);
        setResetSent(true);
        onShowToast('info', language === 'hi' ? 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।' : 'Password reset link sent to your email.');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setLocalError(null);
    clearAuthError();
    setResetSent(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Top Decorative linear highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {mode === 'login' && (language === 'hi' ? 'अपने खाते में लॉगिन करें' : 'Log In to Daily Earn Pro')}
            {mode === 'signup' && (language === 'hi' ? 'नया खाता बनाएं' : 'Create Free Account')}
            {mode === 'forgot' && (language === 'hi' ? 'पासवर्ड रीसेट करें' : 'Reset Your Password')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login' && (language === 'hi' ? 'क्लाउड सिंक और सुरक्षित क्रिएटर एक्सेस के लिए' : 'Access your saved work and creator tools')}
            {mode === 'signup' && (language === 'hi' ? 'फ्री अकाउंट बनाकर सुरक्षित तरीके से काम शुरू करें' : 'Start your design and earning journey')}
            {mode === 'forgot' && (language === 'hi' ? 'हम आपके ईमेल पर पासवर्ड रीसेट का लिंक भेजेंगे' : 'We will send a reset link to your registered email')}
          </p>
        </div>

        {/* Error Notification Banner */}
        {(localError || authError) && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{localError || authError}</p>
          </div>
        )}

        {/* Password Reset Confirmation Banner */}
        {resetSent && (
          <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-bold">
                {language === 'hi' ? 'ईमेल भेज दिया गया है!' : 'Reset Email Sent!'}
              </p>
              <p className="mt-0.5 text-[11px]">
                {language === 'hi'
                  ? 'कृपया अपना इनबॉक्स और स्पैम फ़ोल्डर चेक करें और लिंक पर क्लिक करके नया पासवर्ड सेट करें।'
                  : 'Please check your email inbox (and spam folder) and follow the instructions to set a new password.'}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'आपका नाम' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. John Doe'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ minHeight: '48px' }}
          >
            {loading ? (
              <span>{language === 'hi' ? 'प्रक्रिया जारी है...' : 'Processing...'}</span>
            ) : (
              <>
                <span>
                  {mode === 'login' && (language === 'hi' ? 'लॉगिन करें' : 'Sign In')}
                  {mode === 'signup' && (language === 'hi' ? 'खाता बनाएं' : 'Create Account')}
                  {mode === 'forgot' && (language === 'hi' ? 'रीसेट लिंक भेजें' : 'Send Reset Link')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Mode Switchers */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
          {mode === 'login' ? (
            <p>
              {language === 'hi' ? 'नया खाता बनाना चाहते हैं?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1"
              >
                {language === 'hi' ? 'साइन अप करें' : 'Sign Up Free'}
              </button>
            </p>
          ) : (
            <p>
              {language === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1"
              >
                {language === 'hi' ? 'लॉगिन करें' : 'Log In'}
              </button>
            </p>
          )}
        </div>

        {/* Security & Firebase Console Setup Help Note */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            {language === 'hi'
              ? 'पासवर्ड Firebase Authentication द्वारा एन्क्रिप्टेड रहता है। यह ऐप कभी भी पासवर्ड स्टोर नहीं करता।'
              : 'Passwords are encrypted and safely authenticated by Firebase Authentication.'}
          </p>
        </div>
      </div>
    </div>
  );
};
