export interface SearchResultItem {
    title: string;
    url: string;
    description: string;
    source: string;
    rank?: number;
}

export interface WikiThumbnail {
    source: string;
    width: number;
    height: number;
}

export interface WikiData {
    title: string;
    extract: string;
    thumbnail?: WikiThumbnail;
    content_urls?: { desktop?: { page?: string } };
    url: string;
}

export type Theme = 'dark' | 'midnight' | 'slate' | 'light';

export interface AppSettings {
    theme: Theme;
    aiEnabled: boolean;
    wikiEnabled: boolean;
    resultsPerPage: number;
}

export interface EngineStatus {
    name: string;
    success: number;
    failure: number;
    uptime: string;
}

export interface SystemStatus {
    status: string;
    engines: EngineStatus[];
}
