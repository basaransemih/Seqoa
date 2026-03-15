"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Theme, AppSettings } from '@/types';

const DEFAULT_SETTINGS: AppSettings = {
    theme: 'dark',
    aiEnabled: true,
    wikiEnabled: true,
    resultsPerPage: 10,
};

interface SettingsContextValue {
    settings: AppSettings;
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
    settings: DEFAULT_SETTINGS,
    updateSetting: () => {},
});

export function useSettings() {
    return useContext(SettingsContext);
}

const THEMES: Record<Theme, Record<string, string>> = {
    dark: {
        '--bg': '#050507',
        '--fg': '#f0f0ff',
        '--fg-muted': '#8888aa',
        '--border': '#1e1e30',
        '--card-bg': '#0c0c18',
        '--card-bg-hover': '#111120',
        '--input-bg': '#0e0e1c',
        '--hover-bg': '#16162a',
        '--selection': '#2d2060',
    },
    midnight: {
        '--bg': '#000000',
        '--fg': '#e8e8ff',
        '--fg-muted': '#6666aa',
        '--border': '#111111',
        '--card-bg': '#080808',
        '--card-bg-hover': '#0d0d0d',
        '--input-bg': '#0a0a0a',
        '--hover-bg': '#121212',
        '--selection': '#1a1040',
    },
    slate: {
        '--bg': '#0f172a',
        '--fg': '#e2e8f0',
        '--fg-muted': '#64748b',
        '--border': '#1e293b',
        '--card-bg': '#1e293b',
        '--card-bg-hover': '#253347',
        '--input-bg': '#1e293b',
        '--hover-bg': '#253347',
        '--selection': '#1e40af',
    },
    light: {
        '--bg': '#f8f9fc',
        '--fg': '#111827',
        '--fg-muted': '#6b7280',
        '--border': '#e5e7eb',
        '--card-bg': '#ffffff',
        '--card-bg-hover': '#f3f4f6',
        '--input-bg': '#ffffff',
        '--hover-bg': '#f3f4f6',
        '--selection': '#ddd6fe',
    },
};

function applyTheme(theme: Theme) {
    const vars = THEMES[theme];
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
    // Adjust color-scheme for light theme
    root.style.setProperty('color-scheme', theme === 'light' ? 'light' : 'dark');
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('seqoa_settings');
            if (stored) {
                const parsed = JSON.parse(stored) as Partial<AppSettings>;
                const merged = { ...DEFAULT_SETTINGS, ...parsed };
                setSettings(merged);
                applyTheme(merged.theme);
            } else {
                applyTheme(DEFAULT_SETTINGS.theme);
            }
        } catch {
            applyTheme(DEFAULT_SETTINGS.theme);
        }
    }, []);

    const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => {
            const next = { ...prev, [key]: value };
            localStorage.setItem('seqoa_settings', JSON.stringify(next));
            if (key === 'theme') {
                applyTheme(value as Theme);
            }
            return next;
        });
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
}
