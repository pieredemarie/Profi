import React, { useState } from 'react';
import './ConsultationForm.css';
import { SuccessModal } from '../SuccessModal/SuccessModal.tsx';
import { submitApplication } from '../../../services/applicationsService';

interface ConsultationFormProps {
    foreignProductName: string;
    partnerReplacement: string;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ foreignProductName, partnerReplacement }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length === 0) return '';
        let formatted = '+7';
        if (cleaned.length > 1) formatted += ' (' + cleaned.substring(1, 4);
        if (cleaned.length >= 4) formatted += ') ' + cleaned.substring(4, 7);
        if (cleaned.length >= 7) formatted += '-' + cleaned.substring(7, 9);
        if (cleaned.length >= 9) formatted += '-' + cleaned.substring(9, 11);
        return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '');
        if (digits.length <= 11) {
            setPhone(formatPhone(digits));
            if (phoneError) setPhoneError(null);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (nameError) setNameError(null);
    };

    const validatePhone = (value: string): boolean => value.replace(/\D/g, '').length === 11;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let hasError = false;

        if (name.trim() === '') {
            setNameError('Заполните поле ФИО корректно');
            hasError = true;
        }
        if (!validatePhone(phone)) {
            setPhoneError('Заполните поле с номером телефона корректно');
            hasError = true;
        }
        if (hasError) return;

        setIsSubmitting(true);
        const result = await submitApplication({
            full_name: name.trim(),
            phone_number: phone,
            foreign_product_name: foreignProductName,
            partner_replacement: partnerReplacement,
        });
        setIsSubmitting(false);

        if (!result.success) {
            setPhoneError(result.error.message);
            return;
        }

        setIsSuccess(true);
        setName('');
        setPhone('');
        setPhoneError(null);
        setNameError(null);
    };

    return (
        <>
            <div className="consultation-form-wrapper" id="consultation-form">
                <div className="consultation-form">
                    <h2 className="consultation-form__title">Получить консультацию</h2>
                    <p className="consultation-form__subtitle">Заполните поля заявки</p>

                    <form className="consultation-form__form" onSubmit={handleSubmit}>
                        <input type="hidden" name="foreign_product_name" value={foreignProductName} />

                        <div className="consultation-form__row">
                            <div className="consultation-form__field">
                                <input
                                    type="text"
                                    className={`consultation-form__input ${nameError ? 'consultation-form__input--error' : ''}`}
                                    placeholder="ФИО"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                                <div className="consultation-form__error-slot">
                                    {nameError && <span className="consultation-form__error">{nameError}</span>}
                                </div>
                            </div>

                            <div className="consultation-form__field">
                                <input
                                    type="tel"
                                    className={`consultation-form__input ${phoneError ? 'consultation-form__input--error' : ''}`}
                                    placeholder="Номер телефона"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    maxLength={18}
                                />
                                <div className="consultation-form__error-slot">
                                    {phoneError && <span className="consultation-form__error">{phoneError}</span>}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="consultation-form__button" disabled={isSubmitting}>
                            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                        </button>
                    </form>
                </div>
            </div>
            <SuccessModal isOpen={isSuccess} onClose={() => setIsSuccess(false)} />
        </>
    );
};