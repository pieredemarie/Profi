export interface ReplacementCatalogItem {
    id: number;
    foreign_product_name: string;
    domestic_product_name: string;
    registry_number: number | null;
    software_class: string | null;
}

export interface PartnerReplacementItem {
    id: number;
    partner_organisation_name: string;
    partner_product_name: string;
    registry_number: number | null;
}

export interface ReplacementItem {
    id: number;
    partner_organisation_name: string;
    partner_product_name: string;
    registry_number: number | null;
}

export interface ApplicationRequest {
    full_name?: string;
    phone_number: string;
    foreign_product_name: string;

    partner_replacement_list: PartnerReplacementItem[];
}

export interface ApllicationResponse {
    success: boolean;
    message: string;
}

