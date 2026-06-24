import {SearchBar} from "../../ui/SearchBar/SearchBar.tsx";
import * as React from "react";
import './Search.css'
export const Search: React.FC = () => {
    return (
        <section className="search">
            <div className="search__container">
                <h1 className="search__title">
                    Импортозамещение ПО с гарантией партнёра
                </h1>
                <p className="search__subtitle">
                    Введите название иностранной программы
                </p>
                <div className="search__search-wrapper">
                    <SearchBar/>
                </div>
            </div>
        </section>
    )
}