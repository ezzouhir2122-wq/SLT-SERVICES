import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { applySeo } from './lib/seo';
import { resolveGaId, ensureGaLoaded, trackPageView } from './lib/analytics';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { MobileCtaBar } from './components/MobileCtaBar';
import { CookieConsent } from './components/CookieConsent';
import { InstallPrompt } from './components/InstallPrompt';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { DevisPage } from './pages/DevisPage';
import { DepannagePage } from './pages/DepannagePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { EquipementsPage } from './pages/EquipementsPage';
import { RealisationsPage } from './pages/RealisationsPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogArticlePage } from './pages/BlogArticlePage';
import { ContactPage } from './pages/ContactPage';
import { MentionsLegalesPage } from './pages/MentionsLegalesPage';
import { ConfidentialitePage } from './pages/ConfidentialitePage';
import { AdminDashboard } from './pages/AdminDashboard';

function AppContent() {
  const { currentPath, settings } = useApp();
  const gaId = resolveGaId(settings.gaMeasurementId);

  // SEO : met à jour title, description, canonical et Open Graph à chaque page.
  useEffect(() => {
    applySeo(currentPath);
  }, [currentPath]);

  // Analytics : charge GA4 si consentement donné + ID configuré, puis page_view.
  useEffect(() => {
    if (!gaId) return;
    ensureGaLoaded(gaId);
    trackPageView(currentPath);
  }, [currentPath, gaId]);

  const renderCurrentPage = () => {
    // Exact or prefix matches
    if (currentPath === '/') {
      return <HomePage />;
    }

    if (currentPath === '/devis') {
      return <DevisPage />;
    }

    if (currentPath === '/depannage') {
      return <DepannagePage />;
    }

    if (currentPath === '/maintenance') {
      return <MaintenancePage />;
    }

    if (currentPath === '/a-propos') {
      return <AboutPage />;
    }

    if (currentPath === '/blog') {
      return <BlogPage />;
    }

    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.split('/')[2];
      return <BlogArticlePage slug={slug} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/mentions-legales') {
      return <MentionsLegalesPage />;
    }

    if (currentPath === '/confidentialite') {
      return <ConfidentialitePage />;
    }

    if (currentPath === '/admin') {
      return <AdminDashboard />;
    }

    // Dynamic routes
    if (currentPath.startsWith('/services')) {
      const parts = currentPath.split('/');
      const slug = parts[2];
      return <ServicesPage serviceSlug={slug} />;
    }

    if (currentPath.startsWith('/equipements')) {
      const parts = currentPath.split('/');
      const slug = parts[2];
      return <EquipementsPage productSlug={slug} />;
    }

    if (currentPath.startsWith('/realisations')) {
      const parts = currentPath.split('/');
      const slug = parts[2];
      return <RealisationsPage projectSlug={slug} />;
    }

    // Default fallback to HomePage
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <InstallPrompt />
      <Header />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
      <WhatsAppFloating />
      <MobileCtaBar />
      {gaId && <CookieConsent measurementId={gaId} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
