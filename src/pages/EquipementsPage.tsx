import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialProducts } from '../data/initialData';
import { ProductItem } from '../types';
import { Search, Filter, MessageCircle, FileText, Check, ChevronRight, X } from 'lucide-react';

export const EquipementsPage: React.FC<{ productSlug?: string }> = ({ productSlug }) => {
  const { navigate, getWhatsAppUrl, submitLead } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(() => {
    if (productSlug) {
      return initialProducts.find(p => p.slug === productSlug) || null;
    }
    return null;
  });

  // Modal quote inquiry state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', city: 'Marrakech' });
  const [inquirySubmitted, setInquirySubmitted] = useState<string | null>(null);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const categories = [
    'all',
    'Gros œuvre',
    'Finitions',
    'Étanchéité',
    'Menuiserie'
  ];

  const filteredProducts = initialProducts.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone || !selectedProduct) return;

    setInquiryLoading(true);
    const result = await submitLead({
      name: inquiryForm.name,
      phone: inquiryForm.phone,
      city: inquiryForm.city,
      service: "Demande de devis prestation",
      source: "fiche_produit",
      description: `Demande de devis pour ${selectedProduct.name} (${selectedProduct.reference})`,
      details: {
        productName: selectedProduct.name,
        reference: selectedProduct.reference,
        category: selectedProduct.category
      }
    });
    setInquiryLoading(false);

    if (result.success && result.reference) {
      setInquirySubmitted(result.reference);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
          Prestations & Matériaux
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] mt-2">
          Nos Prestations & Tarifs indicatifs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Prestations du bâtiment, du gros œuvre aux finitions, avec tarifs indicatifs au m². Le prix définitif est établi après visite et métré.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une prestation, un matériau, une référence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
          />
        </div>

        {/* Categories scrollable pills / tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'Toutes les catégories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">Aucun produit ne correspond à votre recherche.</p>
          <p className="text-xs text-slate-400 mt-1">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-[#0077B6] bg-blue-50 rounded-lg"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              {product.image && (
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="h-36 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span>{product.brand}</span>
                  <span className="font-mono">{product.reference}</span>
                </div>

                <h3
                  onClick={() => setSelectedProduct(product)}
                  className="text-sm font-bold text-[#102A43] group-hover:text-[#0077B6] cursor-pointer transition-colors mb-2 line-clamp-2"
                >
                  {product.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {product.shortDescription}
                </p>

                {/* Key Specs tags */}
                {product.specs && product.specs.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-2.5 mb-4 text-[11px] space-y-1">
                    {product.specs.slice(0, 2).map((sp, idx) => (
                      <div key={idx} className="flex justify-between text-slate-600">
                        <span className="text-slate-400">{sp.label} :</span>
                        <span className="font-medium text-slate-800">{sp.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="py-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {product.isPriceOnDemand || !product.price
                      ? 'Prix sur devis'
                      : `${product.price.toLocaleString('fr-FR')} MAD/m² HT`}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">Disponible</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Fiche technique
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setInquirySubmitted(null);
                      setInquiryModalOpen(true);
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-white bg-[#0077B6] hover:bg-[#005f94] rounded-lg transition-colors cursor-pointer"
                  >
                    Demander prix
                  </button>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Technical Sheet Modal */}
      {selectedProduct && !inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-[#0077B6]">{selectedProduct.category}</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#102A43] mt-0.5">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">Réf : {selectedProduct.reference} · {selectedProduct.brand}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedProduct.image && (
              <div className="rounded-2xl overflow-hidden mb-5 aspect-[16/9] border border-slate-200">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {selectedProduct.shortDescription}
            </p>

            {/* Caractéristiques */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Caractéristiques & Spécifications :
              </h4>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 divide-y divide-slate-200/60 text-xs">
                {selectedProduct.specs.map((sp, idx) => (
                  <div key={idx} className="py-2 flex justify-between gap-4">
                    <span className="text-slate-500 font-medium">{sp.label}</span>
                    <span className="font-semibold text-slate-900 text-right">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="text-xs">
                <span className="text-slate-400 block">Tarif estimé :</span>
                <span className="font-bold text-sm text-slate-900">
                  {selectedProduct.price
                    ? `${selectedProduct.price.toLocaleString('fr-FR')} MAD/m² HT`
                    : 'Sur devis'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={getWhatsAppUrl(`Bonjour, je souhaite des informations et un devis pour la prestation : ${selectedProduct.name} (Réf : ${selectedProduct.reference})`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setInquirySubmitted(null);
                    setInquiryModalOpen(true);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-white bg-[#0077B6] hover:bg-[#005f94] rounded-xl shadow-xs transition-colors"
                >
                  Recevoir une offre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Form Modal */}
      {inquiryModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#102A43]">
                Demande de Prix & Disponibilité
              </h3>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Produit : <span className="font-semibold text-slate-800">{selectedProduct.name}</span> ({selectedProduct.reference})
            </p>

            {inquirySubmitted ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Demande enregistrée !</h4>
                <p className="text-xs text-slate-600 mt-1 mb-4">Réf : {inquirySubmitted}</p>
                <button
                  onClick={() => setInquiryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0077B6] rounded-lg"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Votre Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="M. Alami"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone mobile (Maroc) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="06 61 XX XX XX"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={inquiryForm.city}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, city: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="w-full py-2.5 bg-[#0077B6] hover:bg-[#005f94] text-white text-xs font-bold rounded-lg shadow-sm transition-colors mt-2"
                >
                  {inquiryLoading ? 'Envoi...' : 'Envoyer ma demande'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
