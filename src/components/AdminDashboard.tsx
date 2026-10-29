import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { UserProfile, AppStats, Language } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Palette,
  Clock,
  RefreshCw,
  Search,
  Lock,
  Calendar,
  Sparkles,
  BarChart3,
  Award,
} from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  onShowToast,
}) => {
  const { user, isAdmin } = useAuth();
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  const fetchAdminData = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setPermissionDenied(false);

    try {
      // 1. Fetch Users List - Protected by Firestore Rules (allow list: if isAdmin();)
      const usersSnap = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      usersSnap.forEach((docSnap) => {
        list.push(docSnap.data() as UserProfile);
      });
      setUsersList(list);

      // 2. Fetch App Stats - Protected by Firestore Rules (allow read: if isAdmin();)
      try {
        const statsDoc = await getDoc(doc(db, 'app_stats', 'global'));
        if (statsDoc.exists()) {
          setStats(statsDoc.data() as AppStats);
        } else {
          // Calculate from list
          const totalDesigns = list.reduce((sum, u) => sum + (u.designsCreatedCount || 0), 0);
          setStats({
            totalUsersCount: list.length,
            totalDesignsCreated: totalDesigns,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.warn('Stats fetch warning:', e);
      }
    } catch (err: any) {
      console.error('Admin data fetch error:', err);
      setPermissionDenied(true);
      try {
        handleFirestoreError(err, OperationType.GET, 'users');
      } catch {
        // handled
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [isAdmin]);

  // If user is not an admin, show strict zero-trust access denied
  if (!isAdmin || permissionDenied) {
    return (
      <div className="space-y-6 pb-20">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-rose-200 dark:border-rose-900/50 text-center shadow-lg max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
            {language === 'hi' ? 'अनधिकृत पहुंच (Access Denied)' : 'Restricted Admin Area'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {language === 'hi'
              ? 'यह डैशबोर्ड केवल अधिकृत एडमिन (r71468973@gmail.com) के लिए उपलब्ध है। Firestore Security Rules यह सुनिश्चित करते हैं कि कोई भी सामान्य यूजर इस डेटा को न पढ़ सके।'
              : 'This dashboard is strictly reserved for authorized administrators. Firestore Security Rules prevent unauthorized read/list access.'}
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-left border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 font-mono text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Trust Security Enforcement:</span>
            </div>
            <p className="text-[11px] opacity-80">
              • Current Auth: {user?.email || 'Guest / Unauthenticated'}
            </p>
            <p className="text-[11px] opacity-80">
              • Firestore Rule: match /users/{'{userId}'} &#123; allow list: if isAdmin(); &#125;
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCalculatedDesigns = usersList.reduce(
    (acc, cur) => acc + (cur.designsCreatedCount || 0),
    0
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-7 rounded-3xl shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold">
                  {language === 'hi' ? 'एडमिन कंट्रोल डैशबोर्ड' : 'Admin Operations Center'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900 uppercase">
                  Verified Admin
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Logged in as: <span className="font-semibold text-white">{user?.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              fetchAdminData();
              onShowToast('info', language === 'hi' ? 'डेटा रीफ्रेश किया गया' : 'Data refreshed');
            }}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Security Verified Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-[11px] font-medium text-emerald-300 border border-emerald-400/30">
          <Lock className="w-3.5 h-3.5" />
          <span>
            {language === 'hi'
              ? 'Firestore Security Rules द्वारा सत्यापित RBAC सुरक्षा सक्रिय है'
              : 'RBAC Authorization verified via live Firestore Security Rules'}
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'hi' ? 'कुल पंजीकृत यूजर्स' : 'Total Registered Users'}
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
              {usersList.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'hi' ? 'कुल बनाए गए डिजाइन्स' : 'Total Designs Created'}
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
              {stats?.totalDesignsCreated || totalCalculatedDesigns}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'hi' ? 'एक्टिव क्रिएटर रेशियो' : 'Active Creator Ratio'}
            </p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              {usersList.length > 0
                ? `${Math.round((usersList.filter((u) => (u.designsCreatedCount || 0) > 0).length / usersList.length) * 100)}%`
                : '100%'}
            </p>
          </div>
        </div>
      </div>

      {/* User Directory Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{language === 'hi' ? 'यूजर डायरेक्टरी और गतिविधि' : 'User Directory & Activity'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? 'Firestore के /users कलेक्शन से प्राप्त सुरक्षित रिकॉर्ड'
                : 'Authenticated user profiles retrieved from /users collection'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'ईमेल या नाम खोजें...' : 'Search users...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* User Cards / List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span>{language === 'hi' ? 'डेटा लोड हो रहा है...' : 'Loading users list...'}</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p>{language === 'hi' ? 'कोई यूजर नहीं मिला' : 'No users found matching query'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((item) => (
              <div
                key={item.uid}
                className="p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-200 dark:hover:border-blue-900 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {item.displayName || item.email.split('@')[0]}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.role === 'admin'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {item.role === 'admin' ? 'ADMIN' : 'USER'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                    {item.email}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    UID: {item.uid}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 sm:justify-end">
                      <Palette className="w-3 h-3 text-blue-500" />
                      <span>Designs Made</span>
                    </p>
                    <p className="font-extrabold text-slate-900 dark:text-white font-mono text-sm">
                      {item.designsCreatedCount || 0}
                    </p>
                  </div>

                  <div className="text-left sm:text-right min-w-[90px]">
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 sm:justify-end">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Joined</span>
                    </p>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(
                            language === 'hi' ? 'hi-IN' : 'en-US',
                            { day: 'numeric', month: 'short', year: 'numeric' }
                          )
                        : 'Recent'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
