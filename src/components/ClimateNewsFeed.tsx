import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ExternalLink, RefreshCw, Newspaper } from 'lucide-react';
import type { ClimateNewsArticle } from '../types';

const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const REFRESH_INTERVAL = 5 * 60 * 1000;

function buildGuardianUrl(): string {
  const key = GUARDIAN_API_KEY || 'test';
  return `https://content.guardianapis.com/search?q=climate%20AND%20environment&show-fields=headline,byline,short-url&order-by=newest&page-size=10&api-key=${key}`;
}

export default function ClimateNewsFeed() {
  const [articles, setArticles] = useState<ClimateNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNews() {
      try {
        const cached = sessionStorage.getItem('auralis-climate-news');
        if (cached) {
          const parsed = JSON.parse(cached) as ClimateNewsArticle[];
          if (!cancelled) {
            setArticles(parsed);
            setLoading(false);
            return;
          }
        }

        const res = await fetch(buildGuardianUrl());
        if (!res.ok) throw new Error(`Guardian API returned ${res.status}`);
        const data = await res.json();

        if (!cancelled && data.response?.results) {
          const mapped: ClimateNewsArticle[] = data.response.results.map(
            (a: Record<string, unknown>) => ({
              title: (a.webTitle as string) || 'Untitled',
              source: 'The Guardian',
              url: (a.webUrl as string) || '#',
              publishedAt: (a.webPublicationDate as string) || '',
              description: (a.fields as Record<string, string>)?.['headline'] || undefined,
            })
          );
          setArticles(mapped);
          sessionStorage.setItem('auralis-climate-news', JSON.stringify(mapped));
          setError(null);
        } else if (!cancelled) {
          setError('Unable to load climate news.');
        }
      } catch {
        if (!cancelled) setError('Unable to load climate news.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNews();
    const interval = setInterval(fetchNews, REFRESH_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-[2.5rem] border border-border/50 bg-surface/50">
        <Activity className="w-8 h-8 text-text-muted/40 animate-pulse" aria-hidden="true" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center rounded-[2.5rem] border border-border/50 bg-surface/50 p-8 text-center">
        <Newspaper className="w-10 h-10 text-text-muted/30 mb-4" aria-hidden="true" />
        <p className="text-xs font-bold text-text-muted/50 uppercase tracking-widest mb-4">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" aria-hidden="true" />
          Retry
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-[2.5rem] border border-border/50 bg-surface/50">
        <p className="text-xs font-bold text-text-muted/50 uppercase tracking-widest">
          No climate news available at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-border/50 bg-surface/50 relative group shadow-2xl">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-surface/90 via-surface/60 to-transparent p-4 pb-8 pointer-events-none">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-accent animate-pulse motion-reduce:animate-none" aria-hidden="true" />
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Climate News Feed</span>
        </div>
      </div>
      <div className="h-full overflow-y-auto scrollbar-thin pt-16 pb-4 px-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {articles.map((article, i) => (
            <motion.a
              key={`${article.url}-${i}`}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="block p-4 rounded-xl bg-white/5 border border-border/30 hover:bg-accent/5 hover:border-accent/20 transition-all group/card cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2 group-hover/card:text-accent transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[9px] font-black text-text-muted/60 uppercase tracking-widest truncate">
                      {article.source}
                    </span>
                    {article.publishedAt && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-text-muted/20" aria-hidden="true" />
                        <span className="text-[9px] font-bold text-text-muted/40">
                          {timeAgo(article.publishedAt)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-text-muted/30 shrink-0 group-hover/card:text-accent transition-colors" aria-hidden="true" />
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
