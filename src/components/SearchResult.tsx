"use client";

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SearchResultItem } from '@/types';

interface SearchResultProps {
    result: SearchResultItem;
    index?: number;
}

export default function SearchResult({ result, index = 0 }: SearchResultProps) {
    let displayUrl = result.url;
    let domain = '';
    try {
        const u = new URL(result.url);
        domain = u.hostname;
        displayUrl = u.hostname + u.pathname.replace(/\/$/, '');
        if (displayUrl.length > 60) displayUrl = displayUrl.substring(0, 60) + '…';
    } catch {
        domain = '';
    }

    const faviconUrl = domain ? `https://www.google.com/s2/favicons?sz=32&domain=${domain}` : null;

    return (
        <div
            className="result-card fade-in"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
        >
            {/* Header row: favicon + domain */}
            <div className="result-source-row">
                {faviconUrl && (
                    <img
                        src={faviconUrl}
                        alt=""
                        className="result-favicon"
                        width={16}
                        height={16}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                )}
                <span className="result-domain">{domain || displayUrl}</span>
                <span className="result-source-tag">{result.source}</span>
            </div>

            {/* Title */}
            <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="result-title"
            >
                {result.title}
                <ExternalLink size={13} className="result-external-icon" />
            </a>

            {/* URL display */}
            <div className="result-url">{displayUrl}</div>

            {/* Description */}
            <p className="result-description">{result.description}</p>

            <style jsx>{`
        .result-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          transition: all var(--transition);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .result-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--gradient-border);
          opacity: 0;
          transition: var(--transition);
          border-radius: 2px 0 0 2px;
        }

        .result-card:hover {
          background: var(--card-bg-hover);
          border-color: rgba(124, 58, 237, 0.25);
          box-shadow: var(--shadow-card-hover);
          transform: translateY(-2px);
        }

        .result-card:hover::before {
          opacity: 1;
        }

        .result-source-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .result-favicon {
          border-radius: 3px;
          flex-shrink: 0;
          object-fit: contain;
        }

        .result-domain {
          font-size: 0.8125rem;
          color: #a3e635;
          font-weight: 500;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .result-source-tag {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: rgba(124, 58, 237, 0.12);
          color: #a78bfa;
          padding: 2px 7px;
          border-radius: 99px;
          border: 1px solid rgba(124, 58, 237, 0.2);
          flex-shrink: 0;
        }

        .result-title {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--fg);
          margin-bottom: 0.25rem;
          line-height: 1.4;
          text-decoration: none;
          transition: var(--transition);
        }

        .result-title:hover {
          color: #c084fc;
        }

        .result-external-icon {
          margin-top: 0.25rem;
          opacity: 0;
          transition: var(--transition);
          flex-shrink: 0;
          color: var(--fg-muted);
        }

        .result-card:hover .result-external-icon {
          opacity: 1;
        }

        .result-url {
          font-size: 0.75rem;
          color: var(--fg-muted);
          margin-bottom: 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .result-description {
          font-size: 0.9rem;
          color: var(--fg-muted);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .result-title {
            font-size: 1rem;
          }
          .result-card {
            padding: 1rem 1.25rem;
          }
        }
      `}</style>
        </div>
    );
}
