export interface SearchResultItem {
    title: string;
    url: string;
    description: string;
    source: string;
    rank?: number;
}

export interface WikiData {
    title: string;
    extract: string;
    thumbnail?: string;
    url: string;
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
