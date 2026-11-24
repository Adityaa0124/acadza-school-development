import React, { useState, useMemo, useEffect } from 'react';
import { TestDocIcon, ClockIcon, CheckIcon, CopyIcon, UserIcon, ArrowRightIcon, PhoneIcon } from '../icons';
import WhatsAppContactButton from '../WhatsAppContactButton';
import CBTTestModal from './CBTTestModal';
import { getSyllabusForTargetGrade } from './syllabusData';
import { generateTestPaper, buildTestShareUrl, getRecommendedSpecs } from './testGenerator';
import { formatDateTime } from '../constants';

/**
 * Batch CBT Setup & Test Generation Screen.
 * Displays selected candidates of a class in a row, allows configuring a shared test date/venue,
 * selecting the syllabus portion, and creating test papers & individual candidate links all at once.
 * Artfully balances Acadza's Royal Blue and Vibrant Orange palette for visual hierarchy and clarity.
 */
export default function BatchCBTSetupScreen({
    selectedCandidates = [],
    onSaveBatch,
    onBack,
}) {
    // Determine the common grade of the selected candidates
    const targetGrade = selectedCandidates[0]?.grade || '8';
    const syllabus = useMemo(() => getSyllabusForTargetGrade(targetGrade), [targetGrade]);
    const specs = useMemo(() => getRecommendedSpecs(targetGrade), [targetGrade]);

    // Test Schedule & Venue state (applied uniformly to all candidates)
    const [testDateTime, setTestDateTime] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    });
    const [testCenter, setTestCenter] = useState('Campus Computer Lab A (Ground Floor)');
    const [invigilator, setInvigilator] = useState('Prof. S. R. Verma');
    const [assessmentTitle, setAssessmentTitle] = useState(
        `Grade ${targetGrade} Admission Entrance Assessment`
    );

    // Syllabus portion state: Map of subjectId -> Set of chapterIds
    const [selectedChapters, setSelectedChapters] = useState(() => {
        const initial = {};
        syllabus.subjects.forEach((subj) => {
            if (subj.isCore) {
                initial[subj.id] = new Set(subj.chapters.map((ch) => ch.id));
            } else {
                initial[subj.id] = new Set();
            }
        });
        return initial;
    });

    const [preset, setPreset] = useState('core'); // 'all' | 'core' | 'custom'
    const [activeSubjectTab, setActiveSubjectTab] = useState(syllabus.subjects[0]?.id || 'maths');

    // Generated Test Paper state
    const [generatedPaper, setGeneratedPaper] = useState(null);
    const [isTestGenerated, setIsTestGenerated] = useState(false);
    const [copiedStudentId, setCopiedStudentId] = useState('');
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Check if candidates already have an existing test paper attached
    useEffect(() => {
        const existingPaper = selectedCandidates.find((c) => c.testPaper)?.testPaper;
        if (existingPaper) {
            setGeneratedPaper(existingPaper);
            setIsTestGenerated(true);
        }
    }, [selectedCandidates]);

    // Preset handlers
    const applyPreset = (presetType) => {
        setPreset(presetType);
        const updated = {};

        if (presetType === 'all') {
            syllabus.subjects.forEach((subj) => {
                updated[subj.id] = new Set(subj.chapters.map((ch) => ch.id));
            });
        } else if (presetType === 'core') {
            syllabus.subjects.forEach((subj) => {
                if (subj.isCore) {
                    updated[subj.id] = new Set(subj.chapters.map((ch) => ch.id));
                } else {
                    updated[subj.id] = new Set();
                }
            });
        } else if (presetType === 'clear') {
            syllabus.subjects.forEach((subj) => {
                updated[subj.id] = new Set();
            });
            setPreset('custom');
        }

        setSelectedChapters(updated);
    };

    // Toggle single chapter
    const toggleChapter = (subjectId, chapterId) => {
        setPreset('custom');
        setSelectedChapters((prev) => {
            const currentSet = new Set(prev[subjectId] || []);
            if (currentSet.has(chapterId)) {
                currentSet.delete(chapterId);
            } else {
                currentSet.add(chapterId);
            }
            return {
                ...prev,
                [subjectId]: currentSet,
            };
        });
    };

    // Toggle all chapters in a subject
    const toggleSubjectAll = (subjectId) => {
        setPreset('custom');
        const subject = syllabus.subjects.find((s) => s.id === subjectId);
        if (!subject) return;

        setSelectedChapters((prev) => {
            const currentSet = new Set(prev[subjectId] || []);
            const allSelected = subject.chapters.every((ch) => currentSet.has(ch.id));

            if (allSelected) {
                return {
                    ...prev,
                    [subjectId]: new Set(),
                };
            } else {
                return {
                    ...prev,
                    [subjectId]: new Set(subject.chapters.map((ch) => ch.id)),
                };
            }
        });
    };

    // Total selected chapters count across all subjects
    const totalSelectedChaptersCount = useMemo(() => {
        let count = 0;
        Object.values(selectedChapters).forEach((set) => {
            count += set.size;
        });
        return count;
    }, [selectedChapters]);

    // Construct unified testConfig portion object
    const portionConfig = useMemo(() => {
        const selectedSubjects = {};
        let subjectCount = 0;
        let chapterCount = 0;
        let topicCount = 0;

        syllabus.subjects.forEach((subj) => {
            const chSet = selectedChapters[subj.id] || new Set();
            if (chSet.size > 0) {
                subjectCount++;
                const chapters = {};
                subj.chapters.forEach((ch) => {
                    if (chSet.has(ch.id)) {
                        chapterCount++;
                        topicCount += ch.topics.length;
                        chapters[ch.id] = {
                            chapterName: ch.name,
                            topics: [...ch.topics],
                        };
                    }
                });
                selectedSubjects[subj.id] = {
                    subjectName: subj.name,
                    chapters,
                };
            }
        });

        const summaryLabel =
            preset === 'all'
                ? `Full Standard Syllabus (${subjectCount} Subjects, ${chapterCount} Chapters)`
                : preset === 'core'
                ? `Core STEM Syllabus (${subjectCount} Subjects, ${chapterCount} Chapters)`
                : `Custom Portion: ${subjectCount} Subjects, ${chapterCount} Chapters (${topicCount} Topics)`;

        return {
            targetGrade: String(targetGrade),
            testGrade: syllabus.testGrade,
            preset,
            summaryLabel,
            subjectCount,
            chapterCount,
            topicCount,
            selectedSubjects,
            configuredAt: new Date().toISOString(),
        };
    }, [syllabus, selectedChapters, preset, targetGrade]);

    // Handle Create Batch Test for all selected candidates
    const handleCreateBatchTest = () => {
        if (totalSelectedChaptersCount === 0) {
            alert('Please select at least one chapter for the entrance assessment portion.');
            return;
        }

        // 1. Generate master test paper mapped strictly to selected chapters
        const paper = generateTestPaper({
            targetGrade,
            testConfig: portionConfig,
            durationMinutes: specs.durationMinutes,
            title: assessmentTitle,
        });

        setGeneratedPaper(paper);
        setIsTestGenerated(true);

        const scheduledDateISO = new Date(testDateTime).toISOString();
        const formattedDate = formatDateTime(scheduledDateISO);
        const candidateIds = selectedCandidates.map((c) => c.id);

        // 2. Invoke batch save callback to update parent state & MongoDB Atlas
        if (onSaveBatch) {
            onSaveBatch({
                candidateIds,
                testConfig: portionConfig,
                testPaper: paper,
                schedulePayload: {
                    due: scheduledDateISO,
                    outcome: `Batch CBT Scheduled for ${formattedDate} (${testCenter})`,
                    note: `Batch test created for Grade ${targetGrade}. Paper: ${paper.testId}. Duration: ${paper.durationMinutes}m. Questions: ${paper.totalQuestions}. Invigilator: ${invigilator}.`,
                    nextStage: 'CBT_SCHEDULED',
                    nextAction: `Attend CBT Test (${formattedDate}) at ${testCenter}`,
                },
            });
        }

        setSuccessMessage(
            `Successfully created entrance test and scheduled all ${selectedCandidates.length} students!`
        );
        setTimeout(() => setSuccessMessage(''), 8000);
    };

    // Copy student test link
    const handleCopyStudentLink = (studentId) => {
        if (!generatedPaper) return;
        const url = buildTestShareUrl(generatedPaper.testId, studentId);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
            setCopiedStudentId(studentId);
            setTimeout(() => setCopiedStudentId(''), 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Navigation & Dual-Tone Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <button
                        onClick={onBack}
                        className="text-xs font-semibold text-gray hover:text-heading flex items-center gap-1.5 mb-1.5 transition-colors group cursor-pointer"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span>
                        <span>Back to CBT Candidates List</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-[#E06A19]/25">
                            <TestDocIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-black text-heading tracking-tight">
                                    Batch CBT Setup & Test Generation
                                </h1>
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#E06A19] border border-orange-200">
                                    Grade {targetGrade}
                                </span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    {selectedCandidates.length} Students Selected
                                </span>
                            </div>
                            <p className="text-xs text-gray mt-0.5">
                                Set a common test schedule date, select the syllabus portion, and generate entrance tests for all {selectedCandidates.length} students at once.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isTestGenerated && (
                        <button
                            onClick={() => setIsPreviewModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-disabled hover:bg-disabled/20 text-heading text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                            <TestDocIcon className="w-3.5 h-3.5 text-blue-600" />
                            <span>Preview Test Paper</span>
                        </button>
                    )}
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-disabled/30 hover:bg-disabled/60 text-heading text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                        Done & Return
                    </button>
                </div>
            </div>

            {/* Success Notification Banner */}
            {successMessage && (
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                        <span>{successMessage}</span>
                    </div>
                    <button
                        onClick={() => setSuccessMessage('')}
                        className="text-green-700 hover:text-green-900 font-bold ml-4"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* SECTION 1: Selected Students Shown in a Row (Alternating Blue & Orange Avatars) */}
            <div className="bg-white border border-disabled rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-disabled/40">
                    <div>
                        <h2 className="text-sm font-bold text-heading">
                            Selected Students in This Batch ({selectedCandidates.length})
                        </h2>
                        <p className="text-[11px] text-gray mt-0.5">
                            All students in this row will take the entrance test on the same scheduled date and syllabus.
                        </p>
                    </div>
                    {isTestGenerated && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                            <CheckIcon className="w-3 h-3" />
                            Test Links Active
                        </span>
                    )}
                </div>

                {/* Horizontal grid of candidate cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {selectedCandidates.map((cand, idx) => {
                        const testUrl = generatedPaper
                            ? buildTestShareUrl(generatedPaper.testId, cand.id)
                            : '';
                        const isCopied = copiedStudentId === cand.id;
                        const isOrangeAvatar = idx % 2 === 1;

                        // Custom WhatsApp message for candidate
                        const customWaMessage = `Hello ${cand.parent || 'Parent'}, your ward ${cand.student}'s Entrance CBT Test for Class ${cand.grade} at Acadza is scheduled for ${formatDateTime(testDateTime)} at ${testCenter}. Test Duration: ${specs.durationMinutes} Mins. Student Test Link: ${testUrl}`;

                        return (
                            <div
                                key={cand.id}
                                className="p-3.5 rounded-xl border border-disabled/70 bg-[#F8FAFC] hover:border-orange-300 transition-colors flex flex-col justify-between gap-3 shadow-2xs"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                                            isOrangeAvatar
                                                ? 'bg-orange-100 text-[#E06A19] border border-orange-200'
                                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                                        }`}>
                                            {cand.student?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-xs text-heading leading-tight">
                                                {cand.student}
                                            </div>
                                            <div className="text-[10px] text-gray mt-0.5">
                                                {cand.id} • Grade {cand.grade}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-disabled text-gray shrink-0">
                                        {cand.parent}
                                    </span>
                                </div>

                                <div className="text-[11px] text-gray flex items-center justify-between pt-2 border-t border-disabled/40">
                                    <span className="inline-flex items-center gap-1">
                                        <PhoneIcon className="w-3 h-3 text-gray" />
                                        <span>{cand.phone}</span>
                                    </span>
                                    <span className="font-semibold text-heading">
                                        {isTestGenerated ? 'CBT Ready' : 'Awaiting Test'}
                                    </span>
                                </div>

                                {/* Link Copy & WhatsApp Buttons */}
                                {isTestGenerated ? (
                                    <div className="pt-2 border-t border-disabled/40 flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleCopyStudentLink(cand.id)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                                        >
                                            <CopyIcon className="w-3 h-3" />
                                            <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
                                        </button>
                                        <a
                                            href={testUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                                        >
                                            <span>Open in Browser</span>
                                            <ArrowRightIcon className="w-3 h-3" />
                                        </a>
                                        <WhatsAppContactButton
                                            phoneNumber={cand.phone}
                                            studentName={cand.student}
                                            parentName={cand.parent}
                                            customMessage={customWaMessage}
                                            className="flex-1"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-[10px] text-center text-gray/80 py-1 bg-white/60 rounded border border-dashed border-disabled">
                                        Link will generate on Create Test
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 2 & 3: Unified Schedule Date & Syllabus Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (5 cols): Common Schedule Date, Time & Venue (Royal Blue Accent) */}
                <div className="lg:col-span-5 bg-white border border-disabled rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="pb-3 border-b border-disabled/40">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-blue-600" />
                            <h2 className="text-sm font-bold text-heading">
                                1. Unified Schedule & Center
                            </h2>
                        </div>
                        <p className="text-[11px] text-gray mt-0.5">
                            Sets the same date, lab, and invigilator for all {selectedCandidates.length} students.
                        </p>
                    </div>

                    <div className="space-y-3.5 text-xs">
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
                            <p className="text-[10px] text-gray mt-1">
                                Scheduled for: <strong className="text-heading">{formatDateTime(new Date(testDateTime).toISOString())}</strong>
                            </p>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-heading uppercase tracking-wider mb-1">
                                Test Center / Computer Lab *
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
                                Assessment Stream / Title
                            </label>
                            <input
                                type="text"
                                value={assessmentTitle}
                                onChange={(e) => setAssessmentTitle(e.target.value)}
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

                        {/* Test Spec Summary Box */}
                        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs space-y-1.5 mt-4">
                            <div className="font-bold text-blue-900 text-xs">
                                Test Specifications (Grade {targetGrade})
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-950">
                                <div>Standard: <strong>Grade {syllabus.testGrade} Syllabus</strong></div>
                                <div>Duration: <strong>{specs.durationMinutes} Minutes</strong></div>
                                <div>Marking: <strong>+{specs.marksPerQ} / 0 Neg</strong></div>
                                <div>Est. Questions: <strong>{specs.recommendedQuestions} Qs</strong></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (7 cols): Syllabus Portion Selector (Signature Acadza Orange Theme) */}
                <div className="lg:col-span-7 bg-white border border-disabled rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-disabled/40">
                        <div>
                            <div className="flex items-center gap-2">
                                <TestDocIcon className="w-4 h-4 text-[#E06A19]" />
                                <h2 className="text-sm font-bold text-heading">
                                    2. Test Syllabus & Chapters Portion
                                </h2>
                            </div>
                            <p className="text-[11px] text-gray mt-0.5">
                                Admitted to <strong>Grade {targetGrade}</strong> &rarr; Evaluated strictly on <strong>Grade {syllabus.testGrade} Prerequisite Syllabus</strong>.
                            </p>
                        </div>

                        {/* Fast Presets */}
                        <div className="flex items-center gap-1.5 text-xs">
                            <button
                                type="button"
                                onClick={() => applyPreset('all')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                    preset === 'all'
                                        ? 'bg-[#E06A19] text-white shadow-2xs'
                                        : 'bg-disabled/30 text-gray hover:text-heading'
                                }`}
                            >
                                All Chapters
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset('core')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                    preset === 'core'
                                        ? 'bg-[#E06A19] text-white shadow-2xs'
                                        : 'bg-disabled/30 text-gray hover:text-heading'
                                }`}
                            >
                                Core Only
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset('clear')}
                                className="px-2 py-1 rounded-md text-[11px] font-semibold text-gray hover:text-alert hover:bg-alert/10 transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Subject Tabs */}
                    <div className="flex items-center gap-2 border-b border-disabled/40 pb-2 overflow-x-auto text-xs">
                        {syllabus.subjects.map((subj) => {
                            const isCurrent = activeSubjectTab === subj.id;
                            const chCount = selectedChapters[subj.id]?.size || 0;
                            return (
                                <button
                                    key={subj.id}
                                    type="button"
                                    onClick={() => setActiveSubjectTab(subj.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                        isCurrent
                                            ? 'bg-[#E06A19] text-white shadow-2xs'
                                            : 'bg-disabled/20 text-gray hover:text-heading'
                                    }`}
                                >
                                    <span>{subj.name}</span>
                                    <span
                                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                            isCurrent
                                                ? 'bg-white/25 text-white'
                                                : chCount > 0
                                                ? 'bg-orange-100 text-[#E06A19]'
                                                : 'bg-disabled/60 text-gray'
                                        }`}
                                    >
                                        {chCount}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Chapters List for Current Subject */}
                    {(() => {
                        const currentSubj = syllabus.subjects.find((s) => s.id === activeSubjectTab);
                        if (!currentSubj) return null;
                        const chSet = selectedChapters[currentSubj.id] || new Set();

                        return (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-semibold text-gray px-1">
                                    <span>
                                        {chSet.size} of {currentSubj.chapters.length} chapters selected
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => toggleSubjectAll(currentSubj.id)}
                                        className="text-xs font-bold text-[#E06A19] hover:underline cursor-pointer"
                                    >
                                        {chSet.size === currentSubj.chapters.length
                                            ? 'Deselect All'
                                            : 'Select All in Subject'}
                                    </button>
                                </div>

                                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                                    {currentSubj.chapters.map((ch) => {
                                        const isSelected = chSet.has(ch.id);
                                        return (
                                            <div
                                                key={ch.id}
                                                onClick={() => toggleChapter(currentSubj.id, ch.id)}
                                                className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-3 ${
                                                    isSelected
                                                        ? 'bg-orange-50/50 border-[#E06A19]/50 shadow-2xs'
                                                        : 'bg-white border-disabled/70 hover:border-gray'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {}}
                                                    className="w-4 h-4 rounded accent-[#E06A19] mt-0.5 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-bold text-heading text-xs">
                                                        {ch.name}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {ch.topics.map((t, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-[10px] px-2 py-0.5 rounded bg-disabled/30 text-gray"
                                                            >
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Bottom Sticky Action Bar: Create Test for All Students (Acadza Signature Orange CTA) */}
            <div className="sticky bottom-4 z-20 bg-white border border-disabled rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#E06A19] flex items-center justify-center font-bold">
                            <CheckIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-bold text-heading">
                                {selectedCandidates.length} Students • {totalSelectedChaptersCount} Chapters Selected
                            </div>
                            <div className="text-[11px] text-gray">
                                {portionConfig.summaryLabel}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2.5 rounded-xl border border-disabled hover:bg-disabled/20 text-xs font-bold text-heading transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCreateBatchTest}
                        disabled={totalSelectedChaptersCount === 0}
                        className="px-6 py-2.5 rounded-xl bg-[#E06A19] hover:bg-[#c85a10] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <TestDocIcon className="w-4 h-4" />
                        <span>
                            {isTestGenerated
                                ? 'Re-Generate & Update Test for All'
                                : `Create Test for All ${selectedCandidates.length} Students`}
                        </span>
                    </button>
                </div>
            </div>

            {/* CBT Test Paper Preview Modal */}
            <CBTTestModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                testPaper={generatedPaper}
                candidate={selectedCandidates[0]}
                onAttachToCandidate={() => {}}
            />
        </div>
    );
}
