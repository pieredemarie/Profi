import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAutocomplete } from '../services/autocompleteService';
import type { AutocompleteItem } from '../services/autocompleteService';

const CACHE_KEY = 'autocomplete_cache';
const CACHE_TTL = 5 * 60 * 1000;

interface CacheItem {
    timestamp: number;
    data: AutocompleteItem[];
}

export const useAutocomplete = (debounceDelay: number = 300, softwareClasses: string[] = []) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const requestIdRef = useRef(0);

    const loadSuggestions = useCallback(async (searchTerm: string, classes: string[]) => {
        if (searchTerm.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const cacheKey = `${searchTerm.trim().toLowerCase()}|${[...classes].sort().join(',')}`;

        const cachedString = localStorage.getItem(CACHE_KEY);
        let cache: Record<string, CacheItem> = {};
        if (cachedString) {
            try {
                cache = JSON.parse(cachedString);
            } catch {
                cache = {};
            }
        }

        const now = Date.now();
        const cachedItem = cache[cacheKey];

        if (cachedItem && (now - cachedItem.timestamp) < CACHE_TTL) {
            setSuggestions(cachedItem.data);
            return;
        }

        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const requestId = ++requestIdRef.current;

        setIsLoading(true);
        try {
            const data = await fetchAutocomplete(searchTerm, classes, controller.signal);

            if (requestId !== requestIdRef.current) return;

            setSuggestions(data);
            cache[cacheKey] = { timestamp: now, data };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (error) {
            if ((error as any).name !== 'CanceledError' && (error as any).name !== 'AbortError') {
                console.error('Ошибка автодополнения:', error);
            }
        } finally {
            if (requestId === requestIdRef.current) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadSuggestions(query, softwareClasses);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [query, softwareClasses, loadSuggestions, debounceDelay]);

    const handleQueryChange = useCallback((newQuery: string) => {
        setQuery(newQuery);
    }, []);

    return { query, suggestions, isLoading, handleQueryChange };
};