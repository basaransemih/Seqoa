"use client";

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle } from 'lucide-react';
import { SystemStatus } from '@/types';

export default function StatusIndicator() {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/status');
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data);
                }
            } catch (err) {
                console.error("Status fetch error:", err);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    if (!status) return null;

    return (
        <div className="status-indicator">
            <button className="status-trigger" onClick={() => setOpen(!open)}>
                <Activity size={14} className={status.status === 'online' ? 'pulse' : ''} />
                <span>System {status.status}</span>
            </button>

            {open && (
                <div className="status-dropdown fade-in">
                    <div className="status-header">
                        <h4>Engine Status</h4>
                        <span className="uptime-label">Uptime</span>
                    </div>
                    <div className="engine-list">
                        {status.engines.map((engine, i) => (
                            <div key={i} className="engine-item">
                                <div className="engine-info">
                                    {engine.failure === 0 ? (
                                        <CheckCircle size={14} className="icon-success" />
                                    ) : (
                                        <XCircle size={14} className="icon-error" />
                                    )}
                                    <span className="engine-name">{engine.name}</span>
                                </div>
                                <span className="engine-uptime">{engine.uptime}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
        .status-indicator {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 200;
        }

        .status-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg);
          border: 1px solid var(--border);
          padding: 0.5rem 0.75rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--fg);
          transition: var(--transition);
        }

        .status-trigger:hover {
          background: var(--hover-bg);
          border-color: var(--fg-muted);
        }

        .pulse {
          color: #10b981;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .status-dropdown {
          position: absolute;
          bottom: calc(100% + 12px);
          right: 0;
          width: 240px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }

        .status-header h4 {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .uptime-label {
          font-size: 0.7rem;
          color: var(--fg-muted);
        }

        .engine-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .engine-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .engine-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .icon-success { color: #10b981; }
        .icon-error { color: #ef4444; }

        .engine-name {
          font-size: 0.8125rem;
          text-transform: capitalize;
        }

        .engine-uptime {
          font-size: 0.75rem;
          color: var(--fg-muted);
        }
      `}</style>
        </div>
    );
}
