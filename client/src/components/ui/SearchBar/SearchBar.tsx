import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import { useAutocomplete } from '../../../hooks/useAutocomplete';
import { fetchSoftwareClasses } from '../../../services/softwareClassesService';

interface SearchBarProps {
    onSearch?: (query: string, selectedTypes: string[]) => void;
    onTypeChange?: (types: string[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onTypeChange }) => {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const { query, suggestions, handleQueryChange } = useAutocomplete(300, selectedTypes);

    const [softwareTypes, setSoftwareTypes] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

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
        onSearch?.(query, selectedTypes);
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
        <div className="search-bar__wrapper" ref={wrapperRef}>
            <div className="search-bar__input-wrapper">
                <div className="search-bar__dropdown-group">
                    <div className={`search-bar__input-container ${showSuggestions && suggestions.length > 0 ? 'has-suggestions' : ''}`}>
                        <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21L16.65 16.65" />
                        </svg>
                        <input
                            type="text"
                            className="search-bar__input"
                            placeholder='"FortiGate IPS" или "СУБД"'
                            value={query}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onFocus={handleInputFocus}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="search-bar__suggestions">
                            {suggestions.map((item) => (
                                <div
                                    key={item.value}
                                    className="search-bar__suggestion-item"
                                    onClick={() => handleSuggestionClick(item.value)}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="search-bar__dropdown-wrapper">
                <button
                    className={`search-bar__dropdown-trigger ${isOpen ? 'open' : ''}`}
                    onClick={handleToggle}
                >
                    <span className="search-bar__dropdown-label">
                        Тип ПО{selectedTypes.length > 0 ? `: ${selectedTypes.length}` : ''}
                    </span>
                    <div className={`search-bar__arrow ${isOpen ? 'up' : 'down'}`} />
                </button>

                {isOpen && (
                    <div className="search-bar__dropdown-menu open">
                        {softwareTypes.map((type) => (
                            <label key={type} className="search-bar__dropdown-item">
                                <span className="search-bar__dropdown-text">{type}</span>
                                <input
                                    type="checkbox"
                                    className="search-bar__dropdown-checkbox"
                                    checked={selectedTypes.includes(type)}
                                    onChange={() => handleCheckboxChange(type)}
                                />
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <button className="search-bar__button" onClick={handleSearch}>
                Найти решения
            </button>
        </div>
    );
};