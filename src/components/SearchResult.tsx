"use client";

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SearchResultItem } from '@/types';

interface SearchResultProps {
    result: SearchResultItem;
}

export default function SearchResult({ result }: SearchResultProps) {
    // Extract domain for display
    const displayUrl = new URL(result.url).hostname;

    return (
        <div className="result-item fade-in">
            <div className="result-header">
                <span className="source-tag">{result.source}</span>
                <span className="result-domain">{displayUrl}</span>
            </div>
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="result-title">
                {result.title}
            </a>
            <p className="result-description">{result.description}</p>

            <style jsx>{`
        .result-item {
          margin-bottom: 2.5rem;
          max-width: 650px;
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
        }

        .source-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: var(--hover-bg);
          color: var(--fg-muted);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border);
        }

        .result-domain {
          font-size: 0.875rem;
          color: var(--fg-muted);
        }

        .result-title {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--fg);
          margin-bottom: 0.5rem;
          line-height: 1.3;
          text-decoration: none;
        }

        .result-title:hover {
          text-decoration: underline;
        }

        .result-description {
          font-size: 0.95rem;
          color: var(--fg-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .result-title {
            font-size: 1.125rem;
          }
        }
      `}</style>
        </div>
    );
}
