"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import { Settings, Globe } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="landing-wrapper">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Top-right settings link */}
      <button className="settings-link" onClick={() => router.push('/settings')} aria-label="Settings">
        <Settings size={16} />
      </button>

      <div className="landing-content">
        <header className="landing-header fade-in">
          <div className="logo-badge">
            <Globe size={13} className="logo-globe" />
            <span>SEQOA</span>
          </div>
          <h1 className="landing-title">
            Search smarter.<br />
            <span className="gradient-text">Think deeper.</span>
          </h1>
          <p className="landing-subtitle">
            AI-powered meta-search across 15+ engines. Private by design.
          </p>
        </header>

        <section className="search-section fade-in" style={{ animationDelay: '0.12s' }}>
          <SearchBox onSearch={handleSearch} variant="large" />
          <div className="quick-searches">
            {['AI news', 'TypeScript', 'Climate change', 'Space exploration'].map((q) => (
              <button key={q} className="quick-chip" onClick={() => handleSearch(q)}>
                {q}
              </button>
            ))}
          </div>
        </section>

        <footer className="landing-footer fade-in" style={{ animationDelay: '0.24s' }}>
          <span>Private</span>
          <span className="dot">·</span>
          <span>15+ Sources</span>
          <span className="dot">·</span>
          <span>DeepSeek AI</span>
        </footer>
      </div>

      <style jsx>{`
        .landing-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          position: relative;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }

        .orb-1 {
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, transparent 70%);
          top: -80px;
          right: -100px;
          animation: orbPulse 9s ease-in-out infinite;
        }

        .orb-2 {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
          bottom: -80px;
          left: -80px;
          animation: orbPulse 11s ease-in-out infinite reverse;
        }

        .settings-link {
          position: fixed;
          top: 1.25rem;
          right: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--card-bg);
          border: 1px solid var(--border);
          color: var(--fg-muted);
          transition: var(--transition);
          z-index: 50;
        }

        .settings-link:hover {
          color: var(--fg);
          background: var(--hover-bg);
          border-color: rgba(124, 58, 237, 0.3);
        }

        .landing-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          padding: 2rem 1.5rem 5rem;
          width: 100%;
          max-width: 680px;
          position: relative;
          z-index: 1;
        }

        .landing-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.25);
          border-radius: 99px;
          padding: 0.35rem 0.9rem;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #c084fc;
        }

        .logo-globe {
          animation: float 4s ease-in-out infinite;
        }

        .landing-title {
          font-size: clamp(2.4rem, 6vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--fg);
        }

        .landing-subtitle {
          font-size: 1rem;
          color: var(--fg-muted);
          max-width: 400px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* Search */
        .search-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .quick-searches {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .quick-chip {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--fg-muted);
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 99px;
          padding: 0.3rem 0.875rem;
          transition: var(--transition);
          cursor: pointer;
        }

        .quick-chip:hover {
          color: var(--fg);
          border-color: rgba(124, 58, 237, 0.35);
          background: rgba(124, 58, 237, 0.06);
        }

        /* Footer */
        .landing-footer {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: var(--fg-muted);
        }

        .dot {
          opacity: 0.4;
        }

        @media (max-width: 768px) {
          .landing-title {
            font-size: 2.4rem;
          }
          
          .landing-content {
            padding: 1.5rem 1rem 3rem;
            gap: 2rem;
          }
          
          .orb-1 {
            width: 400px;
            height: 400px;
            top: -60px;
            right: -80px;
          }
          
          .orb-2 {
            width: 350px;
            height: 350px;
            bottom: -60px;
            left: -60px;
          }
        }

        @media (max-width: 480px) {
          .landing-title {
            font-size: 2rem;
          }
          
          .landing-subtitle {
            font-size: 0.9rem;
          }
          
          .quick-searches {
            display: none;
          }
          
          .landing-content {
            padding: 1rem 0.75rem 2rem;
            gap: 1.5rem;
          }
          
          .orb-1, .orb-2 {
            filter: blur(60px);
          }
          
          .settings-link {
            top: 1rem;
            right: 1rem;
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
}
