import React, { useState, useMemo } from 'react';
import { TestDocIcon, ClockIcon, CheckIcon, AlertIcon, ArrowRightIcon, PhoneIcon } from '../icons';
import WhatsAppContactButton from '../WhatsAppContactButton';
import { STAGE_LABELS, getStageBadgeClasses, formatDateTime } from '../constants';

/**
 * CBT Conduct Desk Workspace.
 * Enables the examination and test conductivity team to:
 * 1. Select prospective students routed for entrance evaluation.
 * 2. Schedule and reschedule test dates, slots, and lab centers.
 * 3. Manage real-time candidate attendance (Present / Absent / Rescheduled).
 * 4. Log conduct remarks and transition candidates toward test completion.
 */
export default function CBTConductDesk({
    leads,
    onSaveCBTAction,
    onBackToDirectory,
}) {
    const [activeTab, setActiveTab] = useState('ready'); // 'ready' | 'scheduled' | 'completed'
    const [selectedLeadId, setSelectedLeadId] = useState('');

    // Schedule form state
    const [testDateTime, setTestDateTime] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    });
    const [testCenter, setTestCenter] = useState('Campus Computer Lab A (Ground Floor)');
    const [testSubject, setTestSubject] = useState('JEE Foundation (Physics, Chemistry, Maths)');
    const [invigilator, setInvigilator] = useState('Prof. S. R. Verma');

    // Attendance form state
    const [attendanceStatus, setAttendanceStatus] = useState('Present');
    const [conductNote, setConductNote] = useState('');
    const [markCompleteOnPresent, setMarkCompleteOnPresent] = useState(false);

    // Group leads into CBT lifecycle buckets
    const buckets = useMemo(() => {
        const ready = leads.filter((l) => l.stage === 'READY_FOR_CBT');
        const scheduled = leads.filter((l) => l.stage === 'CBT_SCHEDULED');
        const completed = leads.filter((l) => ['CBT_COMPLETED', 'ADMISSION_IN_PROGRESS', 'CONVERTED'].includes(l.stage));
        return { ready, scheduled, completed };
    }, [leads]);

    const currentQueue =
        activeTab === 'ready' ? buckets.ready : activeTab === 'scheduled' ? buckets.scheduled : buckets.completed;

    // Determine currently active candidate
    const activeLead = useMemo(() => {
        if (selectedLeadId) {
            const found = leads.find((l) => l.id === selectedLeadId);
            if (found) return found;
        }
        return currentQueue[0] || null;
    }, [leads, selectedLeadId, currentQueue]);

    const handleSelectLead = (lead) => {
        setSelectedLeadId(lead.id);
        setConductNote('');
        setAttendanceStatus('Present');
        setMarkCompleteOnPresent(false);
    };

    // Handler: Schedule or Reschedule the entrance test
    const handleScheduleTest = (e) => {
        e.preventDefault();
        if (!activeLead) return;

        const scheduledDateISO = new Date(testDateTime).toISOString();
        const formattedDate = formatDateTime(scheduledDateISO);
        const actionLabel = `Attend CBT Test (${formattedDate}) at ${testCenter}`;

        onSaveCBTAction(activeLead.id, {
            nextStage: 'CBT_SCHEDULED',
            nextAction: actionLabel,
            due: scheduledDateISO,
            outcome: `CBT Scheduled for ${formattedDate} (${testCenter})`,
            note: `Scheduled by CBT Conductivity Team. Subject: ${testSubject}. Invigilator: ${invigilator}.`,
            isScheduleAction: true,
        });

        setConductNote('');
        // Switch tab to scheduled so staff sees candidate in the scheduled queue
        setActiveTab('scheduled');
        setSelectedLeadId(activeLead.id);
    };

    // Handler: Manage candidate attendance & test conduct
    const handleSaveAttendance = (e) => {
        e.preventDefault();
        if (!activeLead) return;

        let nextStage = activeLead.stage;
        let nextAction = activeLead.nextAction;
        let scheduledDue = activeLead.due;

        if (attendanceStatus === 'Present') {
            if (markCompleteOnPresent) {
                nextStage = 'CBT_COMPLETED';
                nextAction = 'Evaluate CBT Scores & Prepare Rank';
            } else {
                nextAction = 'CBT In Progress - Candidate Present';
            }
        } else if (attendanceStatus === 'Absent') {
            nextAction = 'Candidate Absent - Follow up for Reschedule';
        } else if (attendanceStatus === 'Rescheduled') {
            nextStage = 'READY_FOR_CBT';
            nextAction = 'Reschedule CBT Test Date';
            scheduledDue = null;
        }

        onSaveCBTAction(activeLead.id, {
            nextStage,
            nextAction,
            due: scheduledDue,
            outcome: `CBT Attendance: ${attendanceStatus}`,
            note: conductNote.trim()
                ? `Attendance: ${attendanceStatus}. Remarks: ${conductNote.trim()}`
                : `Attendance marked as ${attendanceStatus} by CBT Conduct Team.`,
            isAttendanceAction: true,
        });

        setConductNote('');
    };

    return (
        <div className="space-y-6">
            {/* Header with Navigation & Quick Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <button
                        onClick={onBackToDirectory}
                        className="text-xs font-semibold text-gray hover:text-heading flex items-center gap-1 mb-1 transition-colors group cursor-pointer"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span>
                        <span>Back to Enquiries Directory</span>
                    </button>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                            <TestDocIcon className="w-4 h-4" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-heading tracking-tight">
                            CBT Conduct & Evaluation Desk
                        </h1>
                    </div>
                    <p className="text-sm text-gray mt-1">
                        Schedule entrance tests, manage candidate attendance, and reschedule evaluations for prospective students.
                    </p>
                </div>

                {/* Team Status Indicators */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold bg-white border border-disabled rounded-lg px-3.5 py-2 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        <span>CBT Pipeline: {buckets.ready.length + buckets.scheduled.length} Active Candidates</span>
                    </div>
                </div>
            </div>

            {/* Main CBT Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Candidate Queue Selector */}
                <div className="lg:col-span-4 bg-white border border-disabled rounded-2xl shadow-sm overflow-hidden">
                    {/* Queue Tabs */}
                    <div className="grid grid-cols-3 border-b border-disabled text-center text-xs font-bold">
                        <button
                            onClick={() => {
                                setActiveTab('ready');
                                setSelectedLeadId('');
                            }}
                            className={`py-3 transition-colors ${
                                activeTab === 'ready'
                                    ? 'bg-amber-50 text-amber-800 border-b-2 border-amber-600'
                                    : 'text-gray hover:text-heading'
                            }`}
                        >
                            Awaiting ({buckets.ready.length})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('scheduled');
                                setSelectedLeadId('');
                            }}
                            className={`py-3 transition-colors ${
                                activeTab === 'scheduled'
                                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                                    : 'text-gray hover:text-heading'
                            }`}
                        >
                            Scheduled ({buckets.scheduled.length})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('completed');
                                setSelectedLeadId('');
                            }}
                            className={`py-3 transition-colors ${
                                activeTab === 'completed'
                                    ? 'bg-green-50 text-green border-b-2 border-green'
                                    : 'text-gray hover:text-heading'
                            }`}
                        >
                            Completed ({buckets.completed.length})
                        </button>
                    </div>

                    {/* Candidate Queue List */}
                    <div className="divide-y divide-disabled/40 max-h-[640px] overflow-y-auto">
                        {currentQueue.length === 0 ? (
                            <div className="py-14 px-4 text-center">
                                <CheckIcon className="w-8 h-8 mx-auto text-green" />
                                <div className="text-xs font-bold text-heading mt-2">Queue is clear!</div>
                                <div className="text-[11px] text-gray mt-1">
                                    No candidates currently in the {activeTab} stage.
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
                                            isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-disabled/15'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-heading">{lead.student}</span>
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-disabled/40 text-gray">
                                                Grade {lead.grade}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray mt-1">
                                            Parent: <span className="text-heading font-medium">{lead.parent}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-gray mt-2">
                                            <span className="font-mono">{lead.id}</span>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStageBadgeClasses(lead.stage)}`}>
                                                {STAGE_LABELS[lead.stage] || lead.stage}
                                            </span>
                                        </div>
                                        {lead.due && (
                                            <div className="text-[11px] text-indigo-700 font-medium mt-1.5 flex items-center gap-1">
                                                <ClockIcon className="w-3 h-3" />
                                                <span>{formatDateTime(lead.due)}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Column: CBT Management Console */}
                <div className="lg:col-span-8 bg-white border border-disabled rounded-2xl p-6 shadow-sm">
                    {!activeLead ? (
                        <div className="py-20 text-center text-gray text-xs">
                            Select a candidate from the queue on the left to manage CBT scheduling or attendance.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Candidate Identity Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-5 border-b border-disabled/40 gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-gray">{activeLead.id}</span>
                                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getStageBadgeClasses(activeLead.stage)}`}>
                                            {STAGE_LABELS[activeLead.stage] || activeLead.stage}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black text-heading mt-1">{activeLead.student}</h2>
                                    <div className="text-xs text-gray mt-0.5">
                                        Candidate for <span className="font-semibold text-heading">Grade {activeLead.grade}</span> &bull; Academic Cycle {activeLead.cycle} &bull; Channel: {activeLead.source}
                                    </div>
                                </div>

                                {/* Direct Parent Contact */}
                                <div className="flex items-center gap-2">
                                    <WhatsAppContactButton lead={activeLead} />
                                    <a
                                        href={`tel:${activeLead.phone}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary-dark transition-colors shadow-sm"
                                    >
                                        <PhoneIcon className="w-4 h-4" />
                                        <span>Call Parent</span>
                                    </a>
                                </div>
                            </div>

                            {/* Contact & Status Strip */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-disabled/15 rounded-xl p-3 text-xs">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-gray">Parent / Guardian</div>
                                    <div className="font-bold text-heading mt-0.5">{activeLead.parent}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-gray">Primary Phone</div>
                                    <div className="font-bold text-heading mt-0.5">{activeLead.phone}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-gray">Current Next Step</div>
                                    <div className="font-medium text-heading mt-0.5 truncate">{activeLead.nextAction || 'Awaiting schedule'}</div>
                                </div>
                            </div>

                            {/* Action Block 1: Schedule / Reschedule Entrance Test */}
                            <div className="bg-indigo-50/50 border border-indigo-200/70 rounded-2xl p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                            1
                                        </div>
                                        <h3 className="text-sm font-bold text-heading">
                                            {activeLead.stage === 'CBT_SCHEDULED' ? 'Reschedule Test Date / Center' : 'Schedule Entrance Test'}
                                        </h3>
                                    </div>
                                    {activeLead.stage === 'CBT_SCHEDULED' && (
                                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                                            Already Scheduled: {formatDateTime(activeLead.due)}
                                        </span>
                                    )}
                                </div>

                                <form onSubmit={handleScheduleTest} className="space-y-3 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-heading font-bold mb-1">
                                                Test Date & Time *
                                            </label>
                                            <input
                                                type="datetime-local"
                                                required
                                                value={testDateTime}
                                                onChange={(e) => setTestDateTime(e.target.value)}
                                                className="w-full border border-disabled rounded-lg px-3 py-2 bg-white text-heading focus:outline-none focus:border-indigo-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-heading font-bold mb-1">
                                                Test Center / Lab Location *
                                            </label>
                                            <select
                                                value={testCenter}
                                                onChange={(e) => setTestCenter(e.target.value)}
                                                className="w-full border border-disabled rounded-lg px-3 py-2 bg-white text-heading focus:outline-none focus:border-indigo-600"
                                            >
                                                <option value="Campus Computer Lab A (Ground Floor)">Campus Computer Lab A (Ground Floor)</option>
                                                <option value="Campus Computer Lab B (First Floor)">Campus Computer Lab B (First Floor)</option>
                                                <option value="Main Auditorium CBT Terminals">Main Auditorium CBT Terminals</option>
                                                <option value="Online Remote Proctored CBT">Online Remote Proctored CBT</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-heading font-bold mb-1">
                                                Assessment Stream / Subjects
                                            </label>
                                            <select
                                                value={testSubject}
                                                onChange={(e) => setTestSubject(e.target.value)}
                                                className="w-full border border-disabled rounded-lg px-3 py-2 bg-white text-heading focus:outline-none focus:border-indigo-600"
                                            >
                                                <option value="JEE Foundation (Physics, Chemistry, Maths)">JEE Foundation (Physics, Chemistry, Maths)</option>
                                                <option value="NEET Foundation (Physics, Chemistry, Biology)">NEET Foundation (Physics, Chemistry, Biology)</option>
                                                <option value="General Scholastic Aptitude Test (GSAT)">General Scholastic Aptitude Test (GSAT)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-heading font-bold mb-1">
                                                Assigned Invigilator / Examiner
                                            </label>
                                            <input
                                                type="text"
                                                value={invigilator}
                                                onChange={(e) => setInvigilator(e.target.value)}
                                                className="w-full border border-disabled rounded-lg px-3 py-2 bg-white text-heading focus:outline-none focus:border-indigo-600"
                                                placeholder="Examiner name"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                                        >
                                            <span>{activeLead.stage === 'CBT_SCHEDULED' ? 'Confirm Reschedule' : 'Save & Confirm Schedule'}</span>
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Action Block 2: Attendance & Conduct Management */}
                            <div className="bg-white border border-disabled rounded-2xl p-5 space-y-4 shadow-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                                        2
                                    </div>
                                    <h3 className="text-sm font-bold text-heading">
                                        Manage Candidate Attendance & Conduct
                                    </h3>
                                </div>

                                <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs">
                                    <div>
                                        <label className="block text-heading font-bold mb-2">
                                            Select Attendance Status *
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'Present', label: 'Present / Appeared', desc: 'Candidate arrived & seated' },
                                                { id: 'Absent', label: 'Absent / No-Show', desc: 'Did not attend test' },
                                                { id: 'Rescheduled', label: 'Request Reschedule', desc: 'Parent requested new slot' },
                                            ].map((status) => (
                                                <button
                                                    type="button"
                                                    key={status.id}
                                                    onClick={() => setAttendanceStatus(status.id)}
                                                    className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                                                        attendanceStatus === status.id
                                                            ? status.id === 'Present'
                                                                ? 'bg-green-50 text-green border-green shadow-xs'
                                                                : status.id === 'Absent'
                                                                ? 'bg-red-50 text-alert border-alert shadow-xs'
                                                                : 'bg-amber-50 text-amber-800 border-amber-600 shadow-xs'
                                                            : 'bg-white border-disabled text-heading hover:bg-disabled/20'
                                                    }`}
                                                >
                                                    <div className="font-bold">{status.label}</div>
                                                    <div className="text-[10px] text-gray mt-0.5">{status.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Completion Checkbox if Present */}
                                    {attendanceStatus === 'Present' && (
                                        <div className="p-3 bg-green-50/60 border border-green/20 rounded-xl flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                id="markComplete"
                                                checked={markCompleteOnPresent}
                                                onChange={(e) => setMarkCompleteOnPresent(e.target.checked)}
                                                className="w-4 h-4 accent-green rounded cursor-pointer"
                                            />
                                            <label htmlFor="markComplete" className="text-xs text-heading font-semibold cursor-pointer">
                                                Test completed successfully: Move candidate to <strong>CBT_COMPLETED</strong> stage for scoring & rank evaluation.
                                            </label>
                                        </div>
                                    )}

                                    {/* Conduct Remarks */}
                                    <div>
                                        <label className="block text-heading font-bold mb-1">
                                            Conduct Remarks & Invigilator Notes
                                        </label>
                                        <textarea
                                            rows="2"
                                            value={conductNote}
                                            onChange={(e) => setConductNote(e.target.value)}
                                            placeholder="e.g. Seated at Terminal #12. Submitted all sections. No technical glitches."
                                            className="w-full border border-disabled rounded-lg p-2.5 text-heading focus:outline-none focus:border-indigo-600 placeholder-gray"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-5 py-2.5 bg-heading hover:bg-black text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                                        >
                                            Save Attendance Record
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Section 3: Chronological History for Active Candidate */}
                            <div className="pt-2 border-t border-disabled/40">
                                <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-3">
                                    Candidate Timeline & Audit History
                                </h4>
                                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                    {activeLead.history && activeLead.history.length > 0 ? (
                                        [...activeLead.history].reverse().map((item, idx) => (
                                            <div key={item.id || idx} className="text-xs p-2.5 bg-disabled/15 rounded-lg border border-disabled/30">
                                                <div className="flex items-center justify-between text-[11px] text-gray">
                                                    <span className="font-bold text-heading">{item.actor}</span>
                                                    <span>{formatDateTime(item.at)}</span>
                                                </div>
                                                <div className="text-heading font-medium mt-1 leading-relaxed">
                                                    {item.text}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-gray py-2">No history logged yet.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
