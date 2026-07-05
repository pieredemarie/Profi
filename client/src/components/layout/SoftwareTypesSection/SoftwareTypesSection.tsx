import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SoftwareTypesSection.css';

export const SoftwareTypesSection: React.FC = () => {
    const navigate = useNavigate();

    const types = [
        'Антивирусное ПО',
        'Корпоративные карты',
        'СУБД и средства работы с данными',
        'Средства криптозащиты сетей',
        'IDM системы'
    ];

    const handleTypeClick = (type: string) => {
        navigate('/results', {
            state: {
                query: '',
                softwareClasses: [type],
            }
        });
    };

    return (
        <section className="software-types-section">
            <div className="software-types-section__container">
                <h2 className="software-types-section__title">
                    Не знаете конкретного названия ПО?
                </h2>
                <p className="software-types-section__subtitle">
                    Выберите нужный тип программного обеспечения
                </p>

                <div className="software-types-section__grid">
                    {types.map((type) => (
                        <button
                            key={type}
                            className="software-types-section__btn"
                            onClick={() => handleTypeClick(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};