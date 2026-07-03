import React, { useState } from 'react';
import './ResultsSearchBar.css';

interface ResultsSearchBarProps {
    initialQuery?: string;
    onSearch?: (query: string) => void;
    onTypeChange?: (types: string[]) => void;
}

export const ResultsSearchBar: React.FC<ResultsSearchBarProps> = ({
                                                                      initialQuery = 'Cisco Secure Endpoint',
                                                                      onSearch,
                                                                      onTypeChange
                                                                  }) => {
    const [query, setQuery] = useState(initialQuery);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const softwareTypes = [
        'Антивирусное ПО',
        'Резервное копирование',
        'Офисные приложения',
        'Корпоративные карты'
    ];

    const handleToggle = () => setIsOpen(!isOpen);

    const handleCheckboxChange = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
        if (onTypeChange) onTypeChange(selectedTypes);
    };

    const handleSearch = () => {
        if (onSearch && query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="results-search-bar__wrapper">
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

            <button
                className="results-search-bar__button"
                onClick={handleSearch}
                // disabled убран — кнопка всегда активна
            >
                Найти решения
            </button>
        </div>
    );
};