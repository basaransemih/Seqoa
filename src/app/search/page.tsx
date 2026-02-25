"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import SearchResult from '@/components/SearchResult';
import InfoCard from '@/components/InfoCard';
import { SearchResultItem, WikiData } from '@/types';
import { Loader2, AlertCircle } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch results and wiki data in parallel
      const [searchRes, wikiRes] = await Promise.all([
        fetch(`https://seqoa-proxy.vercel.app/api/search?q=${encodeURIComponent(q)}`),
        fetch(`https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`)
      ]);

      if (!searchRes.ok) throw new Error("Search failed");

      const searchData = await searchRes.json();
      setResults(searchData.results || []);
      if (wikiRes.ok) {
        const wikiInfo = await wikiRes.json();
        setWikiData(wikiInfo && wikiInfo.title ? wikiInfo : null);
      } else {
        setWikiData(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch results. Please check if the proxy is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (newQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <div className="container header-container">
          <div className="logo-small" onClick={() => router.push('/')}>
            <span>Seqoa</span>
          </div>
          <div className="search-box-wrapper">
            <SearchBox initialValue={query} onSearch={handleNewSearch} variant="small" />
          </div>
        </div>
      </header>

      <main className="container results-container">
        <div className="results-layout">
          <div className="results-list">
            {loading ? (
              <div className="status-container">
                <Loader2 className="animate-spin" size={32} />
                <p>Searching for "{query}"...</p>
              </div>
            ) : error ? (
              <div className="status-container error">
                <AlertCircle size={32} />
                <p>{error}</p>
                <button onClick={() => performSearch(query)} className="retry-btn">Retry</button>
              </div>
            ) : results.length > 0 ? (
              <div className="results-wrapper">
                <p className="results-count">About {results.length} results found for "{query}"</p>
                {results.map((res, i) => (
                  <SearchResult key={i} result={res} />
                ))}
              </div>
            ) : (
              <div className="status-container">
                <p>No results found for "{query}"</p>
              </div>
            )}
          </div>

          <aside className="results-sidebar">
            <Suspense fallback={<div className="sidebar-placeholder" />}>
              <InfoCard data={wikiData} />
            </Suspense>
          </aside>
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
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 1rem 0;
          z-index: 100;
        }

        .header-container {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        .logo-small {
          font-weight: 800;
          letter-spacing: 0.2em;
          cursor: pointer;
          font-size: 0.75rem;
          border: 1px solid var(--fg);
          padding: 6px 10px 6px 12px;
        }

        .search-box-wrapper {
          flex: 1;
          max-width: 600px;
        }

        .results-container {
          padding-top: 2rem;
          padding-bottom: 5rem;
        }

        .results-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 4rem;
        }

        .results-count {
          font-size: 0.875rem;
          color: var(--fg-muted);
          margin-bottom: 2rem;
        }

        .status-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 0;
          gap: 1.5rem;
          color: var(--fg-muted);
        }

        .status-container.error {
          color: #ff4d4d;
        }

        .retry-btn {
          background: var(--fg);
          color: var(--bg);
          padding: 0.5rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          transition: var(--transition);
        }

        .retry-btn:hover {
          background: var(--fg-muted);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .sidebar-placeholder {
          height: 300px;
          border-radius: var(--radius-lg);
          background: var(--card-bg);
          border: 1px solid var(--border);
          opacity: 0.5;
        }

        @media (max-width: 1024px) {
          .results-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .results-sidebar {
            order: -1;
          }
        }

        @media (max-width: 640px) {
          .header-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .logo-small {
             align-self: center;
          }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading-fallback">Loading Seqoa Search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
