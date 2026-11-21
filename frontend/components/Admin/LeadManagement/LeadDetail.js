import React, { useState } from 'react';
import { PhoneIcon, CopyIcon, ClockIcon, CheckIcon, UserIcon } from '../icons';
import WhatsAppContactButton from '../WhatsAppContactButton';
import { STAGE_LABELS, getStageBadgeClasses, formatDateTime } from '../constants';

/**
 * Detailed Dossier View for a single admission candidate.
 * Displays contact actions, stage transitions, and chronological interaction timeline.
 */
export default function LeadDetail({
    lead,
    onBack,
    onStageChange,
    onAddNote,
}) {
    const [noteText, setNoteText] = useState('');
    const [copied, setCopied] = useState(false);

    if (!lead) {
        return (
            <div className="bg-white border border-disabled rounded-2xl p-12 text-center">
                <div className="text-sm font-bold text-heading">Enquiry Record Not Found</div>
                <button
                    onClick={onBack}
                    className="mt-3 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg"
                >
                    Return to Enquiries
                </button>
            </div>
        );
    }

    const handleCopyPhone = () => {
        if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(lead.phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleNoteSubmit = (e) => {
        e.preventDefault();
        if (!noteText.trim()) return;
        onAddNote(lead.id, noteText.trim());
        setNoteText('');
    };

    // Determine current responsible team based on lifecycle stage
    const assignedTeam = ['ENQUIRY', 'INTERESTED'].includes(lead.stage)
        ? 'Admissions Calling Desk'
        : ['READY_FOR_CBT', 'CBT_SCHEDULED', 'CBT_COMPLETED'].includes(lead.stage)
        ? 'Entrance Test (CBT) Team'
        : lead.stage === 'ADMISSION_IN_PROGRESS'
        ? 'Enrollment & Fees Office'
        : 'Completed Archive';

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <button
                        onClick={onBack}
                        className="text-xs font-semibold text-gray hover:text-heading flex items-center gap-1 mb-1 transition-colors"
                    >
                        <span>&larr; Back to Enquiries</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-heading tracking-tight">{lead.student}</h1>
                        <span
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStageBadgeClasses(
                                lead.stage
                            )}`}
                        >
                            {STAGE_LABELS[lead.stage] || lead.stage}
                        </span>
                    </div>
                    <div className="text-xs text-gray mt-1">
                        Application ID: <span className="font-mono font-medium">{lead.id}</span> &bull; Applying for{' '}
                        <span className="font-semibold text-heading">Grade {lead.grade}</span> &bull; Cycle {lead.cycle}
                    </div>
                </div>

                {/* Manual Stage Adjustment Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray">Update Stage:</span>
                    <select
                        value={lead.stage}
                        onChange={(e) => onStageChange(lead.id, e.target.value)}
                        className="text-xs border border-disabled rounded-lg px-3 py-1.5 bg-white text-heading font-medium focus:outline-none focus:border-primary shadow-sm"
                    >
                        {Object.entries(STAGE_LABELS).map(([k, label]) => (
                            <option key={k} value={k}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Parent Contact Strip */}
            <div className="bg-white border border-disabled rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-primary-16 text-primary flex items-center justify-center font-bold">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-gray">Parent / Guardian</div>
                        <div className="text-base font-bold text-heading">{lead.parent}</div>
                        <div className="text-xs text-gray flex items-center gap-2 mt-0.5">
                            <span>{lead.phone}</span>
                            {lead.alternate && <span>(Alt: {lead.alternate})</span>}
                        </div>
                    </div>
                </div>

                {/* Direct Action Hub */}
                <div className="flex items-center gap-2">
                    <WhatsAppContactButton lead={lead} />
                    <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <PhoneIcon className="w-4 h-4" />
                        <span>Call Parent</span>
                    </a>
                    <button
                        onClick={handleCopyPhone}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-disabled bg-disabled/20 hover:bg-disabled/50 text-heading text-xs font-semibold rounded-md transition-colors"
                        title="Copy telephone number"
                    >
                        <CopyIcon className="w-4 h-4" />
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                </div>
            </div>

            {/* Application Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm text-xs">
                    <div className="text-[10px] uppercase font-bold text-gray">Source Channel</div>
                    <div className="text-sm font-bold text-heading mt-1">{lead.source}</div>
                    <div className="text-gray text-[11px] mt-0.5">Recorded {formatDateTime(lead.created)}</div>
                </div>
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm text-xs">
                    <div className="text-[10px] uppercase font-bold text-gray">Responsible Team</div>
                    <div className="text-sm font-bold text-primary mt-1">{assignedTeam}</div>
                    <div className="text-gray text-[11px] mt-0.5">Active pipeline ownership</div>
                </div>
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm text-xs">
                    <div className="text-[10px] uppercase font-bold text-gray">Next Action / Due</div>
                    <div className="text-sm font-bold text-heading mt-1">{lead.nextAction || 'None scheduled'}</div>
                    <div className="text-amber-700 text-[11px] mt-0.5 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{formatDateTime(lead.due)}</span>
                    </div>
                </div>
            </div>

            {/* Conversation Timeline & Internal Notes */}
            <div className="bg-white border border-disabled rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                    <h2 className="text-base font-bold text-heading">Conversation & Activity Timeline</h2>
                    <p className="text-xs text-gray mt-0.5">
                        Log of clerk intakes, phone consultations, WhatsApp drafts, and stage handovers.
                    </p>
                </div>

                {/* Add Internal Note */}
                <form onSubmit={handleNoteSubmit} className="space-y-3">
                    <textarea
                        rows="2"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add internal counsel note or follow-up report..."
                        className="w-full text-xs border border-disabled rounded-xl p-3 text-heading focus:outline-none focus:border-primary placeholder-gray"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!noteText.trim()}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                                noteText.trim()
                                    ? 'bg-primary text-white hover:bg-primary-dark cursor-pointer'
                                    : 'bg-disabled text-gray cursor-not-allowed'
                            }`}
                        >
                            Save Note
                        </button>
                    </div>
                </form>

                {/* Timeline Items */}
                <div className="border-l-2 border-disabled/60 ml-3 space-y-6 pl-4 pt-2">
                    {lead.history && lead.history.length > 0 ? (
                        [...lead.history].reverse().map((item) => (
                            <div key={item.id} className="relative text-xs">
                                <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-white" />
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-heading">{item.actor}</span>
                                    <span className="text-gray text-[11px]">{formatDateTime(item.at)}</span>
                                </div>
                                <div className="text-heading font-medium mt-1 leading-relaxed bg-disabled/15 rounded-lg p-2.5">
                                    {item.text}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray py-4">No logged history recorded yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
