import { SearchBar } from "../../ui/SearchBar/SearchBar.tsx";
import * as React from "react";
import './Search.css';

export const Search: React.FC = () => {
    // Моки для тегов (часто ищут)
    const popularTags = [
        "Alient Vault", "Jira", "Microsoft Office", "SAP",
        "LogRhythm SIEM Platform", "Cisco Endpoint Secure",
        "VMware", "Cisco IOS Intrusion", "Check Point Harmony"
    ];

    // Функция, которая срабатывает при клике на тег
    const handleTagClick = (tag: string) => {
        // Находим инпут в DOM и вставляем туда текст (временное решение без useState)
        const input = document.querySelector('.search-bar__input') as HTMLInputElement;
        if (input) {
            input.value = tag;
            // Можно сразу запустить поиск, если нужно
            // input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    return (
        <section className="search">
            <div className="search__container">
                {/* 1. Новый заголовок */}
                <h1 className="search__title">
                    Подберите российскую замену зарубежному ПО
                </h1>
                <p className="search__subtitle">
                    Введите название иностранной программы - покажем подходящие решения
                </p>

                {/* 2. Строка поиска с селектом */}
                <div className="search__search-wrapper">
                    <SearchBar />
                </div>

                {/* 3. Блок "Часто ищут замены для:" */}
                <div className="search__tags-container">
                    <p className="search__tags-title">Часто ищут замены для:</p>
                    <div className="search__tags-list">
                        {popularTags.map((tag) => (
                            <button
                                key={tag}
                                className="search__tag"
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};