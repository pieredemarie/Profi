import { apiClient } from './api';

export interface ClassReplacementItem {
    foreign_product_name: string;
    domestic_product_name: string;
    registry_number: string;
    software_class: string;
}

export interface SearchResultItem {
    partner_product_name: string;
    partner_organisation_name: string;
    registry_number: string;
    software_class: string;
}

export const fetchReplacementsByClass = async (
    softwareClass: string,
    signal?: AbortSignal
): Promise<ClassReplacementItem[]> => {
    const response = await apiClient.get('/import_replacements/software-classes/partner-replacements', {
        params: { software_class: softwareClass },
        signal,
    });
    return response.data;
};

export const fetchReplacementsByForeignProduct = async (
    foreignProductName: string,
    softwareClasses: string[] = [],
    signal?: AbortSignal
): Promise<SearchResultItem[]> => {
    const params: Record<string, string> = { foreign_product_name: foreignProductName };
    if (softwareClasses.length > 0) {
        params.software_classes = softwareClasses.join(',');
    }
    const response = await apiClient.get('/import_replacements/foreign-product/partner-replacements', {
        params,
        signal,
    });
    return response.data;
};

export interface EnrichedResult {
    softwareClass: string;
    partnerProductName: string;
    registryNumber: string;
    replaces: string[];
}

export const fetchSearchResults = async (
    foreignProductName: string,
    softwareClasses: string[] = [],
    signal?: AbortSignal
): Promise<EnrichedResult[]> => {
    const searchResults = await fetchReplacementsByForeignProduct(foreignProductName, softwareClasses, signal);
    if (searchResults.length === 0) return [];

    const uniqueClasses = Array.from(new Set(searchResults.map(r => r.software_class)));
    const classData = await Promise.all(
        uniqueClasses.map(cls => fetchReplacementsByClass(cls, signal))
    );

    const replacesMap = new Map<string, Map<string, string[]>>();
    uniqueClasses.forEach((cls, idx) => {
        const byDomestic = new Map<string, string[]>();
        classData[idx].forEach(item => {
            const list = byDomestic.get(item.domestic_product_name) ?? [];
            list.push(item.foreign_product_name);
            byDomestic.set(item.domestic_product_name, list);
        });
        replacesMap.set(cls, byDomestic);
    });

    return searchResults.map(r => ({
        softwareClass: r.software_class,
        partnerProductName: r.partner_product_name,
        registryNumber: r.registry_number,
        replaces: replacesMap.get(r.software_class)?.get(r.partner_product_name) ?? [],
    }));
};