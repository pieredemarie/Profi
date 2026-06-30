import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    onSearch?: (query: string) => void;
    onTypeChange?: (types: string[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onTypeChange }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const softwareTypes = [
        'Антивирусное ПО',
        'Резервное копирование',
        'Офисные приложения',
        'Корпоративные карты',
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        if (onSearch) onSearch(query);
    };

    return (
        <div className="search-bar__wrapper" ref={dropdownRef}>

            <div className="search-bar__input-wrapper">
                <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21L16.65 16.65" />
                </svg>
                <input
                    type="text"
                    className="search-bar__input"
                    placeholder="Например: FortiGate IPS"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
            </div>

            {/* Дропдаун теперь не position: absolute, он в потоке */}
            <div className="search-bar__dropdown-wrapper">
                <button
                    className={`search-bar__dropdown-trigger ${isOpen ? 'open' : ''}`}
                    onClick={handleToggle}
                >
                    <span className="search-bar__dropdown-label">Тип ПО</span>
                    <div className={`search-bar__arrow ${isOpen ? 'up' : 'down'}`} />
                </button>

                <div className={`search-bar__dropdown-menu ${isOpen ? 'open' : ''}`}>
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
            </div>

            <button className="search-bar__button" onClick={handleSearch}>
                Найти решения
            </button>
        </div>
    );
};