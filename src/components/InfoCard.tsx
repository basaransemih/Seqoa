"use client";

import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { WikiData } from '@/types';

interface InfoCardProps {
    data: WikiData | null;
}

export default function InfoCard({ data }: InfoCardProps) {
    if (!data) return null;

    // Wikipedia API returns thumbnail as object {source, width, height}
    const thumbSrc = data.thumbnail?.source ?? null;
    // Prefer direct URL, fallback to content_urls
    const articleUrl = data.url || data.content_urls?.desktop?.page || '#';

    return (
        <div className="info-card fade-in">
            {thumbSrc && (
                <div className="image-wrapper">
                    <img
                        src={thumbSrc}
                        alt={data.title}
                        className="info-image"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                    />
                </div>
            )}
            <div className="info-content">
                <div className="info-header">
                    <BookOpen size={14} className="header-icon" />
                    <span className="header-label">Wikipedia</span>
                </div>
                <h3 className="info-title">{data.title}</h3>
                <p className="info-extract">{data.extract}</p>
                <a href={articleUrl} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read more <ExternalLink size={13} />
                </a>
            </div>

            <style jsx>{`
        .info-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          width: 100%;
          transition: var(--transition);
        }

        .info-card:hover {
          border-color: rgba(124, 58, 237, 0.3);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .image-wrapper {
          width: 100%;
          height: 180px;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }

        .info-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          transition: transform 0.5s ease;
        }

        .info-card:hover .info-image {
          transform: scale(1.04);
        }

        .info-content {
          padding: 1.25rem;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.6rem;
          color: var(--fg-muted);
        }

        .header-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .info-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--fg);
          line-height: 1.3;
        }

        .info-extract {
          font-size: 0.875rem;
          color: var(--fg-muted);
          line-height: 1.65;
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #a78bfa;
          text-decoration: none;
          transition: var(--transition);
        }

        .read-more:hover {
          color: #c084fc;
        }
      `}</style>
        </div>
    );
}
