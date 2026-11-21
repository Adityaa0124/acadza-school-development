import React from 'react';
import { WhatsAppIcon } from './icons';

/**
 * Normalizes phone numbers to standard international format (defaults to India 91).
 * Extracts raw digits and prepends country code for standard 10-digit mobile numbers.
 */
function toWhatsAppPhone(value) {
    if (!value) return '';
    const digits = String(value).replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
}

/**
 * Encapsulated WhatsApp interaction button with prefilled personalized message draft.
 * Links directly to the WhatsApp Web / mobile app scheme without intermediary redirects.
 */
export default function WhatsAppContactButton({
    lead,
    callerName = 'Admissions Officer',
    schoolName = 'Acadza Schools',
    onLogged,
    className = '',
}) {
    if (!lead || !lead.phone) return null;

    const normalizedPhone = toWhatsAppPhone(lead.phone);
    const parentName = lead.parent || 'Parent';
    const studentName = lead.student || 'your child';
    const grade = lead.grade || '';

    const draftMessage = `Hello ${parentName}, I am ${callerName} from ${schoolName}. I am contacting you regarding ${studentName}'s admission inquiry for Grade ${grade}. Is this a convenient time to chat?`;
    const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(draftMessage)}`;

    const handleClick = () => {
        if (typeof onLogged === 'function') {
            onLogged(lead.id, draftMessage);
        }
    };

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors shadow-sm ${className}`}
            title={`Send WhatsApp message to ${lead.phone}`}
        >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
            <span>WhatsApp</span>
        </a>
    );
}
