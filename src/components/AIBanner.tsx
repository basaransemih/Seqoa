"use client";

import React from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface AIBannerProps {
    summary: string | null;
    loading: boolean;
    query?: string;
}

export default function AIBanner({ summary, loading, query }: AIBannerProps) {
    if (!loading && !summary) return null;

    const isError = summary?.startsWith('Error:');
    const displaySummary = isError ? summary?.replace('Error: ', '') : summary;

    return (
        <div className={`ai-banner fade-in-scale ${isError ? 'ai-error' : ''}`}>
            <div className="ai-banner-header">
                <div className="ai-label">
                    {isError ? (
                        <AlertCircle size={13} className="ai-link-icon" />
                    ) : (
                        <Sparkles size={13} className="ai-icon" />
                    )}
                    <span>{isError ? 'AI Service Error' : 'AI Summary'}</span>
                </div>
                {loading && <Loader2 size={13} className="ai-spinner" />}
            </div>

            {loading ? (
                <div className="ai-skeleton">
                    <div className="skeleton skeleton-line" style={{ width: '85%' }} />
                    <div className="skeleton skeleton-line" style={{ width: '60%' }} />
                </div>
            ) : (
                <p className={`ai-summary-text ${isError ? 'error-text' : ''}`}>{displaySummary}</p>
            )}

            <style jsx>{`
        .ai-banner {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(59, 130, 246, 0.06) 100%);
          border: 1px solid rgba(124, 58, 237, 0.25);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: var(--transition);
        }

        .ai-banner.ai-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .ai-banner.ai-error::before {
          background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.6), transparent);
        }

        .ai-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.6), transparent);
        }

        .ai-banner-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .ai-label {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #a78bfa;
        }

        .ai-error .ai-label {
          color: #f87171;
        }

        .ai-icon {
          color: #c084fc;
          animation: pulse 2.5s ease-in-out infinite;
        }

        .ai-spinner {
          color: #a78bfa;
          animation: spin 1.2s linear infinite;
        }

        .ai-summary-text {
          font-size: 0.9rem;
          color: var(--fg);
          line-height: 1.65;
          font-weight: 400;
        }
        
        .error-text {
          color: #fca5a5;
          font-size: 0.85rem;
        }

        .ai-skeleton {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .skeleton-line {
          height: 14px;
        }
      `}</style>
        </div>
    );
}
