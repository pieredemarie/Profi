import React from 'react';
import './SuccessModal.css';
import { Link } from "react-router-dom";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {

    return (
        <div
            className={`success-modal__overlay ${isOpen ? 'success-modal--open' : ''}`}
            onClick={onClose}
        >
            <div className="success-modal__content" onClick={(e) => e.stopPropagation()}>


                <button className="success-modal__close" onClick={onClose} aria-label="Закрыть">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M29 3L3 29M3 3L29 29"
                            stroke="#606060"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <div className="success-modal__icon-wrapper">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M59.5 7C73.4239 7 86.7774 12.5312 96.6231 22.3769C106.469 32.2226 112 45.5761 112 59.5C112 73.4239 106.469 86.7774 96.6231 96.6231C86.7774 106.469 73.4239 112 59.5 112C45.5761 112 32.2226 106.469 22.3769 96.6231C12.5312 86.7774 7 73.4239 7 59.5C7 45.5761 12.5312 32.2226 22.3769 22.3769C32.2226 12.5312 45.5761 7 59.5 7ZM52.9609 69.8594L41.3008 58.1875C40.457 57.3421 39.3119 56.8666 38.1174 56.8655C36.923 56.8644 35.777 57.3378 34.9316 58.1816C34.0863 59.0255 33.6107 60.1706 33.6096 61.365C33.6085 62.5594 34.082 63.7054 34.9258 64.5508L49.7852 79.4219C50.2022 79.841 50.698 80.1737 51.244 80.4006C51.79 80.6276 52.3755 80.7444 52.9668 80.7444C53.5581 80.7444 54.1436 80.6276 54.6896 80.4006C55.2356 80.1737 55.7314 79.841 56.1484 79.4219L86.8984 48.6602C87.3263 48.2446 87.6673 47.7481 87.9016 47.1996C88.1359 46.651 88.2588 46.0614 88.2632 45.4649C88.2675 44.8684 88.1533 44.277 87.927 43.7251C87.7008 43.1732 87.3671 42.6718 86.9453 42.25C86.5235 41.8283 86.0221 41.4945 85.4702 41.2683C84.9183 41.042 84.3269 40.9278 83.7304 40.9321C83.1339 40.9365 82.5443 41.0594 81.9958 41.2937C81.4472 41.528 80.9507 41.869 80.5352 42.2969L52.9609 69.8594Z" fill="#3498DB"/>
                    </svg>
                </div>

                <h2 className="success-modal__title">Заявка отправлена!</h2>
                <p className="success-modal__subtitle">
                    В ближайшее время с вами свяжется наш<br />
                    менеджер по телефону
                </p>

                <Link to="/" className="success-modal__button" onClick={onClose}>
                    На главную
                </Link>
            </div>
        </div>
    );
};