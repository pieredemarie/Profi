import { apiClient } from './api';

export interface AutocompleteItem {
    label: string;
    value: string;
}

export const fetchAutocomplete = async (query: string): Promise<AutocompleteItem[]> => {
    if (!query || query.trim().length < 2) return [];

    
    const response = await apiClient.get('/importReplacements', {
        params: { query: query.trim() }
    });

    return response.data;
};