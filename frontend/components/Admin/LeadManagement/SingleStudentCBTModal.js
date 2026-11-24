import React, { useState, useEffect } from 'react';
import { TestDocIcon, ClockIcon, CheckIcon, AlertIcon, ArrowRightIcon, PhoneIcon, CopyIcon, UserIcon } from '../icons';
import WhatsAppContactButton from '../WhatsAppContactButton';
import { STAGE_LABELS, getStageBadgeClasses, formatDateTime } from '../constants';
import { buildTestShareUrl } from './testGenerator';

/**
 * Single Student CBT Management Modal.
 * Opens when an administrator taps a candidate row from the row-wise CBT Conduct Desk.
 * Artfully pairs Acadza's Royal Blue and Vibrant Orange:
 * - Schedule & Venue operations in structured Royal Blue.
 * - Syllabus Portion & Test Paper generation in Acadza's signature Vibrant Orange (#E06A19).
 * - Exam Attendance & Conductivity in fresh Emerald Green.
 */
export default function SingleStudentCBTModal({
    isOpen,
    onClose,
    lead,
    onSaveCBTAction,
    onOpenSyllabusModal,
    onOpenTestModal,
}) {
    if (!isOpen || !lead) return null;

    // Active tab inside modal: 'schedule' | 'test' | 'attendance'
    const [activeTab, setActiveTab] = useState('schedule');

    // Schedule form state
    const [testDateTime, setTestDateTime] = useState(() => {
        if (lead.due) {
            try {
                return new Date(lead.due).toISOString().slice(0, 16);
            } catch {
                // fallback
            }
        }
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
    const [copiedLink, setCopiedLink] = useState(false);

    // Sync form when lead changes
    useEffect(() => {
        if (lead) {
            if (lead.due) {
                try {
                    setTestDateTime(new Date(lead.due).toISOString().slice(0, 16));
                } catch {
                    // ignore
                }
            }
            if (lead.stage === 'CBT_SCHEDULED') {
                setActiveTab('attendance');
            } else {
                setActiveTab('schedule');
            }
        }
    }, [lead]);

    // Handle Schedule Test
    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        const scheduledDateISO = new Date(testDateTime).toISOString();
        const formattedDate = formatDateTime(scheduledDateISO);

        onSaveCBTAction(lead.id, {
            nextStage: 'CBT_SCHEDULED',
            nextAction: `Attend CBT Test (${formattedDate}) at ${testCenter}`,
            due: scheduledDateISO,
            outcome: `CBT Scheduled for ${formattedDate} (${testCenter})`,
            note: `Scheduled by CBT Conductivity Team. Subject: ${testSubject}. Invigilator: ${invigilator}.`,
            isScheduleAction: true,
        });

        onClose();
    };

    // Handle Attendance Submit
    const handleAttendanceSubmit = (e) => {
        e.preventDefault();
        let nextStage = lead.stage;
        let nextAction = lead.nextAction;
        let scheduledDue = lead.due;

        if (attendanceStatus === 'Present') {
            if (markCompleteOnPresent) {
                nextStage = 'CBT_COMPLETED';
                nextAction = 'Evaluate CBT Scores & Prepare Merit Rank';
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

        onSaveCBTAction(lead.id, {
            nextStage,
            nextAction,
            due: scheduledDue,
            outcome: `CBT Attendance: ${attendanceStatus}`,
            note: conductNote.trim()
                ? `Attendance: ${attendanceStatus}. Remarks: ${conductNote.trim()}`
                : `Attendance marked as ${attendanceStatus} by CBT Conduct Team.`,
            isAttendanceAction: true,
        });

        onClose();
    };

    // Test Link resolution
    const testUrl = lead.testPaper ? buildTestShareUrl(lead.testPaper.testId, lead.id) : '';

    const handleCopyLink = () => {
        if (!testUrl) return;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(testUrl);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 3000);
        }
    };

    const customWhatsAppMsg = `Hello ${lead.parent || 'Parent'}, your ward ${lead.student}'s Entrance CBT test for Class ${lead.grade} at Acadza is scheduled for ${formatDateTime(lead.due || testDateTime)} at ${testCenter}. Test Link: ${testUrl}`;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-disabled w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Modal Header: Royal Blue + Acadza Orange Harmony */}
                <div className="p-5 border-b border-disabled/70 flex items-start justify-between bg-gradient-to-r from-blue-50/40 via-white to-orange-50/30">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-[#E06A19]/25">
                            {lead.student?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-heading tracking-tight">
                                    {lead.student}
                                </h2>
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#E06A19] border border-orange-200">
                                    Grade {lead.grade}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStageBadgeClasses(lead.stage)}`}>
                                    {STAGE_LABELS[lead.stage] || lead.stage}
                                </span>
                            </div>
                            <div className="text-xs text-gray mt-1 flex flex-wrap items-center gap-3">
                                <span>ID: <strong className="text-heading">{lead.id}</strong></span>
                                <span>•</span>
                                <span>Parent: <strong className="text-heading">{lead.parent}</strong></span>
                                <span>•</span>
                                <span>Phone: <strong className="text-heading">{lead.phone}</strong></span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray hover:text-heading p-1.5 rounded-lg hover:bg-disabled/40 transition-colors cursor-pointer text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Quick Contact & Action Ribbon */}
                <div className="px-5 py-2.5 bg-[#FEFBF0] border-b border-[#e5dec9] flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <WhatsAppContactButton
                            phoneNumber={lead.phone}
                            studentName={lead.student}
                            parentName={lead.parent}
                            customMessage={customWhatsAppMsg}
                        />
                        <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-disabled rounded-lg font-bold text-heading hover:bg-disabled/20 transition-colors cursor-pointer shadow-2xs"
                        >
                            <PhoneIcon className="w-3.5 h-3.5 text-blue-600" />
                            <span>Call Parent</span>
                        </a>
                    </div>
                    <div className="text-[11px] text-gray">
                        Next: <strong className="text-heading">{lead.nextAction}</strong>
                    </div>
                </div>

                {/* Modal Navigation Tabs (Blue, Orange, Green functional coding) */}
                <div className="grid grid-cols-3 border-b border-disabled text-center text-xs font-bold bg-white">
                    <button
                        type="button"
                        onClick={() => setActiveTab('schedule')}
                        className={`py-3 transition-colors cursor-pointer border-b-2 ${
                            activeTab === 'schedule'
                                ? 'border-blue-600 text-blue-700 bg-blue-50/40'
                                : 'border-transparent text-gray hover:text-heading'
                        }`}
                    >
                        1. Schedule & Venue
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('test')}
                        className={`py-3 transition-colors cursor-pointer border-b-2 ${
                            activeTab === 'test'
                                ? 'border-[#E06A19] text-[#E06A19] bg-orange-50/40'
                                : 'border-transparent text-gray hover:text-heading'
                        }`}
                    >
                        2. Syllabus & Test Paper
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('attendance')}
                        className={`py-3 transition-colors cursor-pointer border-b-2 ${
                            activeTab === 'attendance'
                                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                                : 'border-transparent text-gray hover:text-heading'
                        }`}
                    >
                        3. Attendance & Conduct
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 overflow-y-auto space-y-4 flex-1">
                    {/* TAB 1: SCHEDULE & VENUE (Royal Blue Theme) */}
                    {activeTab === 'schedule' && (
                        <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                                <div>
                                    <span className="font-bold block">Current Scheduled Slot:</span>
                                    <span className="text-[11px]">{lead.due ? formatDateTime(lead.due) : 'Not scheduled yet'}</span>
                                </div>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-blue-300 text-blue-700">
                                    {lead.stage === 'CBT_SCHEDULED' ? 'Scheduled' : 'Awaiting Schedule'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-heading uppercase tracking-wider mb-1">
                                    Test Date & Slot Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={testDateTime}
                                    onChange={(e) => setTestDateTime(e.target.value)}
                                    className="w-full px-3 py-2 bg-disabled/20 border border-disabled rounded-lg text-heading font-medium focus:outline-none focus:border-blue-600 text-xs"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-heading uppercase tracking-wider mb-1">
                                    Computer Lab / Test Center *
                                </label>
                                <select
                                    value={testCenter}
                                    onChange={(e) => setTestCenter(e.target.value)}
                                    className="w-full px-3 py-2 bg-disabled/20 border border-disabled rounded-lg text-heading font-medium focus:outline-none focus:border-blue-600 text-xs"
                                >
                                    <option value="Campus Computer Lab A (Ground Floor)">Campus Computer Lab A (Ground Floor)</option>
                                    <option value="Campus Computer Lab B (First Floor)">Campus Computer Lab B (First Floor)</option>
                                    <option value="Main Auditorium Terminal 1-30">Main Auditorium Terminal 1-30</option>
                                    <option value="Online Proctored Remote Home Assessment">Online Proctored Remote Home Assessment</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-heading uppercase tracking-wider mb-1">
                                    Assessment Stream / Subject
                                </label>
                                <input
                                    type="text"
                                    value={testSubject}
                                    onChange={(e) => setTestSubject(e.target.value)}
                                    className="w-full px-3 py-2 bg-disabled/20 border border-disabled rounded-lg text-heading font-medium focus:outline-none focus:border-blue-600 text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-heading uppercase tracking-wider mb-1">
                                    Assigned Invigilator / Examiner
                                </label>
                                <input
                                    type="text"
                                    value={invigilator}
                                    onChange={(e) => setInvigilator(e.target.value)}
                                    placeholder="e.g. Prof. S. R. Verma"
                                    className="w-full px-3 py-2 bg-disabled/20 border border-disabled rounded-lg text-heading font-medium focus:outline-none focus:border-blue-600 text-xs"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-disabled rounded-lg text-heading font-bold hover:bg-disabled/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Save & Confirm Schedule</span>
                                    <ArrowRightIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB 2: SYLLABUS & TEST PAPER (Signature Acadza Orange Theme) */}
                    {activeTab === 'test' && (
                        <div className="space-y-4 text-xs">
                            {/* Portion Card */}
                            <div className="p-4 rounded-xl border border-orange-200/80 bg-orange-50/20 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-bold text-heading text-xs">
                                            Entrance Assessment Portion (Syllabus)
                                        </div>
                                        <div className="text-[11px] text-gray mt-0.5">
                                            Admitting to <strong>Grade {lead.grade}</strong> — Evaluated on <strong>Grade {Number(lead.grade) > 5 ? Number(lead.grade) - 1 : 5} Syllabus</strong>.
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onOpenSyllabusModal(lead)}
                                        className="px-3.5 py-1.5 bg-[#E06A19] hover:bg-[#c85a10] text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
                                    >
                                        Configure Chapters &rarr;
                                    </button>
                                </div>

                                <div className="p-2.5 rounded-lg bg-white border border-orange-200 text-[11px] text-heading">
                                    <strong className="text-[#E06A19]">Portion Status:</strong> {lead.testConfig?.summaryLabel || 'Standard Comprehensive Syllabus Assigned'}
                                </div>
                            </div>

                            {/* Test Paper Card */}
                            <div className="p-4 rounded-xl border border-disabled bg-[#F8FAFC] space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-bold text-heading text-xs">
                                            Online Test Paper & Candidate Link
                                        </div>
                                        <div className="text-[11px] text-gray mt-0.5">
                                            {lead.testPaper
                                                ? `Test Paper active: ${lead.testPaper.testId} (${lead.testPaper.totalQuestions} Questions, ${lead.testPaper.durationMinutes} Mins)`
                                                : 'Generate test paper mapped strictly to selected chapters.'}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onOpenTestModal(lead)}
                                        className="px-3.5 py-1.5 bg-[#E06A19] hover:bg-[#c85a10] text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
                                    >
                                        {lead.testPaper ? 'View Test Paper' : 'Generate Test & Link'}
                                    </button>
                                </div>

                                {lead.testPaper && (
                                    <div className="p-3 rounded-lg bg-white border border-disabled space-y-2">
                                        <div className="text-[11px] font-bold text-heading flex items-center justify-between">
                                            <span>Shareable Student Link:</span>
                                            {copiedLink && <span className="text-green font-bold">Copied to Clipboard!</span>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={testUrl}
                                                className="flex-1 px-2.5 py-1.5 text-xs bg-disabled/20 border border-disabled rounded-lg text-heading select-all font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCopyLink}
                                                className="px-3 py-1.5 bg-white border border-orange-300 hover:bg-orange-50 text-[#E06A19] rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                                            >
                                                <CopyIcon className="w-3.5 h-3.5 text-[#E06A19]" />
                                                <span>Copy</span>
                                            </button>
                                            <WhatsAppContactButton
                                                phoneNumber={lead.phone}
                                                studentName={lead.student}
                                                parentName={lead.parent}
                                                customMessage={customWhatsAppMsg}
                                                label="WhatsApp"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: ATTENDANCE & CONDUCT (Emerald Green Theme) */}
                    {activeTab === 'attendance' && (
                        <form onSubmit={handleAttendanceSubmit} className="space-y-4 text-xs">
                            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs">
                                <strong>Exam Day Conductivity Desk:</strong> Record candidate attendance, log invigilator observations, or reschedule the exam.
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-heading uppercase tracking-wider mb-1.5">
                                    Candidate Attendance Status *
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Present', 'Absent', 'Rescheduled'].map((status) => (
                                        <label
                                            key={status}
                                            className={`p-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
                                                attendanceStatus === status
                                                    ? status === 'Present'
                                                        ? 'bg-green-50 border-green text-green'
                                                        : status === 'Absent'
                                                        ? 'bg-alert/10 border-alert text-alert'
                                                        : 'bg-amber-50 border-amber-600 text-amber-800'
                                                    : 'bg-white border-disabled text-gray hover:border-gray'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="attendanceStatus"
                                                value={status}
                                                checked={attendanceStatus === status}
                                                onChange={(e) => setAttendanceStatus(e.target.value)}
                                                className="sr-only"
                                            />
                                            <span>{status}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {attendanceStatus === 'Present' && (
                                <label className="flex items-center gap-2 p-3 rounded-xl bg-green-50/50 border border-green-200/60 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={markCompleteOnPresent}
                                        onChange={(e) => setMarkCompleteOnPresent(e.target.checked)}
                                        className="w-4 h-4 rounded accent-green"
                                    />
                                    <span className="text-xs font-semibold text-heading">
                                        Mark stage as <strong>Completed (CBT Complete)</strong> upon saving
                                    </span>
                                </label>
                            )}

                            <div>
                                <label className="block text-[11px] font-bold text-heading uppercase tracking-wider mb-1">
                                    Invigilator Remarks & Conduct Observations
                                </label>
                                <textarea
                                    value={conductNote}
                                    onChange={(e) => setConductNote(e.target.value)}
                                    placeholder="e.g. Completed test in 48 minutes with high proficiency. Punctual attendance."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-disabled/20 border border-disabled rounded-lg text-heading text-xs focus:outline-none focus:border-green"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-disabled rounded-lg text-heading font-bold hover:bg-disabled/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-green hover:bg-green/90 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                                >
                                    Save Attendance Record
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
