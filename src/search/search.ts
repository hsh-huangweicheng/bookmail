export interface SerachRequest {
    keyword: string;
    offset?: number;
    count?: number;
}

export interface SearchResult {
    list: any[];
    total: number;
}

export interface Search {
    search(req: SerachRequest): Promise<SearchResult>;
}