"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import { Shield, Zap, Search } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-content container">
        <header className="landing-header fade-in">
          <div className="logo">
            <span className="logo-text">Seqoa</span>
          </div>
          <h1 className="landing-title">Searching redefined by intelligence.</h1>
          <p className="landing-subtitle">
            Privacy-focused, high-performance meta-aggregation engine combining results from 15+ sources.
          </p>
        </header>

        <section className="search-section fade-in" style={{ animationDelay: '0.1s' }}>
          <SearchBox onSearch={handleSearch} variant="large" />
        </section>

        <footer className="landing-footer fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="features">
            <div className="feature">
              <Shield size={20} />
              <span>Privately Aggregated</span>
            </div>
            <div className="feature">
              <Zap size={20} />
              <span>Real-time Results</span>
            </div>
            <div className="feature">
              <Search size={20} />
              <span>15+ Engines</span>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .landing-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #0a0a0a 0%, #000000 100%);
        }

        .landing-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          padding-bottom: 5rem;
        }

        .landing-header {
          text-align: center;
        }

        .logo {
          margin-bottom: 1.5rem;
        }

        .logo-text {
          font-size: 0.875rem;
          font-weight: 800;
          letter-spacing: 0.5em;
          color: var(--fg);
          border: 1px solid var(--fg);
          padding: 0.5rem 1rem 0.5rem 1.5rem;
          display: inline-block;
        }

        .landing-title {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: var(--fg);
        }

        .landing-subtitle {
          font-size: 1.125rem;
          color: var(--fg-muted);
          max-width: 500px;
          margin: 0 auto;
        }

        .search-section {
          width: 100%;
          max-width: 600px;
        }

        .features {
          display: flex;
          gap: 3rem;
          color: var(--fg-muted);
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .landing-title {
            font-size: 2.5rem;
          }
          
          .features {
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
