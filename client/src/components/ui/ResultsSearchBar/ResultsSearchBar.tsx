import React, { useState, useRef, useEffect } from 'react';
import './ResultsSearchBar.css';
import { fetchSoftwareClasses } from '../../../services/softwareClassesService';
import { useAutocomplete } from '../../../hooks/useAutocomplete';

interface ResultsSearchBarProps {
    initialQuery?: string;
    onSearch?: (query: string, selectedTypes: string[]) => void;
    onTypeChange?: (types: string[]) => void;
}

export const ResultsSearchBar: React.FC<ResultsSearchBarProps> = ({
                                                                      initialQuery = '',
                                                                      onSearch,
                                                                      onTypeChange
                                                                  }) => {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const { query, suggestions, handleQueryChange } = useAutocomplete(300, selectedTypes);

    const [softwareTypes, setSoftwareTypes] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Подставляем initialQuery в поле при первом заходе / при смене снаружи
    useEffect(() => {
        handleQueryChange(initialQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery]);

    useEffect(() => {
        const controller = new AbortController();
        fetchSoftwareClasses(controller.signal)
            .then(setSoftwareTypes)
            .catch((err) => {
                if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
                    console.error('Не удалось загрузить типы ПО:', err);
                }
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        onTypeChange?.(selectedTypes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTypes]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setShowSuggestions(false);
    };

    const handleCheckboxChange = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleSearch = () => {
        setShowSuggestions(false);
        if (query.trim() || selectedTypes.length > 0) {
            onSearch?.(query, selectedTypes);
        }
    };

    const handleInputChange = (value: string) => {
        handleQueryChange(value);
        setShowSuggestions(true);
    };

    const handleInputFocus = () => {
        if (suggestions.length > 0) setShowSuggestions(true);
    };

    const handleSuggestionClick = (value: string) => {
        handleQueryChange(value);
        setShowSuggestions(false);
        onSearch?.(value, selectedTypes);
    };

    return (
        <div className="results-search-bar__wrapper" ref={wrapperRef}>
            <div className="results-search-bar__input-wrapper">
                <input
                    type="text"
                    className="results-search-bar__input"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={handleInputFocus}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Введите название ПО..."
                />

                {showSuggestions && suggestions.length > 0 && (
                    <div className="results-search-bar__suggestions">
                        {suggestions.map((item) => (
                            <div
                                key={item.value}
                                className="results-search-bar__suggestion-item"
                                onClick={() => handleSuggestionClick(item.value)}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="results-search-bar__dropdown-wrapper">
                <button
                    className={`results-search-bar__dropdown-trigger ${isOpen ? 'open' : ''}`}
                    onClick={handleToggle}
                >
                    <span className="results-search-bar__dropdown-label">
                        Тип ПО{selectedTypes.length > 0 ? `: ${selectedTypes.length}` : ''}
                    </span>
                    <div className={`results-search-bar__arrow ${isOpen ? 'up' : 'down'}`} />
                </button>

                {isOpen && (
                    <div className="results-search-bar__dropdown-menu open">
                        {softwareTypes.map((type) => (
                            <label key={type} className="results-search-bar__dropdown-item">
                                <span className="results-search-bar__dropdown-text">{type}</span>
                                <input
                                    type="checkbox"
                                    className="results-search-bar__dropdown-checkbox"
                                    checked={selectedTypes.includes(type)}
                                    onChange={() => handleCheckboxChange(type)}
                                />
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <button className="results-search-bar__button" onClick={handleSearch}>
                Найти решения
            </button>
        </div>
    );
};