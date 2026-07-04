import React from 'react';
import './ProductCard.css';

interface ProductCardProps {
    typeLabel: string;
    title: string;
    registryNumber: string;
    replaces: string[];
    onConsultationClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            typeLabel,
                                                            title,
                                                            registryNumber,
                                                            replaces,
                                                            onConsultationClick,
                                                        }) => {
    // Форматируем список, если он длинный
    const replacesText = replaces.join(', ');

    return (
        <div className="product-card">
            {/* Синяя полоска слева */}
            <div className="product-card__left-stripe" />

            <div className="product-card__content">
                {/* Плашка с типом ПО */}
                <div className="product-card__badge">
                    {typeLabel}
                </div>

                {/* Название продукта */}
                <h3 className="product-card__title">{title}</h3>

                {/* Номер в реестре */}
                <p className="product-card__registry">
                    № в реестре СРПО: <b>{registryNumber}</b>
                </p>

                {/* Блок "Заменяет:" */}
                <div className="product-card__replaces-wrapper">
                    <p className="product-card__replaces-label">Заменяет:</p>
                    <p className="product-card__replaces-list">{replacesText}</p>
                </div>

                {/* Кнопка */}
                <button className="product-card__button" onClick={onConsultationClick}>
                    Получить консультацию
                </button>
            </div>
        </div>
    );
};