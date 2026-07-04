import React from 'react';
import './SoftwareTypesSection.css';


const sendTypeRequest = async (typeName: string) => {
    console.log(`Отправляю запрос на сервер для типа: "${typeName}"`);
    // тут далее будет fetch

};

export const SoftwareTypesSection: React.FC = () => {
    const types = [
        'Антивирусное ПО',
        'Корпоративные карты',
        'СУБД и средства работы с данными',
        'Средства криптозащиты сетей',
        'IDM системы'
    ];

    const handleTypeClick = async (type: string) => {
        // Вызываем заглушку
        await sendTypeRequest(type);
        // В будущем здесь можно будет добавить toast-уведомление или редирект
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