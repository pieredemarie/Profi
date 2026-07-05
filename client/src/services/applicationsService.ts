import { apiClient } from './api';
import { AxiosError } from 'axios';

export interface ApplicationPayload {
    full_name?: string;
    phone_number: string;
    foreign_product_name: string;
    partner_replacement: string;
}

export interface ApplicationValidationError {
    error: {
        code: string;
        message: string;
        fields: Record<string, string>;
    };
}

export const submitApplication = async (payload: ApplicationPayload) => {
    try {
        const response = await apiClient.post('/applications', payload);
        return { success: true as const, data: response.data };
    } catch (err) {
        const error = err as AxiosError<ApplicationValidationError>;
        if (error.response?.status === 422) {
            return { success: false as const, error: error.response.data.error };
        }
        throw err;
    }
};