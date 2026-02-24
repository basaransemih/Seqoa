"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import debounce from 'lodash.debounce';

interface SearchBoxProps {
    initialValue?: string;
    onSearch: (query: string) => void;
    variant?: 'large' | 'small';
}

export default function SearchBox({ initialValue = '', onSearch, variant = 'large' }: SearchBoxProps) {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchSuggestions = useRef(
        debounce(async (q: string) => {
            if (q.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const res = await fetch(`https://seqoa-proxy.vercel.app/api/auto-complete?q=${encodeURIComponent(q)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Autocomplete fetch error:", err);
            }
        }, 300)
    ).current;

    useEffect(() => {
        if (query && showSuggestions) {
            fetchSuggestions(query);
        } else {
            setSuggestions([]);
        }
    }, [query, showSuggestions, fetchSuggestions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div ref={containerRef} className={`search-container ${variant}`}>
            <form onSubmit={handleSubmit} className="search-form">
                <div className="input-wrapper">
                    <Search className="search-icon" size={variant === 'large' ? 20 : 18} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search the web..."
                        className="search-input"
                    />
                    {query && (
                        <button type="button" onClick={() => setQuery('')} className="clear-btn">
                            <X size={18} />
                        </button>
                    )}
                    <button type="submit" className="submit-btn" aria-label="Search">
                        <ArrowRight size={variant === 'large' ? 20 : 18} />
                    </button>
                </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown fade-in">
                    {suggestions.map((s, i) => (
                        <div
                            key={i}
                            className="suggestion-item"
                            onClick={() => {
                                setQuery(s);
                                onSearch(s);
                                setShowSuggestions(false);
                            }}
                        >
                            <Search size={14} className="suggestion-icon" />
                            <span>{s}</span>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .search-container {
          position: relative;
          width: 100%;
          transition: var(--transition);
        }
        
        .search-form {
          width: 100%;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 0 1rem;
          height: ${variant === 'large' ? '64px' : '48px'};
          transition: all var(--transition);
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
        }

        .input-wrapper:focus-within {
          border-color: var(--accent);
          background: var(--bg);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 255, 255, 0.05);
        }

        .search-input {
          flex: 1;
          height: 100%;
          background: transparent;
          font-size: ${variant === 'large' ? '1.125rem' : '1rem'};
          font-weight: 500;
          padding: 0 0.75rem;
        }

        .search-icon {
          color: var(--fg-muted);
        }

        .clear-btn, .submit-btn {
          color: var(--fg-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
        }

        .submit-btn {
          color: var(--fg);
          margin-left: 0.25rem;
        }

        .clear-btn:hover, .submit-btn:hover {
          color: var(--fg);
          background: var(--hover-bg);
        }

        .suggestions-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          padding: 0.875rem 1rem;
          cursor: pointer;
          transition: var(--transition);
          gap: 0.75rem;
        }

        .suggestion-item:hover {
          background: var(--hover-bg);
        }

        .suggestion-icon {
          color: var(--fg-muted);
        }

        .suggestion-item span {
          font-size: 0.95rem;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
}
