import React, { useState, useEffect } from 'react';
import { ActiveTab, Language, Theme, SavedProject, ToastMessage, PosterConfig, ThumbnailConfig } from './types';
import { translations } from './translations';
import { getSavedProjects, saveProject, deleteProject, clearAllProjects } from './services/storage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { HomeDashboard } from './components/HomeDashboard';
import { PosterMaker } from './components/PosterMaker';
import { ThumbnailMaker } from './components/ThumbnailMaker';
import { CaptionGenerator } from './components/CaptionGenerator';
import { MyWork } from './components/MyWork';
import { EarningTips } from './components/EarningTips';
import { Settings } from './components/Settings';
import { AdminDashboard } from './components/AdminDashboard';
import { admobService } from './services/admobService';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('daily_earn_lang') as Language) || 'hi';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('daily_earn_theme') as Theme) || 'light';
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { user, isAdmin, incrementDesignsCreated } = useAuth();

  // State to hold items reopened from My Work
  const [editingPoster, setEditingPoster] = useState<PosterConfig | null>(null);
  const [editingThumbnail, setEditingThumbnail] = useState<ThumbnailConfig | null>(null);

  // Initialize projects and theme on load
  useEffect(() => {
    setProjects(getSavedProjects());
  }, []);

  useEffect(() => {
    localStorage.setItem('daily_earn_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('daily_earn_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize AdMob and enforce strict AdMob policies
  // Never show ads on Auth Modal, Login, Password Reset, or Admin screens
  useEffect(() => {
    admobService.initialize().catch(() => {});
  }, []);

  useEffect(() => {
    const isRestricted = isAuthModalOpen || activeTab === 'admin';
    admobService.setRestrictedMode(isRestricted);
    if (activeTab !== 'home' || isRestricted) {
      admobService.hideBanner().catch(() => {});
    }
  }, [activeTab, isAuthModalOpen]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      id: `${Date.now()}_${Math.random()}`,
      type,
      message,
    });
  };

  const handleLanguageToggle = () => {
    const next = language === 'hi' ? 'en' : 'hi';
    setLanguage(next);
    showToast('info', next === 'hi' ? 'भाषा: हिंदी' : 'Language: English');
  };

  const handleSaveProject = (
    type: 'poster' | 'thumbnail' | 'caption',
    title: string,
    previewUrl: string,
    data: any
  ) => {
    const res = saveProject({
      type,
      title,
      previewUrl,
      data,
    });
    if (res.success) {
      setProjects(getSavedProjects());
      // Increment user design creation counter in Firestore
      incrementDesignsCreated();
    } else if (res.error) {
      showToast('error', res.error);
    }
  };

  const handleDeleteProject = (id: string) => {
    const ok = deleteProject(id);
    if (ok) {
      setProjects(getSavedProjects());
    }
  };

  const handleClearAll = () => {
    clearAllProjects();
    setProjects([]);
  };

  const handleReopenProject = (project: SavedProject) => {
    if (project.type === 'poster') {
      setEditingPoster(project.data as PosterConfig);
      setActiveTab('poster');
      showToast('info', language === 'hi' ? 'पोस्टर एडिटर में लोड हो गया' : 'Loaded poster into editor');
    } else if (project.type === 'thumbnail') {
      setEditingThumbnail(project.data as ThumbnailConfig);
      setActiveTab('thumbnail');
      showToast('info', language === 'hi' ? 'थंबनेल एडिटर में लोड हो गया' : 'Loaded thumbnail into editor');
    } else if (project.type === 'caption') {
      setActiveTab('caption');
      showToast('info', language === 'hi' ? 'कैप्शन सेक्शन खोला गया' : 'Opened caption section');
    }
  };

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onShowToast={showToast}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Top Application Header */}
      <Header
        language={language}
        onLanguageToggle={handleLanguageToggle}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        savedCount={projects.length}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onShowToast={showToast}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 pt-4">
        {activeTab === 'home' && (
          <HomeDashboard
            language={language}
            onNavigate={handleNavigate}
            savedProjects={projects}
            onReopenProject={handleReopenProject}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'poster' && (
          <PosterMaker
            language={language}
            onSaveProject={handleSaveProject}
            onShowToast={showToast}
            initialConfig={editingPoster}
          />
        )}

        {activeTab === 'thumbnail' && (
          <ThumbnailMaker
            language={language}
            onSaveProject={handleSaveProject}
            onShowToast={showToast}
            initialConfig={editingThumbnail}
          />
        )}

        {activeTab === 'caption' && (
          <CaptionGenerator
            language={language}
            onSaveProject={handleSaveProject}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'work' && (
          <MyWork
            language={language}
            projects={projects}
            onDeleteProject={handleDeleteProject}
            onClearAll={handleClearAll}
            onReopenProject={handleReopenProject}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'earning' && (
          <EarningTips
            language={language}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            language={language}
            onLanguageChange={setLanguage}
            theme={theme}
            onThemeChange={setTheme}
            onClearStorage={handleClearAll}
            onShowToast={showToast}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            language={language}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Touch-Friendly Bottom Mobile Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleNavigate}
        language={language}
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
