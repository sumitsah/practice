export interface FormFieldMetadata {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'checkbox';
    value?: any;
    required?: boolean;
    minLength?: number;
    options?: { label: string; value: any }[]; // Used for dropdown fields
}

export const DYNAMIC_FORM_JSON: FormFieldMetadata[] = [
    {
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        value: '',
        required: true,
        minLength: 3
    },
    {
        key: 'age',
        label: 'User Age',
        type: 'number',
        value: null,
        required: true
    },
    {
        key: 'accountType',
        label: 'Account Subscription Tier',
        type: 'select',
        value: 'basic',
        options: [
            { label: 'Basic Membership', value: 'basic' },
            { label: 'Premium Enterprise', value: 'premium' }
        ],
        required: true
    },
    {
        key: 'termsAccepted',
        label: 'I accept terms and conditions',
        type: 'checkbox',
        value: false,
        required: true
    }
];