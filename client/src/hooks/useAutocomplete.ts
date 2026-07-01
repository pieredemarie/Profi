import { useState, useEffect, useCallback, useRef } from 'react';
// Импорт типа (сам запрос пока не используем, но оставляем для будущего)
import type { AutocompleteItem } from '../services/autocompleteService';

// Ключ для кэша в localStorage
const CACHE_KEY = 'autocomplete_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 минут в миллисекундах

interface CacheItem {
    timestamp: number;
    data: AutocompleteItem[];
}

// --- МОК-ДАННЫЕ ДЛЯ ТЕСТИРОВАНИЯ ---
const MOCK_DATA = [
    'FortiGate IPS',
    'FortiGate Firewall',
    'Microsoft Office',
    'Microsoft Windows',
    'AlienVault',
    'AlienVault OSSIM',
    'Cisco Endpoint Secure',
    'Cisco IOS Intrusion',
    'VMware vSphere',
    'VMware Horizon',
    'SAP ERP',
    'SAP S/4HANA',
    'Check Point Harmony',
    'Check Point VPN',
    'Jira Software',
    'Jira Service Management',
    'LogRhythm SIEM',
    'LogRhythm Platform'
];

export const useAutocomplete = (debounceDelay: number = 300) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Основная функция загрузки с кэшем
    const loadSuggestions = useCallback(async (searchTerm: string) => {
        if (searchTerm.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        // 1. Проверяем кэш
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

        // Если данные есть и они не старше 5 минут — используем их
        if (cachedItem && (now - cachedItem.timestamp) < CACHE_TTL) {
            setSuggestions(cachedItem.data);
            return;
        }

        // 2. Имитация сетевого запроса (вместо реального API)
        setIsLoading(true);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            // Имитация задержки сети (чтобы увидеть работу debounce)
            await new Promise(resolve => setTimeout(resolve, 300));

            // Поиск по массиву моков
            const searchLower = searchTerm.trim().toLowerCase();
            const results = MOCK_DATA
                .filter(name => name.toLowerCase().includes(searchLower))
                .map(name => ({
                    label: name,
                    value: name
                }))
                .slice(0, 5); // Ограничиваем 5 результатами

            setSuggestions(results);

            // 3. Сохраняем результат в localStorage
            cache[searchTerm] = {
                timestamp: now,
                data: results,
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (error) {
            if ((error as any).name !== 'AbortError') {
                console.error('Ошибка автодополнения (мок):', error);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Дебаунс + вызов загрузки
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