import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, LeadStatus, LeadPriority, CRMStats, ProductItem, ServiceItem } from '../types';
import { FinanceTab, FinancePrefill } from './admin/FinanceTab';
import {
  Users,
  TrendingUp,
  Settings,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Phone,
  MessageCircle,
  Wrench,
  Package,
  Layers,
  Save,
  LogOut,
  ChevronRight,
  Shield,
  Eye,
  Trash2,
  X,
  Plus,
  Pencil,
  Image as ImageIcon,
  Boxes,
  Upload,
  Globe2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminToken, adminUser, loginAdmin, logoutAdmin, settings, updateSettings, showToast, navigate } = useApp();

  // Login form state if not authenticated
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'products' | 'services' | 'finance' | 'settings'>('overview');

  // Pré-remplissage du générateur de devis depuis un lead.
  const [financePrefill, setFinancePrefill] = useState<FinancePrefill | null>(null);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Lead update fields
  const [actionNote, setActionNote] = useState('');
  const [newStatus, setNewStatus] = useState<LeadStatus>('nouveau');
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [newFollowUpDate, setNewFollowUpDate] = useState('');

  // Stats state
  const [stats, setStats] = useState<CRMStats | null>(null);

  // Products and Services in CMS
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState(settings);

  const adminHeaders: Record<string, string> = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};

  // Load leads and stats
  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/leads', { headers: adminHeaders });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLeadsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats', { headers: adminHeaders });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProductsList(data.products);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) {
        setServicesList(data.services);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchLeads();
      fetchStats();
      fetchProducts();
      fetchServices();
      setSettingsForm(settings);
    }
  }, [adminToken, settings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.success && data.token) {
        loginAdmin(data.token, data.user);
      } else {
        setLoginError(data.error || 'Erreur d\'authentification');
      }
    } catch (err) {
      setLoginError('Serveur inaccessible');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleUpdateLeadStatus = async () => {
    if (!selectedLead) return;

    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          assignedTo: newAssignedTo,
          followUpDate: newFollowUpDate,
          actionNote: actionNote.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Prospect mis à jour.', 'success');
        setSelectedLead(data.lead);
        setActionNote('');
        fetchLeads();
        fetchStats();
      }
    } catch (e) {
      showToast('Erreur lors de la mise à jour.', 'error');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer définitivement ce prospect ?')) return;

    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE', headers: adminHeaders });
      const data = await res.json();
      if (data.success) {
        showToast('Prospect supprimé.', 'info');
        if (selectedLead?.id === id) setSelectedLead(null);
        fetchLeads();
        fetchStats();
      }
    } catch (e) {
      showToast('Erreur suppression', 'error');
    }
  };

  const handleExportLeads = async () => {
    try {
      const res = await fetch('/api/leads/export-csv', { headers: adminHeaders });
      if (!res.ok) throw new Error('Export indisponible');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-slt-services-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast('Impossible d’exporter les prospects.', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings(settingsForm);
    if (success) {
      showToast('Paramètres de l\'entreprise enregistrés.', 'success');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProductSaving(true);
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminHeaders },
        body: JSON.stringify({
          ...editingProduct,
          price: editingProduct.isPriceOnDemand ? null : editingProduct.price,
          quantity: editingProduct.quantity === undefined ? null : Math.max(0, editingProduct.quantity)
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Mise à jour impossible');
      setEditingProduct(null);
      showToast('Produit mis à jour.', 'success');
      fetchProducts();
    } catch {
      showToast('Impossible de mettre à jour ce produit.', 'error');
    } finally {
      setProductSaving(false);
    }
  };

  const handleDeleteProduct = async (product: ProductItem) => {
    if (!window.confirm(`Supprimer définitivement « ${product.name} » ?`)) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE', headers: adminHeaders });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Suppression impossible');
      showToast('Produit supprimé.', 'info');
      fetchProducts();
    } catch {
      showToast('Impossible de supprimer ce produit.', 'error');
    }
  };

  const handleProductImageUpload = async (file?: File) => {
    if (!file || !editingProduct) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      showToast('Choisis une image PNG, JPEG ou WebP.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('L’image ne doit pas dépasser 5 Mo.', 'error');
      return;
    }

    setImageUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Lecture impossible'));
        reader.onerror = () => reject(new Error('Lecture impossible'));
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/uploads/product-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders },
        body: JSON.stringify({ dataUrl, filename: file.name.replace(/\.[^/.]+$/, '') })
      });
      const data = await res.json();
      if (!data.success || !data.imageUrl) throw new Error(data.error || 'Téléversement impossible');
      setEditingProduct(current => current ? { ...current, image: data.imageUrl } : null);
      showToast('Image téléversée. Enregistre le produit pour confirmer.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Impossible de téléverser l’image.', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  // If not logged in, show sleek login form
  if (!adminToken) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl max-w-md w-full p-8 sm:p-10">
          <div className="text-center mb-8">
            <img src="/assets/logo-slt-mark.png" alt={settings.companyName} className="h-14 w-auto mx-auto mb-5" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#102A43]">Espace Direction & CRM</h1>
            <p className="text-xs text-slate-500 mt-1">
              Connexion sécurisée à l'administration {settings.companyName}
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Identifiant
              </label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#0077B6] hover:bg-[#005f94] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? 'Vérification...' : 'Se connecter au Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">Identifiants démonstration :</span>
            <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
              Accès réservé aux membres autorisés.
            </code>
          </div>
        </div>
      </div>
    );
  }

  // Filtered leads
  const filteredLeads = leads.filter(l => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSource && matchesSearch;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'nouveau':
        return <span className="text-xs font-semibold text-blue-700">Nouveau</span>;
      case 'a_contacter':
        return <span className="text-xs font-semibold text-amber-700">À contacter</span>;
      case 'contacte':
        return <span className="text-xs font-semibold text-indigo-700">Contacté</span>;
      case 'qualifie':
        return <span className="text-xs font-semibold text-cyan-700">Qualifié</span>;
      case 'visite_programmee':
        return <span className="text-xs font-semibold text-purple-700">Visite planifiée</span>;
      case 'devis_envoye':
        return <span className="text-xs font-semibold text-emerald-700">Devis envoyé</span>;
      case 'negociation':
        return <span className="text-xs font-semibold text-orange-700">En négociation</span>;
      case 'gagne':
        return <span className="text-xs font-semibold text-emerald-800 font-bold">Gagné</span>;
      case 'perdu':
        return <span className="text-xs font-semibold text-slate-400">Sans suite</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin utility actions: no duplicate brand or page heading. */}
      <div className="flex flex-wrap justify-end gap-2 border-b border-slate-200 pb-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0077B6] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
          >
            <Globe2 className="w-4 h-4" />
            <span>Voir le site</span>
          </button>
          <button
            type="button"
            onClick={handleExportLeads}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exporter CSV</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Navigation: side rail on desktop, compact row on mobile */}
      <nav className="order-1 flex w-full gap-2 overflow-x-auto border-b border-slate-200 pb-px lg:sticky lg:top-6 lg:w-64 lg:shrink-0 lg:flex-col lg:overflow-visible lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:p-3 lg:shadow-sm" aria-label="Navigation du tableau de bord">
        <div className="hidden px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 lg:block">Navigation</div>
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors lg:w-full ${
            activeTab === 'overview'
              ? 'bg-[#0077B6] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Vue d'ensemble & Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors lg:w-full ${
            activeTab === 'leads'
              ? 'bg-[#0077B6] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestion des Leads ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors lg:w-full ${
            activeTab === 'products'
              ? 'bg-[#0077B6] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalogue Produits ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors lg:w-full ${
            activeTab === 'services'
              ? 'bg-[#0077B6] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Services ({servicesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors lg:w-full ${
            activeTab === 'finance'
              ? 'bg-[#0077B6] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Finance — Devis & Factures</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors lg:w-full ${
            activeTab === 'settings'
              ? 'bg-[#0077B6] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Paramètres de l'Entreprise</span>
        </button>
      </nav>

      <main className="order-2 min-w-0 flex-1 space-y-8">

      {/* TAB 1: OVERVIEW & REAL STATS */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Total Demandes Reçues</span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-[#102A43] mt-1 tabular-nums">
                {stats.totalLeads}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Toutes sources confondues</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Nouveaux en Attente</span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
                {stats.newLeads}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">À traiter en priorité</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Taux de Qualification</span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-cyan-700 mt-1 tabular-nums">
                {stats.qualificationRate}%
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">{stats.qualified} prospects qualifiés</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Chantiers / Ventes Gagnés</span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                {stats.won}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Taux transfo : {stats.conversionRate}%</span>
            </div>
          </div>

          {/* Breakdown Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* By Service */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Demandes par Service</h3>
              <div className="space-y-2.5">
                {stats.leadsByService.map(item => (
                  <div key={item.service} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 truncate max-w-[200px]">{item.service}</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">{item.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0077B6]"
                        style={{ width: `${(item.count / stats.totalLeads) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By City */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Origine Géographique</h3>
              <div className="space-y-2.5">
                {stats.leadsByCity.map(item => (
                  <div key={item.city} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700">{item.city}</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">{item.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-600"
                        style={{ width: `${(item.count / stats.totalLeads) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Source */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Canal d'Acquisition</h3>
              <div className="space-y-2.5">
                {stats.leadsBySource.map(item => (
                  <div key={item.source} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 capitalize">{item.source.replace('_', ' ')}</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">{item.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600"
                        style={{ width: `${(item.count / stats.totalLeads) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEADS CRM TABLE */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher nom, réf, téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="nouveau">Nouveau</option>
                <option value="a_contacter">À contacter</option>
                <option value="qualifie">Qualifié</option>
                <option value="visite_programmee">Visite programmée</option>
                <option value="devis_envoye">Devis envoyé</option>
                <option value="gagne">Gagné</option>
                <option value="perdu">Perdu</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="all">Toutes sources</option>
                <option value="formulaire_devis">Formulaire devis</option>
                <option value="devis_rapide">Devis rapide</option>
                <option value="depannage_urgent">Dépannage urgent</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Réf</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Ville</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map(lead => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedLead(lead);
                        setNewStatus(lead.status);
                        setNewAssignedTo(lead.assignedTo || '');
                        setNewFollowUpDate(lead.followUpDate || '');
                      }}
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {lead.ref}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{lead.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{lead.city}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{lead.service}</td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {lead.assignedTo || <span className="text-slate-400 italic">Non assigné</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                            setNewStatus(lead.status);
                            setNewAssignedTo(lead.assignedTo || '');
                            setNewFollowUpDate(lead.followUpDate || '');
                          }}
                          className="px-2.5 py-1 text-xs text-[#0077B6] hover:bg-blue-50 rounded"
                        >
                          Gérer →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LEAD DETAILS & STATUS MODAL / DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#0077B6]">
                  {selectedLead.ref} · Reçu le {new Date(selectedLead.createdAt).toLocaleDateString('fr-FR')}
                </span>
                <h3 className="text-xl font-bold text-[#102A43] mt-0.5">{selectedLead.name}</h3>
                <p className="text-xs text-slate-500">{selectedLead.city} · Source : {selectedLead.source}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct contact shortcuts */}
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href={`tel:${selectedLead.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-[#0077B6]" />
                <span>Appeler {selectedLead.phone}</span>
              </a>

              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${selectedLead.name}, je fais suite à votre demande de devis n° ${selectedLead.ref} chez SLT SERVICES.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Message WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setFinancePrefill({ client: selectedLead.name, objet: selectedLead.service, ref: selectedLead.ref, phone: selectedLead.phone, city: selectedLead.city });
                  setSelectedLead(null);
                  setActiveTab('finance');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077B6]/10 hover:bg-[#0077B6]/20 text-[#0077B6] font-semibold border border-[#0077B6]/20"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Créer un devis</span>
              </button>
            </div>

            {/* Lead Description & Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <p className="font-semibold text-slate-900">Détails de la demande :</p>
              <p className="text-slate-700 leading-relaxed">{selectedLead.description}</p>
              {selectedLead.details && Object.keys(selectedLead.details).length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
                  {Object.entries(selectedLead.details).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-slate-400 capitalize">{key} : </span>
                      <span className="font-medium text-slate-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CRM Workflow fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Modifier Statut</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="nouveau">Nouveau</option>
                  <option value="a_contacter">À contacter</option>
                  <option value="contacte">Contacté</option>
                  <option value="qualifie">Qualifié</option>
                  <option value="visite_programmee">Visite programmée</option>
                  <option value="devis_envoye">Devis envoyé</option>
                  <option value="negociation">En négociation</option>
                  <option value="gagne">Gagné</option>
                  <option value="perdu">Sans suite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Responsable</label>
                <input
                  type="text"
                  placeholder="Ex : M. Amine"
                  value={newAssignedTo}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date relance</label>
                <input
                  type="date"
                  value={newFollowUpDate}
                  onChange={(e) => setNewFollowUpDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ajouter une note de suivi interne
              </label>
              <textarea
                rows={2}
                placeholder="Ex : Visite technique effectuée, devis de 85 000 MAD en attente..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            {/* History log */}
            {selectedLead.history && selectedLead.history.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">Historique d'activité :</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {selectedLead.history.map((h, i) => (
                    <div key={i} className="text-[11px] p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <span className="font-medium text-slate-800">{h.action}</span>
                        {h.note && <span className="block text-slate-500 italic mt-0.5">{h.note}</span>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                        {new Date(h.timestamp).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={handleUpdateLeadStatus}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0077B6] rounded-lg hover:bg-[#005f94]"
                >
                  Sauvegarder les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS CMS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Catalogue des Équipements</h3>
            <span className="text-xs text-slate-500">{productsList.length} articles référencés</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-16"><ImageIcon className="w-4 h-4" aria-label="Image" /></th>
                  <th className="py-3 px-4">Réf</th>
                  <th className="py-3 px-4">Nom Produit</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Prix</th>
                  <th className="py-3 px-4">Quantité</th>
                  <th className="py-3 px-4">Disponibilité</th>
                  <th className="py-3 px-4 text-right"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productsList.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="py-2 px-4">
                      <div className="w-9 h-9 overflow-hidden rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center">
                        {prod.image ? <img src={prod.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-sky-500" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{prod.reference}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{prod.name}</td>
                    <td className="py-3 px-4 text-slate-600">{prod.category}</td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {!prod.isPriceOnDemand && typeof prod.price === 'number' ? `${prod.price.toLocaleString('fr-FR')} MAD` : 'Sur demande'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{typeof prod.quantity === 'number' ? prod.quantity : '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-semibold ${prod.inStock ? 'text-emerald-700' : 'text-slate-500'}`}>{prod.inStock ? 'En stock' : 'Sur commande'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setEditingProduct({ ...prod })} className="p-2 text-sky-700 hover:bg-sky-50 rounded-lg transition-colors" title={`Modifier ${prod.name}`} aria-label={`Modifier ${prod.name}`}><Pencil className="w-4 h-4" /></button>
                        <button type="button" onClick={() => handleDeleteProduct(prod)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title={`Supprimer ${prod.name}`} aria-label={`Supprimer ${prod.name}`}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 p-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
          <form onSubmit={handleSaveProduct} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center"><Boxes className="w-4 h-4" /></div>
                <div><h3 id="product-modal-title" className="font-bold text-slate-900">Modifier le produit</h3><p className="text-xs text-slate-500">Informations visibles dans le catalogue.</p></div>
              </div>
              <button type="button" onClick={() => setEditingProduct(null)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Fermer"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-semibold text-slate-700">Nom du produit<input required value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal" /></label>
                <label className="block text-xs font-semibold text-slate-700">Référence<input required value={editingProduct.reference} onChange={e => setEditingProduct({ ...editingProduct, reference: e.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal" /></label>
                <label className="block text-xs font-semibold text-slate-700">Catégorie<input required value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal" /></label>
                <label className="block text-xs font-semibold text-slate-700">Quantité disponible<input type="number" min="0" value={editingProduct.quantity ?? ''} onChange={e => setEditingProduct({ ...editingProduct, quantity: e.target.value === '' ? undefined : Number(e.target.value) })} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal" placeholder="Ex. 12" /></label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <label className="block text-xs font-semibold text-slate-700">Prix (MAD)<input type="number" min="0" disabled={editingProduct.isPriceOnDemand} value={editingProduct.price ?? ''} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value === '' ? undefined : Number(e.target.value) })} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal disabled:bg-slate-100 disabled:text-slate-400" placeholder="Ex. 2500" /></label>
                <div className="space-y-3 pb-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer"><input type="checkbox" checked={editingProduct.isPriceOnDemand} onChange={e => setEditingProduct({ ...editingProduct, isPriceOnDemand: e.target.checked })} className="rounded border-slate-300 text-[#0077B6]" />Prix sur demande</label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer"><input type="checkbox" checked={editingProduct.inStock} onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })} className="rounded border-slate-300 text-[#0077B6]" />Disponible en stock</label>
                </div>
              </div>

              <label className="block text-xs font-semibold text-slate-700">URL de l'image
                <div className="mt-1.5 flex gap-3 items-center">
                  <div className="w-12 h-12 shrink-0 overflow-hidden rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center">{editingProduct.image ? <img src={editingProduct.image} alt="Aperçu" className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-sky-500" />}</div>
                  <input type="url" value={editingProduct.image ?? ''} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value || undefined })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal" placeholder="https://… ou /assets/produit.jpg" />
                </div>
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-sky-200 bg-sky-50/60 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Importer depuis votre ordinateur</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">PNG, JPEG ou WebP · 5 Mo maximum</p>
                </div>
                <label className="inline-flex items-center gap-2 rounded-lg bg-white border border-sky-200 px-3.5 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  {imageUploading ? 'Téléversement…' : 'Choisir une image'}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={imageUploading} onChange={e => { void handleProductImageUpload(e.target.files?.[0]); e.currentTarget.value = ''; }} />
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
              <button type="submit" disabled={productSaving} className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0077B6] hover:bg-[#005f94] disabled:opacity-60 rounded-lg inline-flex items-center gap-2"><Save className="w-4 h-4" />{productSaving ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: SERVICES CMS */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Prestations & Services Actifs</h3>
            <span className="text-xs text-slate-500">{servicesList.length} prestations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {servicesList.map(serv => (
              <div key={serv.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-semibold text-[#0077B6]">{serv.kicker}</span>
                <h4 className="text-sm font-bold text-slate-900">{serv.title}</h4>
                <p className="text-xs text-slate-600">{serv.shortDescription}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: FINANCE — Devis & Factures */}
      {activeTab === 'finance' && <FinanceTab prefill={financePrefill} />}

      {/* TAB 5: SETTINGS CMS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-3xl">
          <h3 className="text-lg font-bold text-[#102A43] mb-6">Paramètres de l'Entreprise</h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de la société</label>
                <input
                  type="text"
                  value={settingsForm.companyName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone direct</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro WhatsApp commercial</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email contact</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse complète</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Horaires d'ouverture</label>
              <input
                type="text"
                value={settingsForm.openingHours}
                onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0077B6] hover:bg-[#005f94] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les paramètres</span>
              </button>
            </div>
          </form>
        </div>
      )}
      </main>
      </div>
    </div>
  );
};
