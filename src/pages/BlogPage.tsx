import React, { useState } from 'react';
import { initialBlogPosts } from '../data/initialData';
import { BlogPost } from '../types';
import { BookOpen, Clock, Calendar, ArrowRight, X } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ['all', 'Construction', 'Rénovation', 'Étanchéité'];

  const filteredPosts = initialBlogPosts.filter(p => {
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
          Conseils Travaux & Bâtiment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Retrouvez nos conseils de construction, de rénovation et d'entretien pour réussir vos projets et préserver vos bâtiments.
        </p>
      </div>

      {/* Categories */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit mx-auto">
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
            onClick={() => setSelectedPost(post)}
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

      {/* Post Modal View */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#0077B6] font-semibold mb-1">
                  <span>{selectedPost.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedPost.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedPost.publishedAt}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#102A43]">
                  {selectedPost.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed pt-4 border-t border-slate-100">
              {selectedPost.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Fermer l'article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
