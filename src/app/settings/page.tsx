"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { Theme } from '@/types';
import {
    ArrowLeft, Moon, Sun, Layers, Sparkles,
    Globe, BookOpen, CheckCircle2, Sliders
} from 'lucide-react';

const THEMES: { id: Theme; label: string; desc: string; icon: React.ReactNode; preview: string[] }[] = [
    {
        id: 'dark',
        label: 'Dark',
        desc: 'Deep dark with purple accents',
        icon: <Moon size={16} />,
        preview: ['#050507', '#0c0c18', '#7c3aed'],
    },
    {
        id: 'midnight',
        label: 'Midnight',
        desc: 'Pure black, minimal contrast',
        icon: <Moon size={16} />,
        preview: ['#000000', '#080808', '#4f46e5'],
    },
    {
        id: 'slate',
        label: 'Slate',
        desc: 'Blue-tinted dark interface',
        icon: <Layers size={16} />,
        preview: ['#0f172a', '#1e293b', '#3b82f6'],
    },
    {
        id: 'light',
        label: 'Light',
        desc: 'Clean white, easy on the eyes',
        icon: <Sun size={16} />,
        preview: ['#f8f9fc', '#ffffff', '#7c3aed'],
    },
];

export default function SettingsPage() {
    const router = useRouter();
    const { settings, updateSetting } = useSettings();

    return (
        <div className="settings-page">
            <header className="settings-header">
                <div className="container header-inner">
                    <button className="back-btn" onClick={() => router.back()}>
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>
                    <div className="header-title">
                        <Sliders size={18} />
                        <span>Settings</span>
                    </div>
                    <div className="brand" onClick={() => router.push('/')}>
                        <Globe size={12} />
                        <span>SEQOA</span>
                    </div>
                </div>
            </header>

            <main className="container settings-main">

                {/* Theme Section */}
                <section className="settings-section fade-in">
                    <div className="section-header">
                        <h2 className="section-title">Theme</h2>
                        <p className="section-desc">Choose your preferred color scheme</p>
                    </div>
                    <div className="theme-grid">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.id}
                                className={`theme-card ${settings.theme === theme.id ? 'active' : ''}`}
                                onClick={() => updateSetting('theme', theme.id)}
                            >
                                <div className="theme-preview">
                                    {theme.preview.map((color, i) => (
                                        <div key={i} className="preview-swatch" style={{ background: color }} />
                                    ))}
                                </div>
                                <div className="theme-info">
                                    <div className="theme-name">
                                        {theme.icon}
                                        <span>{theme.label}</span>
                                    </div>
                                    <p className="theme-desc">{theme.desc}</p>
                                </div>
                                {settings.theme === theme.id && (
                                    <CheckCircle2 size={16} className="theme-check" />
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="divider" />

                {/* Features Section */}
                <section className="settings-section fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="section-header">
                        <h2 className="section-title">Features</h2>
                        <p className="section-desc">Toggle search features on or off</p>
                    </div>
                    <div className="feature-list">

                        <div className="feature-row">
                            <div className="feature-row-info">
                                <div className="feature-row-icon">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <div className="feature-row-label">AI Summary</div>
                                    <div className="feature-row-desc">1-2 sentence DeepSeek AI overview per search</div>
                                </div>
                            </div>
                            <button
                                className={`toggle ${settings.aiEnabled ? 'on' : ''}`}
                                onClick={() => updateSetting('aiEnabled', !settings.aiEnabled)}
                                aria-label="Toggle AI summary"
                            >
                                <span className="toggle-knob" />
                            </button>
                        </div>

                        <div className="feature-row">
                            <div className="feature-row-info">
                                <div className="feature-row-icon">
                                    <BookOpen size={16} />
                                </div>
                                <div>
                                    <div className="feature-row-label">Wikipedia Panel</div>
                                    <div className="feature-row-desc">Show Wikipedia info card in search results sidebar</div>
                                </div>
                            </div>
                            <button
                                className={`toggle ${settings.wikiEnabled ? 'on' : ''}`}
                                onClick={() => updateSetting('wikiEnabled', !settings.wikiEnabled)}
                                aria-label="Toggle Wikipedia panel"
                            >
                                <span className="toggle-knob" />
                            </button>
                        </div>

                    </div>
                </section>

                <div className="divider" />

                {/* Results section */}
                <section className="settings-section fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="section-header">
                        <h2 className="section-title">Results</h2>
                        <p className="section-desc">Customize your search results display</p>
                    </div>
                    <div className="feature-list">
                        <div className="feature-row">
                            <div className="feature-row-info">
                                <div className="feature-row-icon">
                                    <Layers size={16} />
                                </div>
                                <div>
                                    <div className="feature-row-label">Results per page</div>
                                    <div className="feature-row-desc">How many results to show per search</div>
                                </div>
                            </div>
                            <select
                                className="results-select"
                                value={settings.resultsPerPage}
                                onChange={(e) => updateSetting('resultsPerPage', Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="divider" />

                {/* About */}
                <section className="settings-section about-section fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="about-inner">
                        <Globe size={20} className="about-icon" />
                        <div>
                            <div className="about-name">Seqoa</div>
                            <div className="about-tagline">Privacy-first meta-search · powered by Vercel and basaransemih</div>
                        </div>
                    </div>
                </section>

            </main>

            <style jsx>{`
        .settings-page {
          min-height: 100vh;
          background: var(--bg);
        }

        .settings-header {
          position: sticky;
          top: 0;
          background: rgba(var(--bg-rgb, 5,5,7), 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0.875rem 0;
          z-index: 100;
        }

        .header-inner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--fg-muted);
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
          border: 1px solid var(--border);
          background: transparent;
        }

        .back-btn:hover {
          color: var(--fg);
          background: var(--hover-bg);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 700;
          color: var(--fg);
          flex: 1;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: #c084fc;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.3);
          padding: 0.35rem 0.7rem;
          border-radius: 99px;
          cursor: pointer;
          transition: var(--transition);
        }

        .brand:hover {
          background: rgba(124, 58, 237, 0.18);
        }

        .settings-main {
          padding-top: 2.5rem;
          padding-bottom: 5rem;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-section {}

        .section-header {
          margin-bottom: 1.25rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--fg);
          margin-bottom: 0.2rem;
        }

        .section-desc {
          font-size: 0.8125rem;
          color: var(--fg-muted);
        }

        /* Theme grid */
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .theme-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: var(--card-bg);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem;
          cursor: pointer;
          transition: all var(--transition);
          text-align: left;
          position: relative;
        }

        .theme-card:hover {
          background: var(--card-bg-hover);
          border-color: rgba(124, 58, 237, 0.3);
          transform: translateY(-1px);
        }

        .theme-card.active {
          border-color: #7c3aed;
          background: rgba(124, 58, 237, 0.06);
          box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.3);
        }

        .theme-preview {
          display: flex;
          border-radius: var(--radius-sm);
          overflow: hidden;
          height: 36px;
          gap: 2px;
        }

        .preview-swatch {
          flex: 1;
          height: 100%;
          border-radius: 3px;
        }

        .theme-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .theme-name {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--fg);
        }

        .theme-desc {
          font-size: 0.75rem;
          color: var(--fg-muted);
        }

        .theme-check {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          color: #a78bfa;
        }

        /* Divider */
        .divider {
          height: 1px;
          background: var(--border);
        }

        /* Feature list */
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .feature-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          transition: var(--transition);
        }

        .feature-row:hover {
          border-color: rgba(124, 58, 237, 0.2);
        }

        .feature-row-info {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          flex: 1;
          min-width: 0;
        }

        .feature-row-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: rgba(124, 58, 237, 0.1);
          color: #a78bfa;
          flex-shrink: 0;
        }

        .feature-row-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--fg);
          margin-bottom: 0.1rem;
        }

        .feature-row-desc {
          font-size: 0.75rem;
          color: var(--fg-muted);
        }

        /* Toggle */
        .toggle {
          width: 42px;
          height: 24px;
          border-radius: 99px;
          background: var(--border);
          border: none;
          padding: 3px;
          cursor: pointer;
          transition: background 0.3s ease;
          flex-shrink: 0;
          position: relative;
        }

        .toggle.on {
          background: linear-gradient(135deg, var(--accent-1, #7c3aed), var(--accent-2, #3b82f6));
        }

        .toggle-knob {
          display: block;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        .toggle.on .toggle-knob {
          transform: translateX(18px);
        }

        /* Select */
        .results-select {
          background: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--fg);
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.4rem 0.75rem;
          cursor: pointer;
          outline: none;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .results-select:hover, .results-select:focus {
          border-color: rgba(124, 58, 237, 0.5);
        }

        /* About */
        .about-section {
          opacity: 0.6;
        }

        .about-inner {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .about-icon {
          color: #a78bfa;
        }

        .about-name {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--fg);
        }

        .about-tagline {
          font-size: 0.75rem;
          color: var(--fg-muted);
          margin-top: 0.1rem;
        }

        @media (max-width: 768px) {
          .theme-grid {
            grid-template-columns: 1fr;
          }
          .header-inner {
            gap: 1rem;
          }
          .settings-main {
            padding: 2rem 1rem 3rem;
          }
        }

        @media (max-width: 480px) {
          .theme-grid {
            gap: 0.5rem;
          }
          .header-inner {
            gap: 0.75rem;
          }
          .settings-main {
            padding: 1.5rem 0.75rem 2rem;
            gap: 1.5rem;
          }
          .feature-row {
            padding: 0.875rem 1rem;
            gap: 1rem;
          }
          .feature-row-info {
            gap: 0.75rem;
          }
          .theme-card {
            padding: 0.875rem;
            gap: 0.625rem;
          }
          .results-select {
            font-size: 0.8rem;
            padding: 0.35rem 0.6rem;
          }
        }
      `}</style>
        </div>
    );
}
