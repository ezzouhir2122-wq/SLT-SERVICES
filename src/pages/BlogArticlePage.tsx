import React, { useEffect } from 'react';
import { ArrowRight, ArrowLeft, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { initialBlogPosts } from '../data/initialData';
import { useApp } from '../context/AppContext';
import { setJsonLd, buildArticleJsonLd, buildFaqJsonLd } from '../lib/seo';

export const BlogArticlePage: React.FC<{ slug?: string }> = ({ slug }) => {
  const { navigate } = useApp();
  const post = initialBlogPosts.find(p => p.slug === slug && !p.isDraft);

  // Données structurées (BlogPosting + FAQPage), nettoyées au démontage.
  useEffect(() => {
    if (!post) return;
    setJsonLd('article', buildArticleJsonLd(post));
    if (post.faq && post.faq.length) setJsonLd('article-faq', buildFaqJsonLd(post.faq));
    return () => {
      setJsonLd('article', null);
      setJsonLd('article-faq', null);
    };
  }, [post?.slug]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#102A43] mb-4">Article introuvable</h1>
        <p className="text-slate-500 mb-8">Cet article n’existe pas ou a été déplacé.</p>
        <button onClick={() => navigate('/blog')} className="text-[#0077B6] font-semibold hover:underline">
          ← Retour au blog
        </button>
      </div>
    );
  }

  const related = initialBlogPosts.filter(p => p.slug !== post.slug && !p.isDraft).slice(0, 2);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Fil d'ariane */}
      <nav aria-label="Fil d'ariane" className="text-xs text-slate-400 mb-6 flex items-center gap-2">
        <button onClick={() => navigate('/')} className="hover:text-[#0077B6]">Accueil</button>
        <span aria-hidden="true">/</span>
        <button onClick={() => navigate('/blog')} className="hover:text-[#0077B6]">Blog</button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-500">{post.category}</span>
      </nav>

      {/* En-tête */}
      <header className="mb-8">
        <span className="text-xs font-semibold tracking-wider text-[#0077B6] uppercase">{post.category}</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#102A43] mt-2 leading-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-4">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.publishedAt}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
          {post.author && <span>Par {post.author}</span>}
        </div>
      </header>

      {post.heroImage && (
        <img
          src={post.heroImage}
          alt={post.title}
          className="w-full h-56 sm:h-80 object-cover rounded-3xl mb-10"
          loading="eager"
        />
      )}

      {/* Intro "réponse d'abord" */}
      {post.intro && (
        <p className="text-base sm:text-lg text-[#102A43] font-medium leading-relaxed border-l-4 border-[#00B4D8] pl-4 mb-10">
          {post.intro}
        </p>
      )}

      {/* Corps : sections riches si disponibles, sinon paragraphes simples */}
      <div className="prose-pool space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        {post.sections && post.sections.length
          ? post.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-lg sm:text-xl font-bold text-[#102A43] mb-3">{section.heading}</h2>
                {section.paragraphs?.map((p, j) => <p key={j} className="mb-3">{p}</p>)}
                {section.bullets && (
                  <ul className="space-y-2 mt-3">
                    {section.bullets.map((b, k) => (
                      <li key={k} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0077B6] mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))
          : post.content.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {/* CTA devis */}
      <div className="mt-12 bg-[#102A43] rounded-3xl p-6 sm:p-8 text-white text-center">
        <h2 className="text-lg sm:text-xl font-bold mb-2">Un projet de piscine à Marrakech ?</h2>
        <p className="text-sm text-white/80 mb-5">Recevez une étude personnalisée et un devis détaillé, sans engagement.</p>
        <button
          onClick={() => navigate('/devis')}
          className="inline-flex items-center gap-2 bg-[#00B4D8] hover:bg-[#0096c7] text-[#03233a] font-semibold px-6 py-3 rounded-xl transition"
        >
          Demander mon devis gratuit <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* FAQ */}
      {post.faq && post.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg sm:text-xl font-bold text-[#102A43] mb-5">Questions fréquentes</h2>
          <div className="space-y-3">
            {post.faq.map((f, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-xl p-4">
                <summary className="font-semibold text-sm text-[#102A43] cursor-pointer list-none flex justify-between items-center">
                  {f.question}
                  <span className="text-[#0077B6] group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Articles liés */}
      {related.length > 0 && (
        <section className="mt-14 pt-8 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5">À lire aussi</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map(r => (
              <button
                key={r.id}
                onClick={() => navigate(`/blog/${r.slug}`)}
                className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <span className="text-[11px] font-semibold text-[#0077B6]">{r.category}</span>
                <h3 className="text-sm font-bold text-[#102A43] mt-1 mb-1 leading-snug">{r.title}</h3>
                <span className="text-xs text-[#0077B6] font-semibold flex items-center gap-1">Lire <ArrowRight className="w-3 h-3" /></span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 text-sm text-[#0077B6] font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Tous les articles
        </button>
      </div>
    </article>
  );
};
