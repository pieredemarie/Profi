import React from 'react';
import './ProductCard.css';

interface ProductCardProps {
    typeLabel: string;
    title: string;
    registryNumber: string;
    replaces: string[];
    onConsultationClick?: () => void;
}

const MAX_REPLACES_SHOWN = 4;

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            typeLabel,
                                                            title,
                                                            registryNumber,
                                                            replaces,
                                                            onConsultationClick,
                                                        }) => {
    const visibleReplaces = replaces.slice(0, MAX_REPLACES_SHOWN);
    const hiddenCount = replaces.length - visibleReplaces.length;

    const replacesText = hiddenCount > 0
        ? `${visibleReplaces.join(', ')}...`
        : visibleReplaces.join(', ');

    return (
        <div className="product-card">
            <div className="product-card__left-stripe" />

            <div className="product-card__content">
                <div className="product-card__badge">
                    {typeLabel}
                </div>

                <h3 className="product-card__title">{title}</h3>

                <p className="product-card__registry">
                    № в реестре СРПО: <b>{registryNumber}</b>
                </p>

                <div className="product-card__replaces-wrapper">
                    <p className="product-card__replaces-label">Заменяет:</p>
                    <p className="product-card__replaces-list">{replacesText}</p>
                </div>

                <button className="product-card__button" onClick={onConsultationClick}>
                    Получить консультацию
                </button>
            </div>
        </div>
    );
};