import { useState, useEffect, useCallback, useRef } from 'react';

import { fetchAutocomplete } from '../services/autocompleteService';
import type { AutocompleteItem } from '../services/autocompleteService';

const CACHE_KEY = 'autocomplete_cache';
const CACHE_TTL = 5 * 60 * 1000;

interface CacheItem {
    timestamp: number;
    data: AutocompleteItem[];
}

export const useAutocomplete = (debounceDelay: number = 300) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const loadSuggestions = useCallback(async (searchTerm: string) => {
        if (searchTerm.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const cachedString = localStorage.getItem(CACHE_KEY);
        let cache: Record<string, CacheItem> = {};
        if (cachedString) {
            try {
                cache = JSON.parse(cachedString);
            } catch (e) {
                cache = {};
            }
        }

        const now = Date.now();
        const cachedItem = cache[searchTerm];

        if (cachedItem && (now - cachedItem.timestamp) < CACHE_TTL) {
            setSuggestions(cachedItem.data);
            return;
        }

        setIsLoading(true);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {

            const data = await fetchAutocomplete(searchTerm);
            setSuggestions(data);

            cache[searchTerm] = {
                timestamp: now,
                data: data,
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (error) {
            if ((error as any).name !== 'AbortError') {
                console.error('Ошибка автодополнения:', error);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadSuggestions(query);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [query, loadSuggestions, debounceDelay]);

    const handleQueryChange = useCallback((newQuery: string) => {
        setQuery(newQuery);
    }, []);

    return { query, suggestions, isLoading, handleQueryChange };
};