"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import SearchResult from '@/components/SearchResult';
import InfoCard from '@/components/InfoCard';
import AIBanner from '@/components/AIBanner';
import { useSettings } from '@/context/SettingsContext';
import { SearchResultItem, WikiData } from '@/types';
import { Loader2, AlertCircle, Globe, Settings } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const { settings } = useSettings();

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (query) performSearch(query);
  }, [query]);

  const fetchAISummary = async (q: string, searchResults: SearchResultItem[]) => {
    if (!settings.aiEnabled) return;
    setAiLoading(true);
    setAiSummary(null);
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, results: searchResults }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSummary(data.summary || null);
      } else {
        const data = await res.json();
        setAiSummary(`Error: ${data.error || 'AI service unavailable'}`);
      }
    } catch (err) {
      console.error('AI summary error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const performSearch = async (q: string) => {
    setLoading(true);
    setError(null);
    setAiSummary(null);
    setWikiData(null);
    try {
      const fetches: Promise<Response>[] = [
        fetch(`https://seqoa-proxy.vercel.app/api/search?q=${encodeURIComponent(q)}`),
      ];
      if (settings.wikiEnabled) {
        fetches.push(fetch(`https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`));
      }

      const [searchRes, wikiRes] = await Promise.all(fetches);

      if (!searchRes.ok) throw new Error('Search failed');

      const searchData = await searchRes.json();
      const fetchedResults: SearchResultItem[] = (searchData.results || []).slice(0, settings.resultsPerPage);
      setResults(fetchedResults);

      if (settings.wikiEnabled && wikiRes?.ok) {
        const wikiInfo = await wikiRes.json();
        setWikiData(wikiInfo?.title ? wikiInfo : null);
      }

      if (fetchedResults.length > 0) {
        fetchAISummary(q, fetchedResults);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch results. Please check the proxy connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (newQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const showSidebar = settings.wikiEnabled && wikiData;

  return (
    <div className="search-page">
      <header className="search-header">
        <div className="container header-container">
          <button className="logo-small" onClick={() => router.push('/')}>
            <Globe size={12} />
            <span>SEQOA</span>
          </button>
          <div className="search-box-wrapper">
            <SearchBox initialValue={query} onSearch={handleNewSearch} variant="small" />
          </div>
          <button className="header-settings" onClick={() => router.push('/settings')} aria-label="Settings">
            <Settings size={16} />
          </button>
        </div>
      </header>

      <main className="container results-container">
        <div className={`results-layout ${!showSidebar ? 'no-sidebar' : ''}`}>
          <div className="results-list">
            {loading ? (
              <div className="status-container">
                <Loader2 className="spin" size={26} />
                <p className="loading-text">Searching <strong>"{query}"</strong>…</p>
                <div className="loading-skeletons">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton-card">
                      <div className="skeleton sk-title" />
                      <div className="skeleton sk-body" />
                      <div className="skeleton sk-body sk-short" />
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="status-container error-state">
                <AlertCircle size={30} />
                <p>{error}</p>
                <button onClick={() => performSearch(query)} className="retry-btn">Retry</button>
              </div>
            ) : results.length > 0 ? (
              <div className="results-wrapper">
                <p className="results-meta">
                  <strong>{results.length}</strong> results for <em>"{query}"</em>
                </p>
                {settings.aiEnabled && (
                  <AIBanner summary={aiSummary} loading={aiLoading} query={query} />
                )}
                <div className="result-cards-list">
                  {results.map((res, i) => (
                    <SearchResult key={i} result={res} index={i} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="status-container">
                <p>No results found for <strong>"{query}"</strong></p>
              </div>
            )}
          </div>

          {settings.wikiEnabled && (
            <aside className="results-sidebar">
              <Suspense fallback={<div className="sidebar-placeholder skeleton" />}>
                <InfoCard data={wikiData} />
              </Suspense>
            </aside>
          )}
        </div>
      </main>

      <style jsx>{`
        .search-page {
          min-height: 100vh;
          background: var(--bg);
        }

        .search-header {
          position: sticky;
          top: 0;
          background: rgba(5, 5, 7, 0.87);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0.75rem 0;
          z-index: 100;
        }

        .header-container {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          max-width: 1100px;
        }

        .logo-small {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          cursor: pointer;
          font-size: 0.65rem;
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.25);
          padding: 0.35rem 0.75rem;
          border-radius: 99px;
          color: #c084fc;
          transition: var(--transition);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .logo-small:hover {
          background: rgba(124, 58, 237, 0.16);
        }

        .search-box-wrapper {
          flex: 1;
          max-width: 580px;
        }

        .header-settings {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--card-bg);
          border: 1px solid var(--border);
          color: var(--fg-muted);
          transition: var(--transition);
          flex-shrink: 0;
        }

        .header-settings:hover {
          color: var(--fg);
          border-color: rgba(124, 58, 237, 0.3);
        }

        .results-container {
          max-width: 1100px;
          padding-top: 1.75rem;
          padding-bottom: 5rem;
        }

        .results-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 3rem;
        }

        .results-layout.no-sidebar {
          grid-template-columns: 1fr;
          max-width: 720px;
        }

        .results-meta {
          font-size: 0.8125rem;
          color: var(--fg-muted);
          margin-bottom: 1.25rem;
        }

        .result-cards-list {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        /* Loading */
        .status-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 0;
          gap: 1rem;
          color: var(--fg-muted);
        }

        .error-state { color: var(--error); }

        .spin {
          animation: spin 1s linear infinite;
          color: #a78bfa;
        }

        .loading-text {
          font-size: 0.9rem;
          color: var(--fg-muted);
        }

        .loading-skeletons {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          margin-top: 0.75rem;
        }

        .skeleton-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .sk-title { height: 18px; width: 70%; }
        .sk-body { height: 13px; width: 100%; }
        .sk-short { width: 45%; }

        .retry-btn {
          background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
          color: white;
          padding: 0.45rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.875rem;
          transition: var(--transition);
        }

        .retry-btn:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .sidebar-placeholder {
          height: 280px;
          border-radius: var(--radius-lg);
        }

        @media (max-width: 1024px) {
          .results-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .results-sidebar {
            order: -1;
          }
        }

        @media (max-width: 640px) {
          .header-container {
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#8888aa' }}>
        Loading…
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
