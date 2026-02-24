"use client";

import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { WikiData } from '@/types';

interface InfoCardProps {
    data: WikiData | null;
}

export default function InfoCard({ data }: InfoCardProps) {
    if (!data) return null;

    return (
        <div className="info-card fade-in">
            {data.thumbnail && (
                <div className="image-wrapper">
                    <img src={data.thumbnail} alt={data.title} className="info-image" />
                </div>
            )}
            <div className="info-content">
                <div className="info-header">
                    <BookOpen size={16} className="header-icon" />
                    <span className="header-label">Wikipedia</span>
                </div>
                <h3 className="info-title">{data.title}</h3>
                <p className="info-extract">{data.extract}</p>
                <a href={data.url} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read more on Wikipedia <ExternalLink size={14} />
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
          border-color: var(--fg-muted);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .image-wrapper {
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }

        .info-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .info-card:hover .info-image {
          transform: scale(1.05);
        }

        .info-content {
          padding: 1.5rem;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: var(--fg-muted);
        }

        .header-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--fg);
        }

        .info-extract {
          font-size: 0.95rem;
          color: var(--fg-muted);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--fg);
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }

        .read-more:hover {
          border-color: var(--fg);
        }
      `}</style>
        </div>
    );
}
