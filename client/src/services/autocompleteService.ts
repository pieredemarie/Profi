import { apiClient } from './api';

export interface AutocompleteItem {
    label: string;
    value: string;
}

export const fetchAutocomplete = async (
    query: string,
    softwareClasses: string[] = [],
    signal?: AbortSignal
): Promise<AutocompleteItem[]> => {
    if (!query || query.trim().length < 2) return [];

    const params: Record<string, string> = { query: query.trim() };
    if (softwareClasses.length > 0) {
        params.software_classes = softwareClasses.join(',');
    }

    const response = await apiClient.get('/import_replacements', {
        params,
        signal,
    });

    return response.data;
};