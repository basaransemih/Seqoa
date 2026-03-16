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
            if (q.length < 2) { setSuggestions([]); return; }
            try {
                const res = await fetch(`https://tekir.co/api/recommend?q=${encodeURIComponent(q)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error('Autocomplete fetch error:', err);
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
        if (e.key === 'Enter') handleSubmit();
        if (e.key === 'Escape') setShowSuggestions(false);
    };

    const isLarge = variant === 'large';

    return (
        <div ref={containerRef} className={`search-container ${variant}`}>
            <form onSubmit={handleSubmit} className="search-form">
                <div className="input-wrapper">
                    <Search className="search-icon" size={isLarge ? 19 : 16} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={isLarge ? 'Search anything...' : 'Search the web...'}
                        className="search-input"
                        autoComplete="off"
                        autoFocus={isLarge}
                    />
                    {query && (
                        <button type="button" onClick={() => { setQuery(''); setSuggestions([]); }} className="icon-btn clear-btn">
                            <X size={15} />
                        </button>
                    )}
                    <button type="submit" className="submit-btn" aria-label="Search">
                        <ArrowRight size={isLarge ? 18 : 16} />
                    </button>
                </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown fade-in">
                    {suggestions.map((s, i) => (
                        <div
                            key={i}
                            className="suggestion-item"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setQuery(s);
                                onSearch(s);
                                setShowSuggestions(false);
                            }}
                        >
                            <Search size={13} className="suggestion-icon" />
                            <span>{s}</span>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .search-container {
          position: relative;
          width: 100%;
        }

        .search-form {
          width: 100%;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: ${isLarge ? 'var(--radius-xl)' : 'var(--radius-lg)'};
          padding: 0 ${isLarge ? '1.25rem' : '0.875rem'};
          height: ${isLarge ? '60px' : '44px'};
          transition: all var(--transition);
          position: relative;
        }

        .input-wrapper:focus-within {
          border-color: rgba(124, 58, 237, 0.6);
          background: rgba(14, 14, 28, 0.95);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12), 0 8px 24px rgba(0,0,0,0.4);
        }

        .search-input {
          flex: 1;
          height: 100%;
          background: transparent;
          font-size: ${isLarge ? '1.0625rem' : '0.9375rem'};
          font-weight: 500;
          padding: 0 0.625rem;
          color: var(--fg);
          caret-color: #a78bfa;
        }

        .search-input::placeholder {
          color: var(--fg-muted);
          font-weight: 400;
        }

        .search-icon {
          color: var(--fg-muted);
          flex-shrink: 0;
          transition: var(--transition);
        }

        .input-wrapper:focus-within .search-icon {
          color: #a78bfa;
        }

        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          color: var(--fg-muted);
          transition: var(--transition);
        }

        .icon-btn:hover {
          color: var(--fg);
          background: var(--hover-bg);
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: ${isLarge ? '0.5rem 0.75rem' : '0.4rem 0.6rem'};
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
          color: white;
          margin-left: 0.375rem;
          flex-shrink: 0;
          transition: all var(--transition);
        }

        .submit-btn:hover {
          opacity: 0.9;
          transform: translateX(1px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
        }

        .suggestions-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: var(--card-bg);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: var(--radius-lg);
          overflow: hidden;
          z-index: 200;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(124, 58, 237, 0.05);
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.125rem;
          cursor: pointer;
          transition: var(--transition);
          gap: 0.625rem;
        }

        .suggestion-item:hover {
          background: var(--hover-bg);
        }

        .suggestion-icon {
          color: #a78bfa;
          flex-shrink: 0;
        }

        .suggestion-item span {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--fg);
        }
      `}</style>
        </div>
    );
}
