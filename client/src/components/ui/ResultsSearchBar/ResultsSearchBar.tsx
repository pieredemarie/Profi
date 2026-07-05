import React, { useState, useRef, useEffect } from 'react';
import './ResultsSearchBar.css';
import { fetchSoftwareClasses } from '../../../services/softwareClassesService';

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
    const [query, setQuery] = useState(initialQuery);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [softwareTypes, setSoftwareTypes] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(initialQuery);
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
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleCheckboxChange = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleSearch = () => {
        if (query.trim() || selectedTypes.length > 0) {
            onSearch?.(query, selectedTypes);
        }
    };

    return (
        <div className="results-search-bar__wrapper" ref={wrapperRef}>
            <div className="results-search-bar__input-wrapper">
                <input
                    type="text"
                    className="results-search-bar__input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Введите название ПО..."
                />
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