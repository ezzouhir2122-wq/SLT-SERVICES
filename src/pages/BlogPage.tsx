import React, { useState } from 'react';
import { initialBlogPosts } from '../data/initialData';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BlogPage: React.FC = () => {
  const { navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Construction', 'Entretien', 'Équipements'];

  const filteredPosts = initialBlogPosts.filter(p => {
    if (p.isDraft) return false;
    if (selectedCategory === 'all') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">
          Conseils Techniques
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] mt-2">
          Conseils Piscine & Équipements
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Retrouvez nos conseils pour concevoir, équiper et entretenir votre piscine.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit max-w-full mx-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat === 'all' ? 'Tous les articles' : cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
                <span className="font-semibold text-[#0077B6]">{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="text-base font-bold text-[#102A43] group-hover:text-[#0077B6] transition-colors mb-3 leading-snug">
                {post.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{post.publishedAt}</span>
              <span className="font-semibold text-[#0077B6] group-hover:underline flex items-center gap-1">
                <span>Lire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
