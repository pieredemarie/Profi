import { apiClient } from './api';

export const fetchSoftwareClasses = async (signal?: AbortSignal): Promise<string[]> => {
    const response = await apiClient.get('/import_replacements/software-classes', { signal });
    return response.data;
};