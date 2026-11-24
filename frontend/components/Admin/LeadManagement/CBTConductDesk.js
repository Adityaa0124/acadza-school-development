import React, { useState, useMemo } from 'react';
import { TestDocIcon, ClockIcon, CheckIcon, ArrowRightIcon, PhoneIcon, UserIcon, CopyIcon, AlertIcon } from '../icons';
import WhatsAppContactButton from '../WhatsAppContactButton';
import { STAGE_LABELS, getStageBadgeClasses, formatDateTime, GRADES } from '../constants';
import CBTSyllabusModal from './CBTSyllabusModal';
import CBTTestModal from './CBTTestModal';
import BatchCBTSetupScreen from './BatchCBTSetupScreen';
import SingleStudentCBTModal from './SingleStudentCBTModal';
import { getSyllabusForTargetGrade } from './syllabusData';
import { generateTestPaper, buildTestShareUrl } from './testGenerator';

/**
 * CBT Conduct & Evaluation Desk Workspace (Row-Wise Layout).
 * Visually balanced with Acadza's signature brand palette (Royal Blue & Vibrant Orange):
 * 1. Dual-palette candidate avatars and grade badges prevent monochromatic fatigue.
 * 2. Tapping any candidate row opens a focused modal popup with full details,
 *    scheduling, syllabus portion picker, and attendance management.
 * 3. Multi-selecting students of the same class triggers the dedicated next screen
 *    (BatchCBTSetupScreen) to configure unified schedule and generate tests for all at once.
 */
export default function CBTConductDesk({
    leads,
    onSaveCBTAction,
    onBackToDirectory,
}) {
    const [activeTab, setActiveTab] = useState('ready'); // 'ready' | 'scheduled' | 'completed'
    const [gradeFilter, setGradeFilter] = useState(''); // '' = All Grades
    const [searchTerm, setSearchTerm] = useState('');
    const [batchSelectedIds, setBatchSelectedIds] = useState([]);
    const [isBatchViewActive, setIsBatchViewActive] = useState(false);

    // Single student modal state
    const [singleStudentModalLead, setSingleStudentModalLead] = useState(null);
    const activeSingleLead = useMemo(() => {
        if (!singleStudentModalLead) return null;
        return leads.find((l) => l.id === singleStudentModalLead.id) || singleStudentModalLead;
    }, [leads, singleStudentModalLead]);

    // Syllabus Modal State
    const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
    const [modalTargetGrade, setModalTargetGrade] = useState('7');
    const [modalCandidates, setModalCandidates] = useState([]);

    // Test Paper & Link Modal State
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [activeTestPaper, setActiveTestPaper] = useState(null);
    const [testModalCandidate, setTestModalCandidate] = useState(null);

    // Group leads into CBT lifecycle buckets
    const buckets = useMemo(() => {
        const ready = leads.filter((l) => l.stage === 'READY_FOR_CBT');
        const scheduled = leads.filter((l) => l.stage === 'CBT_SCHEDULED');
        const completed = leads.filter((l) => ['CBT_COMPLETED', 'ADMISSION_IN_PROGRESS', 'CONVERTED'].includes(l.stage));
        return { ready, scheduled, completed };
    }, [leads]);

    // Active tab queue filtered by Grade and Search term
    const currentQueue = useMemo(() => {
        const base =
            activeTab === 'ready'
                ? buckets.ready
                : activeTab === 'scheduled'
                ? buckets.scheduled
                : buckets.completed;

        let filtered = base;
        if (gradeFilter) {
            filtered = filtered.filter((l) => String(l.grade) === String(gradeFilter));
        }
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(
                (l) =>
                    l.student?.toLowerCase().includes(query) ||
                    l.parent?.toLowerCase().includes(query) ||
                    l.phone?.includes(query) ||
                    l.id?.toLowerCase().includes(query)
            );
        }
        return filtered;
    }, [activeTab, buckets, gradeFilter, searchTerm]);

    // A batch may only contain students of ONE class. The class is locked in by the first
    // student selected; students of any other class stay disabled until selection is cleared.
    const [selectionNotice, setSelectionNotice] = useState('');
    const selectionGrade = useMemo(() => {
        if (batchSelectedIds.length === 0) return null;
        const first = leads.find((l) => l.id === batchSelectedIds[0]);
        return first ? String(first.grade) : null;
    }, [batchSelectedIds, leads]);

    // Rows that "Select All" is allowed to pick: same class as the current selection, or
    // (with nothing selected) the Grade filter's class, or the class of the first row.
    const selectableQueue = useMemo(() => {
        const grade = selectionGrade || (currentQueue[0] ? String(currentQueue[0].grade) : null);
        return grade ? currentQueue.filter((l) => String(l.grade) === grade) : [];
    }, [currentQueue, selectionGrade]);

    const allSelectableChecked =
        selectableQueue.length > 0 && selectableQueue.every((l) => batchSelectedIds.includes(l.id));

    // Multi-Select handlers
    const handleToggleBatchCandidate = (lead, e) => {
        e.stopPropagation();
        const leadId = lead.id;
        if (batchSelectedIds.includes(leadId)) {
            setBatchSelectedIds((prev) => prev.filter((id) => id !== leadId));
            setSelectionNotice('');
            return;
        }
        if (selectionGrade && String(lead.grade) !== selectionGrade) {
            setSelectionNotice(
                `Tests can only be set up for one class at a time. You have Grade ${selectionGrade} selected — clear the selection to pick a Grade ${lead.grade} student.`
            );
            return;
        }
        setSelectionNotice('');
        setBatchSelectedIds((prev) => [...prev, leadId]);
    };

    const handleSelectAllInQueue = () => {
        setSelectionNotice('');
        if (allSelectableChecked) {
            setBatchSelectedIds([]);
        } else {
            setBatchSelectedIds(selectableQueue.map((l) => l.id));
        }
    };

    const clearBatchSelection = () => {
        setBatchSelectedIds([]);
        setSelectionNotice('');
    };

    // Open Single Student Modal
    const handleOpenStudentModal = (lead) => {
        setSingleStudentModalLead(lead);
    };

    // Open syllabus modal for candidate
    const handleOpenSyllabusModalForLead = (lead) => {
        setModalTargetGrade(lead.grade || '7');
        setModalCandidates([lead]);
        setIsSyllabusModalOpen(true);
    };

    // Open test paper modal for candidate
    const handleOpenTestModalForLead = (lead) => {
        setTestModalCandidate(lead);
        if (lead.testPaper) {
            setActiveTestPaper(lead.testPaper);
        } else {
            const paper = generateTestPaper({
                targetGrade: lead.grade,
                testConfig: lead.testConfig,
                studentId: lead.id,
                studentName: lead.student,
            });
            setActiveTestPaper(paper);
        }
        setIsTestModalOpen(true);
    };

    // Handler: Save syllabus portion configuration from modal
    const handleSavePortion = (portionConfig) => {
        const candidateIdsToUpdate =
            modalCandidates.length > 0 ? modalCandidates.map((c) => c.id) : [];

        candidateIdsToUpdate.forEach((leadId) => {
            onSaveCBTAction(leadId, {
                testConfig: portionConfig,
                outcome: `Configured CBT Portion: ${portionConfig.summaryLabel}`,
                note: `Evaluated on Grade ${portionConfig.testGrade} Standard. Presets: ${portionConfig.preset}.`,
                nextAction: 'Entrance test portion locked',
            });
        });

        setIsSyllabusModalOpen(false);
    };

    // Handler: Attach test paper to candidate
    const handleAttachTestPaper = (paper) => {
        if (!testModalCandidate) return;

        onSaveCBTAction(testModalCandidate.id, {
            testPaper: paper,
            nextStage: testModalCandidate.stage === 'READY_FOR_CBT' ? 'CBT_SCHEDULED' : testModalCandidate.stage,
            outcome: `CBT Test Created: ${paper.testId}`,
            note: `Duration: ${paper.durationMinutes}m. Total Questions: ${paper.totalQuestions} (${paper.totalMarks} Marks). Evaluated on Grade ${paper.testGrade} Syllabus.`,
            nextAction: 'Send CBT link to candidate',
        });

        setIsTestModalOpen(false);
    };

    // Handler: Batch save test paper, syllabus config & schedule date to all candidates
    const handleSaveBatch = ({ candidateIds, testConfig, testPaper, schedulePayload }) => {
        candidateIds.forEach((leadId) => {
            onSaveCBTAction(leadId, {
                testConfig,
                testPaper,
                due: schedulePayload.due,
                outcome: schedulePayload.outcome,
                note: schedulePayload.note,
                nextStage: schedulePayload.nextStage,
                nextAction: schedulePayload.nextAction,
            });
        });
    };

    // Helper: Blue-led palette. Orange is reserved for a few small accents only.
    const getAvatarClasses = () => 'bg-blue-100 text-blue-800 border border-blue-200';

    const getGradeBadgeStyle = (grade) =>
        Number(grade) >= 11
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-slate-50 text-slate-700 border-slate-200';

    // Render Dedicated Batch CBT Setup Screen when activated
    if (isBatchViewActive && batchSelectedIds.length > 0) {
        const batchCandidates = leads.filter((l) => batchSelectedIds.includes(l.id));
        return (
            <BatchCBTSetupScreen
                selectedCandidates={batchCandidates}
                onSaveBatch={handleSaveBatch}
                onBack={() => setIsBatchViewActive(false)}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Navigation & Dual-Tone Brand Elements */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <button
                        onClick={onBackToDirectory}
                        className="text-xs font-semibold text-gray hover:text-heading flex items-center gap-1.5 mb-1.5 transition-colors group cursor-pointer"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span>
                        <span>Back to Enquiries Directory</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-[#E06A19]/25">
                            <TestDocIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-heading tracking-tight">
                                CBT Conduct & Evaluation Desk
                            </h1>
                            <p className="text-xs text-gray mt-0.5">
                                Tap any student row to view & manage details, or select multiple students of the same class to create batch tests.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Pipeline KPI Badges (Blue + Orange + Green Harmony) */}
                <div className="flex items-center gap-2 text-xs">
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-disabled flex items-center gap-2 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-[#E06A19] animate-pulse" />
                        <span className="text-gray font-medium">Ready:</span>
                        <strong className="text-heading font-black">{buckets.ready.length}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center gap-2 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span className="text-blue-700 font-medium">Scheduled:</span>
                        <strong className="text-heading font-black">{buckets.scheduled.length}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-2 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-green" />
                        <span className="text-emerald-700 font-medium">Completed:</span>
                        <strong className="text-heading font-black">{buckets.completed.length}</strong>
                    </div>
                </div>
            </div>

            {/* Filter Strip & Tabs */}
            <div className="bg-white border border-disabled rounded-2xl shadow-xs p-4 space-y-3.5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Lifecycle Tabs (Color-coded by stage) */}
                    <div className="inline-flex p-1 rounded-xl bg-disabled/30 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('ready');
                                setBatchSelectedIds([]);
                            }}
                            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'ready'
                                    ? 'bg-white text-blue-700 shadow-xs'
                                    : 'text-gray hover:text-heading'
                            }`}
                        >
                            Awaiting Test ({buckets.ready.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('scheduled');
                                setBatchSelectedIds([]);
                            }}
                            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'scheduled'
                                    ? 'bg-white text-blue-700 shadow-xs'
                                    : 'text-gray hover:text-heading'
                            }`}
                        >
                            Scheduled ({buckets.scheduled.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('completed');
                                setBatchSelectedIds([]);
                            }}
                            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'completed'
                                    ? 'bg-white text-emerald-700 shadow-xs'
                                    : 'text-gray hover:text-heading'
                            }`}
                        >
                            Completed ({buckets.completed.length})
                        </button>
                    </div>

                    {/* Grade Filter & Search Input */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <select
                            value={gradeFilter}
                            onChange={(e) => {
                                setGradeFilter(e.target.value);
                                setBatchSelectedIds([]);
                            }}
                            className="text-xs bg-disabled/20 border border-disabled rounded-lg px-3 py-2 font-bold text-heading focus:outline-none focus:border-blue-600"
                        >
                            <option value="">All Grades</option>
                            {GRADES.map((g) => (
                                <option key={g} value={g}>
                                    Grade {g}
                                </option>
                            ))}
                        </select>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search student, parent, phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-56 sm:w-64 pl-3 pr-3 py-2 text-xs bg-disabled/20 border border-disabled rounded-lg text-heading placeholder-gray focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        {currentQueue.length > 0 && (
                            <button
                                type="button"
                                onClick={handleSelectAllInQueue}
                                className="text-xs font-bold text-blue-700 hover:text-blue-900 px-2 py-1.5 transition-colors cursor-pointer"
                            >
                                {allSelectableChecked
                                    ? 'Deselect All'
                                    : `Select All${
                                          selectableQueue.length < currentQueue.length && selectableQueue[0]
                                              ? ` Grade ${selectableQueue[0].grade}`
                                              : ''
                                      } (${selectableQueue.length})`}
                            </button>
                        )}
                    </div>
                </div>

                {/* Floating Batch Action Strip (Dual Blue + Orange Accent) */}
                {batchSelectedIds.length > 0 && (
                    <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-100 shadow-xs">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            <div>
                                <span className="text-xs font-black text-blue-950 block">
                                    {batchSelectedIds.length} Student{batchSelectedIds.length === 1 ? '' : 's'} Selected
                                    {selectionGrade ? ` · Grade ${selectionGrade}` : ''}
                                </span>
                                <span className={`text-[11px] ${selectionNotice ? 'text-red-600 font-semibold' : 'text-gray'}`}>
                                    {selectionNotice ||
                                        'Configure uniform schedule, syllabus portion, and generate tests at once (one class per batch).'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button
                                type="button"
                                onClick={clearBatchSelection}
                                className="px-3 py-1.5 bg-white border border-disabled text-gray hover:text-heading rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                                Clear Selection
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsBatchViewActive(true)}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E06A19] hover:bg-[#c85a10] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <span>Proceed to Batch Setup ({batchSelectedIds.length})</span>
                                <ArrowRightIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Row-Wise Candidates Table */}
            <div className="bg-white border border-disabled rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-disabled/70 bg-[#F8FAFC] text-gray uppercase text-[10px] tracking-wider font-bold">
                                <th className="py-3 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={allSelectableChecked}
                                        onChange={handleSelectAllInQueue}
                                        className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                                    />
                                </th>
                                <th className="py-3 px-3">Student & ID</th>
                                <th className="py-3 px-3">Parent & Contact</th>
                                <th className="py-3 px-3">Target Grade</th>
                                <th className="py-3 px-3">Current Status</th>
                                <th className="py-3 px-3">Test Paper & Syllabus</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-disabled/40 text-heading">
                            {currentQueue.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-14 text-center">
                                        <CheckIcon className="w-8 h-8 mx-auto text-green" />
                                        <div className="text-xs font-bold text-heading mt-2">
                                            No candidates found matching this filter
                                        </div>
                                        <div className="text-[11px] text-gray mt-1">
                                            Try switching tabs or resetting the Grade filter.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentQueue.map((lead, idx) => {
                                    const isChecked = batchSelectedIds.includes(lead.id);
                                    const isOtherClass = !!selectionGrade && String(lead.grade) !== selectionGrade;
                                    const customWaMsg = `Hello ${lead.parent || 'Parent'}, regarding ${lead.student}'s Grade ${lead.grade} entrance CBT test at Acadza. Status: ${lead.nextAction}.`;

                                    // Dynamic action button based on candidate stage
                                    const isReady = lead.stage === 'READY_FOR_CBT';
                                    const isScheduled = lead.stage === 'CBT_SCHEDULED';

                                    return (
                                        <tr
                                            key={lead.id}
                                            onClick={() => handleOpenStudentModal(lead)}
                                            className={`hover:bg-blue-50/40 transition-colors cursor-pointer group ${
                                                isChecked ? 'bg-blue-50/60' : ''
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            {/* The cell owns the click (bigger hit area). The input's own onChange
                                                is a no-op so one click never toggles twice (cell + input). */}
                                            <td
                                                className="py-3.5 px-4 text-center"
                                                onClick={(e) => handleToggleBatchCandidate(lead, e)}
                                                title={isOtherClass ? `Only Grade ${selectionGrade} students can be added to this batch` : undefined}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {}}
                                                    aria-disabled={isOtherClass}
                                                    className={`w-4 h-4 rounded accent-blue-600 ${
                                                        isOtherClass ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                                                    }`}
                                                />
                                            </td>

                                            {/* Student & ID (Dual Palette Initial Avatars) */}
                                            <td className="py-3.5 px-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${getAvatarClasses(lead, idx)}`}>
                                                        {lead.student?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-heading block group-hover:text-blue-700 transition-colors">
                                                            {lead.student}
                                                        </span>
                                                        <span className="text-[10px] text-gray font-mono">
                                                            {lead.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Parent & Phone */}
                                            <td className="py-3.5 px-3">
                                                <div className="text-xs text-heading font-medium">
                                                    {lead.parent}
                                                </div>
                                                <div className="text-[11px] text-gray flex items-center gap-1 mt-0.5">
                                                    <PhoneIcon className="w-3 h-3 text-gray" />
                                                    <span>{lead.phone}</span>
                                                </div>
                                            </td>

                                            {/* Target Grade (Color-Coded by Level) */}
                                            <td className="py-3.5 px-3">
                                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${getGradeBadgeStyle(lead.grade)}`}>
                                                    Grade {lead.grade}
                                                </span>
                                                <div className="text-[10px] text-gray mt-0.5">
                                                    Tests Gr {Number(lead.grade) > 5 ? Number(lead.grade) - 1 : 5} Syllabus
                                                </div>
                                            </td>

                                            {/* Status & Schedule */}
                                            <td className="py-3.5 px-3">
                                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStageBadgeClasses(lead.stage)}`}>
                                                    {STAGE_LABELS[lead.stage] || lead.stage}
                                                </span>
                                                <div className="text-[10px] text-gray mt-0.5">
                                                    {lead.due ? formatDateTime(lead.due) : 'Not scheduled'}
                                                </div>
                                            </td>

                                            {/* Test Paper & Syllabus */}
                                            <td className="py-3.5 px-3">
                                                {lead.testPaper ? (
                                                    <div className="flex items-center gap-1.5 text-xs text-green font-bold">
                                                        <CheckIcon className="w-3.5 h-3.5 text-green" />
                                                        <span>Paper Ready ({lead.testPaper.totalQuestions} Qs)</span>
                                                    </div>
                                                ) : lead.testConfig ? (
                                                    <span className="text-[11px] font-bold text-blue-700">
                                                        Portion Set ({lead.testConfig.summaryLabel})
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-gray">
                                                        Standard Syllabus
                                                    </span>
                                                )}
                                                <div className="text-[10px] text-gray mt-0.5 truncate max-w-xs">
                                                    {lead.lastOutcome || lead.nextAction}
                                                </div>
                                            </td>

                                            {/* Actions (Orange for Ready, Blue for Scheduled, Green for Completed) */}
                                            <td className="py-3.5 px-4 text-right">
                                                <div
                                                    className="inline-flex items-center gap-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenStudentModal(lead)}
                                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                                                            isReady
                                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                                : isScheduled
                                                                ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                        }`}
                                                    >
                                                        {isReady ? 'Manage' : isScheduled ? 'Details' : 'Scorecard'}
                                                    </button>
                                                    <WhatsAppContactButton
                                                        phoneNumber={lead.phone}
                                                        studentName={lead.student}
                                                        parentName={lead.parent}
                                                        customMessage={customWaMsg}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-3 bg-[#F8FAFC] border-t border-disabled/60 flex items-center justify-between text-xs text-gray">
                    <div>
                        Showing <strong className="text-heading">{currentQueue.length}</strong> of{' '}
                        <strong className="text-heading">{leads.length}</strong> total candidates
                    </div>
                    <div className="text-[11px]">
                        Tip: Click anywhere on a candidate row to open their complete CBT management modal.
                    </div>
                </div>
            </div>

            {/* MODAL 1: Single Student Complete Details Popup */}
            <SingleStudentCBTModal
                isOpen={Boolean(singleStudentModalLead)}
                onClose={() => setSingleStudentModalLead(null)}
                lead={activeSingleLead}
                onSaveCBTAction={onSaveCBTAction}
                onOpenSyllabusModal={(lead) => handleOpenSyllabusModalForLead(lead)}
                onOpenTestModal={(lead) => handleOpenTestModalForLead(lead)}
            />

            {/* MODAL 2: CBT Syllabus Portion Selector Modal */}
            <CBTSyllabusModal
                isOpen={isSyllabusModalOpen}
                onClose={() => setIsSyllabusModalOpen(false)}
                targetGrade={modalTargetGrade}
                candidates={modalCandidates}
                onSavePortion={handleSavePortion}
            />

            {/* MODAL 3: CBT Test Paper Preview & Link Modal */}
            <CBTTestModal
                isOpen={isTestModalOpen}
                onClose={() => setIsTestModalOpen(false)}
                testPaper={activeTestPaper}
                candidate={testModalCandidate}
                onAttachToCandidate={handleAttachTestPaper}
            />
        </div>
    );
}
