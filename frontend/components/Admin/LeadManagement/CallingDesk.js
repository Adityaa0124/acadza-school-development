import React, { useState, useMemo } from 'react';
import { PhoneIcon, ClockIcon, ArrowRightIcon, CheckIcon, AlertIcon } from '../icons';
import WhatsAppContactButton from '../WhatsAppContactButton';
import { STAGE_LABELS, getStageBadgeClasses, formatDateTime } from '../constants';

/**
 * Caller Workspace desk.
 * High-velocity queue for admissions counselors to contact parents,
 * record outcomes, reschedule follow-ups, or hand off qualified applicants to CBT.
 */
export default function CallingDesk({
    leads,
    onSaveOutcome,
    onBackToDirectory,
}) {
    const [activeTab, setActiveTab] = useState('due');
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [outcome, setOutcome] = useState('');
    const [note, setNote] = useState('');
    const [callbackDateTime, setCallbackDateTime] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(11, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    });

    const now = new Date().toISOString();

    // Group leads into lifecycle calling buckets
    const buckets = useMemo(() => {
        const callingLeads = leads.filter((l) => ['ENQUIRY', 'INTERESTED'].includes(l.stage));
        const due = callingLeads.filter((l) => l.due && l.due <= now);
        const fresh = callingLeads.filter((l) => !l.due);
        const upcoming = callingLeads.filter((l) => l.due && l.due > now);
        return { due, fresh, upcoming };
    }, [leads, now]);

    const currentQueue =
        activeTab === 'due' ? buckets.due : activeTab === 'fresh' ? buckets.fresh : buckets.upcoming;

    const activeLead = useMemo(() => {
        if (selectedLeadId) {
            const found = leads.find((l) => l.id === selectedLeadId);
            if (found) return found;
        }
        return currentQueue[0] || null;
    }, [leads, selectedLeadId, currentQueue]);

    const handleSelectLead = (lead) => {
        setSelectedLeadId(lead.id);
        setOutcome('');
        setNote('');
    };

    const handleSaveOutcome = (e) => {
        e.preventDefault();
        if (!activeLead || !outcome) return;

        let nextStage = activeLead.stage;
        let nextAction = activeLead.nextAction;
        let scheduledDue = null;

        if (outcome === 'Ready for test') {
            nextStage = 'READY_FOR_CBT';
            nextAction = 'Schedule entrance test (CBT)';
            scheduledDue = null;
        } else if (outcome === 'Interested') {
            nextStage = 'INTERESTED';
            nextAction = 'Follow-up on admission kit & courses';
            scheduledDue = callbackDateTime ? new Date(callbackDateTime).toISOString() : null;
        } else if (outcome === 'Call later') {
            nextAction = 'Parent requested callback';
            scheduledDue = callbackDateTime ? new Date(callbackDateTime).toISOString() : null;
        } else if (outcome === 'No answer') {
            nextAction = 'Retry call - parent did not answer';
            scheduledDue = callbackDateTime ? new Date(callbackDateTime).toISOString() : null;
        } else if (outcome === 'School visit requested') {
            nextStage = 'INTERESTED';
            nextAction = 'Campus walk-in scheduled';
            scheduledDue = callbackDateTime ? new Date(callbackDateTime).toISOString() : null;
        } else if (['Not interested', 'Admitted elsewhere', 'Wrong number'].includes(outcome)) {
            nextStage = 'LOST';
            nextAction = `Closed (${outcome})`;
            scheduledDue = null;
        }

        onSaveOutcome(activeLead.id, {
            outcome,
            note: note.trim(),
            nextStage,
            nextAction,
            due: scheduledDue,
        });

        // Reset form inputs and advance to next due lead in queue
        setOutcome('');
        setNote('');
        const remainingQueue = currentQueue.filter((l) => l.id !== activeLead.id);
        if (remainingQueue.length > 0) {
            setSelectedLeadId(remainingQueue[0].id);
        } else {
            setSelectedLeadId('');
        }
    };

    const requiresCallbackPicker = ['Call later', 'Interested', 'No answer', 'School visit requested'].includes(
        outcome
    );

    return (
        <div className="space-y-6">
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <button
                        onClick={onBackToDirectory}
                        className="text-xs font-semibold text-gray hover:text-heading flex items-center gap-1 mb-1 transition-colors"
                    >
                        <span>&larr; Back to Enquiries Directory</span>
                    </button>
                    <h1 className="text-2xl font-extrabold text-heading tracking-tight">
                        Admissions Calling Desk
                    </h1>
                    <p className="text-sm text-gray mt-1">
                        Contact prospective parents, qualify student readiness, and route to entrance evaluation.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold bg-white border border-disabled rounded-lg px-3 py-2 shadow-sm">
                    <ClockIcon className="w-4 h-4 text-amber-600" />
                    <span>Active Queue: {currentQueue.length} records</span>
                </div>
            </div>

            {/* Calling Desk Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Queued Leads Bucket List */}
                <div className="lg:col-span-4 bg-white border border-disabled rounded-2xl shadow-sm overflow-hidden">
                    {/* Bucket Switcher Tabs */}
                    <div className="grid grid-cols-3 border-b border-disabled text-center text-xs font-bold">
                        <button
                            onClick={() => {
                                setActiveTab('due');
                                setSelectedLeadId('');
                            }}
                            className={`py-3 transition-colors ${
                                activeTab === 'due'
                                    ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600'
                                    : 'text-gray hover:text-heading'
                            }`}
                        >
                            Due ({buckets.due.length})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('fresh');
                                setSelectedLeadId('');
                            }}
                            className={`py-3 transition-colors ${
                                activeTab === 'fresh'
                                    ? 'bg-primary-16 text-primary border-b-2 border-primary'
                                    : 'text-gray hover:text-heading'
                            }`}
                        >
                            New ({buckets.fresh.length})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('upcoming');
                                setSelectedLeadId('');
                            }}
                            className={`py-3 transition-colors ${
                                activeTab === 'upcoming'
                                    ? 'bg-disabled/40 text-heading border-b-2 border-gray'
                                    : 'text-gray hover:text-heading'
                            }`}
                        >
                            Upcoming ({buckets.upcoming.length})
                        </button>
                    </div>

                    {/* Queue Leads List */}
                    <div className="divide-y divide-disabled/40 max-h-[600px] overflow-y-auto">
                        {currentQueue.length === 0 ? (
                            <div className="py-12 px-4 text-center">
                                <CheckIcon className="w-8 h-8 mx-auto text-green" />
                                <div className="text-xs font-bold text-heading mt-2">All caught up!</div>
                                <div className="text-[11px] text-gray mt-1">
                                    No records currently waiting in the {activeTab} queue.
                                </div>
                            </div>
                        ) : (
                            currentQueue.map((lead) => {
                                const isSelected = activeLead?.id === lead.id;
                                return (
                                    <div
                                        key={lead.id}
                                        onClick={() => handleSelectLead(lead)}
                                        className={`p-4 cursor-pointer transition-colors ${
                                            isSelected ? 'bg-amber-50/70 border-l-4 border-amber-600' : 'hover:bg-disabled/15'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-heading">{lead.student}</span>
                                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-disabled/40 text-gray">
                                                Grade {lead.grade}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray mt-1">
                                            Parent: <span className="text-heading font-medium">{lead.parent}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-gray mt-2">
                                            <span>{lead.phone}</span>
                                            <span className="text-amber-700 font-medium">
                                                {lead.due ? formatDateTime(lead.due) : 'Awaiting call'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Column: Active Call Console & Outcome Recorder */}
                <div className="lg:col-span-8 bg-white border border-disabled rounded-2xl p-6 shadow-sm">
                    {!activeLead ? (
                        <div className="py-16 text-center text-gray text-xs">
                            Select a lead from the queue on the left to initiate counseling.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Lead Profile Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-5 border-b border-disabled/40 gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-gray">{activeLead.id}</span>
                                        <span
                                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStageBadgeClasses(
                                                activeLead.stage
                                            )}`}
                                        >
                                            {STAGE_LABELS[activeLead.stage] || activeLead.stage}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-black text-heading mt-1">{activeLead.student}</h2>
                                    <div className="text-xs text-gray mt-0.5">
                                        Applying for <span className="font-semibold text-heading">Grade {activeLead.grade}</span> &bull; Academic Year {activeLead.cycle} &bull; Source: {activeLead.source}
                                    </div>
                                </div>

                                {/* Direct Contact Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <WhatsAppContactButton lead={activeLead} />
                                    <a
                                        href={`tel:${activeLead.phone}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary-dark transition-colors shadow-sm"
                                    >
                                        <PhoneIcon className="w-4 h-4" />
                                        <span>Call {activeLead.phone}</span>
                                    </a>
                                </div>
                            </div>

                            {/* Contact Details & Context Strip */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-disabled/15 rounded-xl p-3 text-xs">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-gray">Parent / Guardian</div>
                                    <div className="font-bold text-heading mt-0.5">{activeLead.parent}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-gray">Primary Contact</div>
                                    <div className="font-bold text-heading mt-0.5">{activeLead.phone}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-gray">Alternate Contact</div>
                                    <div className="font-medium text-heading mt-0.5">{activeLead.alternate || '—'}</div>
                                </div>
                            </div>

                            {/* Previous Outcome / Recent Notes */}
                            <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 text-xs">
                                <div className="text-[10px] uppercase font-bold text-amber-800">Previous Note / Outcome</div>
                                <div className="text-heading font-medium mt-1 leading-relaxed">
                                    {activeLead.lastOutcome || 'Fresh intake from clerk counter. No previous call recorded.'}
                                </div>
                            </div>

                            {/* Outcome Form */}
                            <form onSubmit={handleSaveOutcome} className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-heading mb-2">
                                        Select Call Outcome *
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                        {[
                                            { id: 'Interested', label: 'Interested' },
                                            { id: 'Call later', label: 'Call Later' },
                                            { id: 'Ready for test', label: 'Ready for CBT Test' },
                                            { id: 'No answer', label: 'No Answer' },
                                            { id: 'School visit requested', label: 'Campus Visit' },
                                            { id: 'Not interested', label: 'Not Interested' },
                                            { id: 'Admitted elsewhere', label: 'Admitted Elsewhere' },
                                            { id: 'Wrong number', label: 'Wrong Number' },
                                        ].map((opt) => (
                                            <button
                                                type="button"
                                                key={opt.id}
                                                onClick={() => setOutcome(opt.id)}
                                                className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                                                    outcome === opt.id
                                                        ? opt.id === 'Ready for test'
                                                            ? 'bg-primary text-white border-primary shadow-sm'
                                                            : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                                        : 'bg-white border-disabled text-heading hover:bg-disabled/20'
                                                }`}
                                            >
                                                <div className="text-[11px] leading-tight">{opt.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* CBT Routing Explanation Banner when ready for test is picked */}
                                {outcome === 'Ready for test' && (
                                    <div className="p-3 bg-primary-16 border border-primary/20 rounded-xl text-xs text-primary flex items-start gap-2">
                                        <CheckIcon className="w-4 h-4 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="font-bold">Entrance Test Handover:</span> Marking as Ready for Test will advance this applicant to <span className="underline font-bold">READY_FOR_CBT</span> and hand them off to the Examination Evaluation Team.
                                        </div>
                                    </div>
                                )}

                                {/* Follow-up Callback Schedule Picker */}
                                {requiresCallbackPicker && (
                                    <div className="p-3 bg-disabled/20 border border-disabled rounded-xl space-y-1">
                                        <label className="block text-xs font-bold text-heading">
                                            Agreed Callback Date & Time *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={callbackDateTime}
                                            onChange={(e) => setCallbackDateTime(e.target.value)}
                                            className="w-full text-xs border border-disabled rounded-lg px-3 py-2 bg-white text-heading focus:outline-none focus:border-primary"
                                        />
                                        <div className="text-[11px] text-gray">
                                            This lead will be scheduled and queued in Due calls at the appointed time.
                                        </div>
                                    </div>
                                )}

                                {/* Call Summary & Internal Note */}
                                <div>
                                    <label className="block text-xs font-bold text-heading mb-1">
                                        Conversation Notes & Details
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Record key talking points, questions asked by parent, course interest..."
                                        className="w-full text-xs border border-disabled rounded-xl p-3 text-heading focus:outline-none focus:border-primary placeholder-gray"
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={!outcome}
                                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                            outcome
                                                ? 'bg-primary hover:bg-primary-dark text-white cursor-pointer'
                                                : 'bg-disabled text-gray cursor-not-allowed'
                                        }`}
                                    >
                                        <span>Save Outcome & Next Call</span>
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
