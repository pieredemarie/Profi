import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import { useAutocomplete } from '../../../hooks/useAutocomplete';

interface SearchBarProps {
    onSearch?: (query: string) => void;
    onTypeChange?: (types: string[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onTypeChange }) => {
    const { query, suggestions, handleQueryChange } = useAutocomplete(300);

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const softwareTypes = [
        'Антивирусное ПО',
        'Резервное копирование',
        'Офисные приложения',
        'Корпоративные карты'
    ];

    // Закрытие дропдауна при клике вне
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

    // Обработчик клика по подсказке
    const handleSuggestionClick = (value: string) => {
        handleQueryChange(value);
        setIsOpen(false);
        if (onSearch) onSearch(value);
    };

    return (
        <div className="search-bar__wrapper" ref={dropdownRef}>

            {/* 1. Инпут с автодополнением (ЕДИНЫЙ БЛОК) */}
            <div className="search-bar__input-wrapper">
                <div className="search-bar__dropdown-group">

                    {/* Верхняя часть: Инпут с лупой */}
                    <div className="search-bar__input-container">
                        <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21L16.65 16.65" />
                        </svg>
                        <input
                            type="text"
                            className="search-bar__input"
                            placeholder="Например: FortiGate IPS"
                            value={query}
                            onChange={(e) => handleQueryChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    {/* Нижняя часть: Список подсказок */}
                    {suggestions.length > 0 && (
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

            {/* 2. Кастомный Dropdown с чекбоксами */}
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
                    <div className="search-bar__dropdown-menu">
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

            {/* 3. Кнопка поиска */}
            <button className="search-bar__button" onClick={handleSearch}>
                Найти решения
            </button>
        </div>
    );
};