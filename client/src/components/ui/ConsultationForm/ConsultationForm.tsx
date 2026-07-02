import React, { useState } from 'react';
import './ConsultationForm.css';
import {SuccessModal} from "../SuccessModal/SuccessModal.tsx";

interface ConsultationFormProps {
    onSend?: (data: { name: string; phone: string }) => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ onSend }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [isSuccess,setIsSuccess] = useState(false);

    // Форматирование номера: +7 (XXX) XXX-XX-XX
    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length === 0) return '';

        let formatted = '+7';
        if (cleaned.length > 1) {
            formatted += ' (' + cleaned.substring(1, 4);
        }
        if (cleaned.length >= 4) {
            formatted += ') ' + cleaned.substring(4, 7);
        }
        if (cleaned.length >= 7) {
            formatted += '-' + cleaned.substring(7, 9);
        }
        if (cleaned.length >= 9) {
            formatted += '-' + cleaned.substring(9, 11);
        }
        return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const digits = raw.replace(/\D/g, '');
        if (digits.length <= 11) {
            setPhone(formatPhone(digits));
            if (phoneError) setPhoneError(false);
        }
    };

    const validatePhone = (value: string): boolean => {
        const digits = value.replace(/\D/g, '');
        return digits.length === 11; // 7 + 10 цифр
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePhone(phone)) {
            setPhoneError(true);
            return;
        }

        if (onSend) {
            onSend({ name, phone });
        }
        setIsSuccess(true);
        setName('');
        setPhone('');
        setPhoneError(false);
    };

    return (
        <>
        <div className="consultation-form-wrapper" id="consultation-form">
            <div className="consultation-form">
                <h2 className="consultation-form__title">Получить консультацию</h2>
                <p className="consultation-form__subtitle">Заполните поля заявки</p>

                <form className="consultation-form__form" onSubmit={handleSubmit}>
                    <div className="consultation-form__row">
                        <input
                            type="text"
                            className="consultation-form__input"
                            placeholder="ФИО"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="tel"
                            className={`consultation-form__input ${phoneError ? 'consultation-form__input--error' : ''}`}
                            placeholder="Номер телефона"
                            value={phone}
                            onChange={handlePhoneChange}
                            maxLength={18}
                        />
                    </div>

                    {phoneError && (
                        <div className="consultation-form__error">
                            Заполните поле с номером телефона
                        </div>
                    )}

                    <button type="submit" className="consultation-form__button">
                        Отправить заявку
                    </button>
                </form>
            </div>
        </div>
            <SuccessModal
                isOpen={isSuccess}
                onClose={() => setIsSuccess(false)}
            />
        </>

    );
};