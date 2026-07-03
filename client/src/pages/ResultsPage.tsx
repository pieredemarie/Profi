import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard/ProductCard';
import { ConsultationForm } from '../components/ui/ConsultationForm/ConsultationForm';
import { ResultsSearchBar } from '../components/ui/ResultsSearchBar/ResultsSearchBar';
import { Header } from '../components/layout/Header/Header';
import { Footer } from '../components/layout/Footer/Footer';
import './ResultsPage.css';

interface Product {
    typeLabel: string;
    title: string;
    registryNumber: string;
    replaces: string[];
}

export const ResultsPage = () => {
    const location = useLocation();
    const [query, setQuery] = useState(location.state?.query || 'Cisco Secure Endpoint');

    // Начальные данные (из перехода или заглушка)
    const [products, setProducts] = useState<Product[]>(location.state?.products || [
        {
            typeLabel: "Антивирусное ПО",
            title: "Dr.Web Desktop Security Suite",
            registryNumber: "47",
            replaces: ["Bitdefender Gravityzone", "Check Point Harmony", "Cisco Secure Endpoint"]
        },
        {
            typeLabel: "Антивирусное ПО",
            title: "Dr.Web Server Security Suite",
            registryNumber: "46",
            replaces: ["Bitdefender Gravityzone", "Cisco Secure Endpoint", "Trend Micro"]
        },
        {
            typeLabel: "Средства мониторинга сетевого трафика и событий",
            title: "ViPNet IDS HS",
            registryNumber: "3441",
            replaces: ["Trend Micro Apex One", "AlienVault", "Cisco Secure Endpoint"]
        },
        {
            typeLabel: "Средства криптозащиты информации",
            title: "Kaspersky Endpoint Security для бизнеса – Расширенный",
            registryNumber: "207",
            replaces: ["Bitdefender Gravityzone", "Cisco Secure Endpoint", "CrowdStrike Falcon"]
        }
    ]);

    const [classes, setClasses] = useState<string[]>(location.state?.softwareClasses || [
        "Антивирусное ПО",
        "Средства мониторинга сетевого трафика и событий",
        "Средства криптозащиты информации"
    ]);

    // 🔥 Функция поиска: запрос на бэк + обновление состояния
    const handleSearch = async (newQuery: string) => {
        if (!newQuery.trim()) return;

        setQuery(newQuery);

        // Имитация запроса к бэкенду (замените на реальный fetch)
        console.log(`[MOCK] Запрос на бэк: ${newQuery}`);

        // ВРЕМЕННО: эмулируем ответ с новыми данными
        const mockResponse = [
            {
                typeLabel: "Средства мониторинга сетевого трафика и событий",
                title: `Результат для: ${newQuery}`,
                registryNumber: "999",
                replaces: ["Mock System 1", "Mock System 2"]
            },
            {
                typeLabel: "Антивирусное ПО",
                title: "Dr.Web New Version",
                registryNumber: "101",
                replaces: ["Bitdefender", "Cisco"]
            }
        ];

        // Симуляция задержки сети
        setTimeout(() => {
            setProducts(mockResponse as Product[]);
            setClasses(["Средства мониторинга сетевого трафика и событий", "Антивирусное ПО"]);
        }, 500);
    };

    const groupedProducts = classes.map((cls) => ({
        className: cls,
        items: products.filter(p => p.typeLabel === cls)
    }));

    return (
        <div className="results-page">
            <Header showShadow={false} showHomeButton={true}/>

            <div className="results-page__blue-header">
                <div className="results-page__blue-container">
                    <h1 className="results-page__main-title">
                        Результаты поиска решений для:<br />
                        <span className="results-page__main-title--underline">{query}</span>
                    </h1>


                    <div className="results-page__search-wrapper">
                        <ResultsSearchBar
                            initialQuery={query}
                            onSearch={handleSearch} // Теперь при нажатии кнопки вызывается эта функция
                            onTypeChange={(types) => console.log('Выбраны типы:', types)}
                        />
                    </div>
                </div>
            </div>

            <div className="results-page__main">
                {groupedProducts.map((group) => (
                    group.items.length > 0 && (
                        <div key={group.className} className="results-page__group">
                            <h2 className="results-page__group-title">{group.className}</h2>
                            <div className="results-page__grid">
                                {group.items.map((product, index) => (
                                    <ProductCard
                                        key={index}
                                        typeLabel={product.typeLabel}
                                        title={product.title}
                                        registryNumber={product.registryNumber}
                                        replaces={product.replaces}
                                        onConsultationClick={() => {
                                            const form = document.getElementById('consultation-form');
                                            if (form) form.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                ))}

                <div className="results-page__form-wrapper" id="consultation-form">
                    <ConsultationForm />
                </div>
            </div>

            <Footer />
        </div>
    );
};