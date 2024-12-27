import { Contact } from "@/types/Contact";

export function validateContact(contact: Contact, isPartial: boolean = false): string | null {
    if (!isPartial) {
        if (!contact.name) return 'Name is required';
        if (!contact.phone) return 'Phone number is required';
        if (contact.relationship) {
            switch (contact.relationship.toLowerCase()) {
                case 'family':
                case 'friend':
                case 'coworker':
                case 'other':
                    break;
                default:
                    return 'Invalid relationship';
            }
        }
    }

    if (contact.phone && !/^\d{10}$/.test(contact.phone.toString())) return 'Phone number must be 10 digits';

    return null;
}