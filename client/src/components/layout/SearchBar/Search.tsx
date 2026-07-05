import { SearchBar } from "../../ui/SearchBar/SearchBar.tsx";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import './Search.css';

export const Search: React.FC = () => {
    const navigate = useNavigate();

    const popularTags = [
        "Alient Vault", "Jira", "Microsoft Office", "SAP",
        "LogRhythm SIEM Platform", "Cisco Endpoint Secure",
        "VMware", "Cisco IOS Intrusion",
    ];

    const handleTagClick = (tag: string) => {
        const input = document.querySelector('.search-bar__input') as HTMLInputElement;
        if (input) {
            input.value = tag;
        }
    };

    const handleSearch = (searchQuery: string, softwareClasses: string[] = []) => {
        if (!searchQuery.trim() && softwareClasses.length === 0) return;

        navigate('/results', {
            state: {
                query: searchQuery,
                softwareClasses,
            }
        });
    };

    return (
        <section className="search">
            <div className="search__container">
                <h1 className="search__title">
                    Подберите российскую замену зарубежному ПО
                </h1>
                <p className="search__subtitle">
                    Введите название иностранной программы - покажем подходящие решения
                </p>

                <div className="search__search-wrapper">
                    <SearchBar onSearch={handleSearch} />
                </div>

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