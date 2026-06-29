import React from 'react';
import { FooterMap } from './FooterMap';
import './Footer.css';

export const Footer: React.FC = () => {
    const coordinates: [number, number] = [57.001402, 41.007886]; //координаты г. Иваново ул. Уткина, 13

    return (
        <footer className="footer">

            <div className="footer__contacts">
                <div className="footer__container">
                    <h2 className="footer__title">Контактная информация</h2>
                    <div className="footer__info-row">
                        <span className="footer__info-item underlined">profi-uc.ru</span>


                        <span className="footer__info-item">
                            <svg className="footer__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            +7 (4932) 58-68-78
                        </span>


                        <span className="footer__info-item">
                            <svg className="footer__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            г. Иваново, ул. Уткина, 13
                        </span>
                    </div>
                </div>
            </div>


            <div className="footer__map-wrapper">
                <FooterMap
                    center={coordinates}
                    address="г. Иваново, ул. Уткина, 13"
                />
            </div>
        </footer>
    );
};