import React from 'react';
import './BlueBanner.css';
import { CardItem } from './CardItem';
import certImg1 from '../../../assets/certificates.png';
import licenseImg1 from '../../../assets/licence1.png';
import licenseImg2 from '../../../assets/licence2.png';

export const BlueBanner: React.FC = () => {
    return (
        <section className="blue-banner">
            <div className="blue-banner__container">

                <h2 className="blue-banner__title">
                    «УЦ ПРОФИ» — партнер<br />
                    ведущих российских вендоров
                </h2>
                <p className="blue-banner__text">
                    Ваш надежный партнер в сфере кибербезопасности с 2010 года.<br />
                    Комплексная защита информации и аттестация информационных систем
                </p>

                <div className="blue-banner__cards">

                    <CardItem
                        title="Партнёрское ПО"
                        description="Мы работаем напрямую с лидерами российского софта. Статус партнера гарантирует полную техподдержку, своевременные обновления, совместимость и прямую связь с инженерами разработчиков."
                        buttonText="Посмотреть сертификаты"
                        images={certImg1}
                        imageAlt="Сертификаты партнеров"
                        buttonUrl="https://profi-uc.ru/about/certificates/"
                    />


                    <CardItem
                        title="Защита и аттестация"
                        description="Имеем полный набор лицензий ФСБ и ФСТЭК для работ с ГИС и объектами КИИ. Внедряем ПО строго по ФЗ-187, гарантируем защиту данных по ГОСТ и прохождение любых проверок регуляторов."
                        buttonText="Открыть лицензии"
                        images={[licenseImg1, licenseImg2]}
                        imageAlt="Лицензии ФСБ и ФСТЭК"
                        buttonUrl="https://profi-uc.ru/about/licenses/"
                    />
                </div>

            </div>
        </section>
    );
};