import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CompanySettings, Lead } from '../types';
import { initialCompanySettings } from '../data/initialData';
import { trackEvent } from '../lib/analytics';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentPath: string;
  params: Record<string, string>;
  navigate: (path: string, params?: Record<string, string>) => void;
  settings: CompanySettings;
  updateSettings: (newSettings: Partial<CompanySettings>) => Promise<boolean>;
  submitLead: (leadData: Record<string, any>) => Promise<{ success: boolean; reference?: string; error?: string }>;
  getWhatsAppUrl: (customMessage?: string) => string;
  adminToken: string | null;
  adminUser: any | null;
  loginAdmin: (token: string, user: any) => void;
  logoutAdmin: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [params, setParams] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<CompanySettings>(initialCompanySettings);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('slt_admin_token') || null;
  });
  const [adminUser, setAdminUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('slt_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch settings from API
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const navigate = (path: string, routeParams: Record<string, string> = {}) => {
    setParams(routeParams);
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        showToast('Paramètres mis à jour avec succès.', 'success');
        return true;
      }
      showToast('Erreur lors de la mise à jour des paramètres.', 'error');
      return false;
    } catch (err) {
      console.error(err);
      showToast('Impossible de joindre le serveur.', 'error');
      return false;
    }
  };

  const submitLead = async (leadData: Record<string, any>): Promise<{ success: boolean; reference?: string; error?: string }> => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          originPage: currentPath
        })
      });
      const data = await res.json();
      if (data.success) {
        // Conversion GA4 (ignoré si analytics non chargé / consentement refusé).
        trackEvent('generate_lead', {
          service: leadData.service,
          source: leadData.source || 'formulaire_devis',
          city: leadData.city,
        });
        showToast(`Demande transmise avec succès ! Référence : ${data.reference}`, 'success');
        return { success: true, reference: data.reference };
      } else {
        const errorMsg = data.error || 'Erreur lors de la transmission.';
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error(err);
      const errorMsg = 'Erreur réseau, veuillez vérifier votre connexion.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const getWhatsAppUrl = (customMessage?: string): string => {
    const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '');
    const defaultMsg = "Bonjour SLT SERVICES, je souhaite des renseignements sur vos prestations pour ma piscine à Marrakech.";
    const encoded = encodeURIComponent(customMessage || defaultMsg);
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  };

  const loginAdmin = (token: string, user: any) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('slt_admin_token', token);
    localStorage.setItem('slt_admin_user', JSON.stringify(user));
    showToast(`Bienvenue, ${user.name || user.username}`, 'success');
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('slt_admin_token');
    localStorage.removeItem('slt_admin_user');
    showToast('Déconnexion réussie.', 'info');
    navigate('/');
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        params,
        navigate,
        settings,
        updateSettings,
        submitLead,
        getWhatsAppUrl,
        adminToken,
        adminUser,
        loginAdmin,
        logoutAdmin,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
      {/* Global Toast notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-sm flex items-center justify-between gap-3 transition-all ${
                toast.type === 'success'
                  ? 'bg-emerald-900/90 text-white border-emerald-700 backdrop-blur-md'
                  : toast.type === 'error'
                  ? 'bg-rose-900/90 text-white border-rose-700 backdrop-blur-md'
                  : 'bg-[#102A43]/95 text-white border-slate-700 backdrop-blur-md'
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
