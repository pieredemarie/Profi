import * as React from "react";
import './SearchBar.css'
export const SearchBar: React.FC = () => {
    return (
        <div className="search-bar__wrapper">
            <div className="search-bar__input-wrapper">
                <svg
                className="search-bar__icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b0b0b0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <circle cx="11" cy="11" r="8" />
                    <path d="M21 21L16.65 16.65"/>
                </svg>

                <input
                type="text"
                className="search-bar__input"
                placeholder="Alient Vault"
                />
            </div>

            <button className="search-bar__button">
                Найти решения
            </button>
        </div>
    );
};