import React, { useState, useEffect, useMemo } from 'react';
import {
    getSyllabusForTargetGrade,
    getPresetSelection,
    calculatePortionSummary,
} from './syllabusData';
import { CheckIcon, TestDocIcon } from '../icons';

/**
 * CBTSyllabusModal
 *
 * Low-Cognitive-Load Entrance Test Portion Selector.
 * Artfully balanced with Acadza's Royal Blue & Vibrant Orange palette.
 */
export default function CBTSyllabusModal({
    isOpen,
    targetGrade = '7',
    candidateCount = 1,
    candidateNames = [],
    existingConfig = null,
    onClose,
    onSavePortion,
}) {
    const syllabus = useMemo(() => getSyllabusForTargetGrade(targetGrade), [targetGrade]);

    // Active preset: 'full' | 'core' | 'custom'
    const [preset, setPreset] = useState('full');

    // Selected structure: { [subjectId]: { subjectName, chapters: { [chId]: { chapterName, topics: [] } } } }
    const [selections, setSelections] = useState({});

    // Expanded accordion tracking
    const [expandedSubject, setExpandedSubject] = useState(null);
    const [expandedChapter, setExpandedChapter] = useState(null);

    // Initialize selections when modal opens or targetGrade changes
    useEffect(() => {
        if (!isOpen) return;

        if (existingConfig && existingConfig.selectedSubjects) {
            setSelections(existingConfig.selectedSubjects);
            setPreset(existingConfig.preset || 'custom');
            if (syllabus.subjects.length > 0) {
                setExpandedSubject(syllabus.subjects[0].id);
            }
        } else {
            const initial = getPresetSelection(syllabus, 'full');
            setSelections(initial);
            setPreset('full');
            if (syllabus.subjects.length > 0) {
                setExpandedSubject(syllabus.subjects[0].id);
            }
        }
    }, [isOpen, targetGrade, existingConfig, syllabus]);

    // Live calculated metric summary
    const summary = useMemo(() => calculatePortionSummary(selections), [selections]);

    if (!isOpen) return null;

    // Preset handlers
    const handleApplyPreset = (presetType) => {
        setPreset(presetType);
        if (presetType === 'full' || presetType === 'core') {
            const newSel = getPresetSelection(syllabus, presetType);
            setSelections(newSel);
        }
    };

    // Toggle entire Subject
    const handleToggleSubject = (subject) => {
        setPreset('custom');
        setSelections((prev) => {
            const next = { ...prev };
            if (next[subject.id]) {
                delete next[subject.id];
            } else {
                const chapters = {};
                subject.chapters.forEach((ch) => {
                    chapters[ch.id] = {
                        chapterName: ch.name,
                        topics: [...ch.topics],
                    };
                });
                next[subject.id] = {
                    subjectName: subject.name,
                    chapters,
                };
            }
            return next;
        });
    };

    // Toggle single Chapter
    const handleToggleChapter = (subjectId, subjectName, chapter) => {
        setPreset('custom');
        setSelections((prev) => {
            const next = { ...prev };
            const currentSub = next[subjectId] || { subjectName, chapters: {} };
            const currentChapters = { ...currentSub.chapters };

            if (currentChapters[chapter.id]) {
                delete currentChapters[chapter.id];
            } else {
                currentChapters[chapter.id] = {
                    chapterName: chapter.name,
                    topics: [...chapter.topics],
                };
            }

            if (Object.keys(currentChapters).length === 0) {
                delete next[subjectId];
            } else {
                next[subjectId] = {
                    ...currentSub,
                    chapters: currentChapters,
                };
            }

            return next;
        });
    };

    // Toggle single Topic inside Chapter
    const handleToggleTopic = (subjectId, subjectName, chapter, topicName) => {
        setPreset('custom');
        setSelections((prev) => {
            const next = { ...prev };
            const currentSub = next[subjectId] || { subjectName, chapters: {} };
            const currentChapters = { ...currentSub.chapters };
            const currentCh = currentChapters[chapter.id] || {
                chapterName: chapter.name,
                topics: [],
            };

            const topics = [...currentCh.topics];
            const topicIdx = topics.indexOf(topicName);

            if (topicIdx > -1) {
                topics.splice(topicIdx, 1);
            } else {
                topics.push(topicName);
            }

            if (topics.length === 0) {
                delete currentChapters[chapter.id];
            } else {
                currentChapters[chapter.id] = {
                    ...currentCh,
                    topics,
                };
            }

            if (Object.keys(currentChapters).length === 0) {
                delete next[subjectId];
            } else {
                next[subjectId] = {
                    ...currentSub,
                    chapters: currentChapters,
                };
            }

            return next;
        });
    };

    // Select/Deselect all topics in a chapter
    const handleSelectAllTopicsInChapter = (subjectId, subjectName, chapter, selectAll = true) => {
        setPreset('custom');
        setSelections((prev) => {
            const next = { ...prev };
            const currentSub = next[subjectId] || { subjectName, chapters: {} };
            const currentChapters = { ...currentSub.chapters };

            if (selectAll) {
                currentChapters[chapter.id] = {
                    chapterName: chapter.name,
                    topics: [...chapter.topics],
                };
            } else {
                delete currentChapters[chapter.id];
            }

            if (Object.keys(currentChapters).length === 0) {
                delete next[subjectId];
            } else {
                next[subjectId] = {
                    ...currentSub,
                    chapters: currentChapters,
                };
            }

            return next;
        });
    };

    // Commit payload
    const handleConfirm = () => {
        const payload = {
            targetGrade: String(targetGrade),
            testGrade: syllabus.testGrade,
            preset,
            summaryLabel: summary.summaryLabel,
            subjectCount: summary.subjectCount,
            chapterCount: summary.chapterCount,
            topicCount: summary.topicCount,
            selectedSubjects: selections,
            configuredAt: new Date().toISOString(),
        };

        onSavePortion(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-disabled w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
                {/* 1. Header with Dual Blue & Orange Branding */}
                <div className="p-6 border-b border-disabled/40 bg-gradient-to-r from-blue-50/40 via-white to-orange-50/30">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-[#E06A19] border border-orange-200">
                                    <TestDocIcon className="w-3.5 h-3.5" />
                                    <span>Entrance Assessment Configuration</span>
                                </span>
                                <span className="text-xs text-gray font-medium">
                                    Applying for <strong className="text-heading">Grade {targetGrade}</strong>
                                </span>
                            </div>
                            <h2 className="text-xl font-extrabold text-heading mt-1.5 tracking-tight">
                                Configure CBT Test Portion
                            </h2>
                            <p className="text-xs text-gray mt-1">
                                Standard Rule: Candidates applying for <strong>Grade {targetGrade}</strong> are evaluated on the <strong>Grade {syllabus.testGrade} Syllabus</strong>.
                            </p>
                        </div>

                        {/* Candidate Scope Pill */}
                        <div className="text-right">
                            <span className="inline-block text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
                                {candidateCount} Candidate{candidateCount === 1 ? '' : 's'} Selected
                            </span>
                            {candidateNames.length > 0 && (
                                <div className="text-[11px] text-gray mt-1 max-w-xs truncate">
                                    {candidateNames.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Low-Cognitive-Load Presets Strip */}
                    <div className="mt-4 pt-4 border-t border-disabled/30 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-gray uppercase tracking-wider mr-1">
                                Quick Presets:
                            </span>
                            <button
                                type="button"
                                onClick={() => handleApplyPreset('full')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    preset === 'full'
                                        ? 'bg-[#E06A19] text-white shadow-sm ring-2 ring-orange-300'
                                        : 'bg-white border border-disabled text-heading hover:bg-disabled/20'
                                }`}
                            >
                                Full Standard Syllabus
                            </button>
                            <button
                                type="button"
                                onClick={() => handleApplyPreset('core')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    preset === 'core'
                                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                                        : 'bg-white border border-disabled text-heading hover:bg-disabled/20'
                                }`}
                            >
                                Core STEM Only (Maths + Science)
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreset('custom')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    preset === 'custom'
                                        ? 'bg-heading text-white shadow-sm ring-2 ring-gray-400'
                                        : 'bg-white border border-disabled text-heading hover:bg-disabled/20'
                                }`}
                            >
                                Custom Portion
                            </button>
                        </div>

                        {/* Real-time Counter Badge */}
                        <div className="text-xs font-bold px-3 py-1 rounded-md bg-white border border-disabled text-heading">
                            {summary.summaryLabel}
                        </div>
                    </div>
                </div>

                {/* 3. Progressive Accordion Workspace */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    {syllabus.subjects.map((subject) => {
                        const isSubjectSelected = Boolean(selections[subject.id]);
                        const isExpanded = expandedSubject === subject.id;
                        const subjectChaptersSelected = Object.keys(selections[subject.id]?.chapters || {}).length;
                        const totalChapters = subject.chapters.length;

                        return (
                            <div
                                key={subject.id}
                                className={`border rounded-xl transition-all overflow-hidden ${
                                    isSubjectSelected
                                        ? 'border-orange-300/80 bg-white shadow-xs'
                                        : 'border-disabled bg-disabled/10 opacity-75'
                                }`}
                            >
                                {/* Subject Header Card */}
                                <div className="p-4 flex items-center justify-between gap-3 bg-white">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id={`sub-${subject.id}`}
                                            checked={isSubjectSelected}
                                            onChange={() => handleToggleSubject(subject)}
                                            className="w-4 h-4 accent-[#E06A19] rounded cursor-pointer"
                                        />
                                        <label
                                            htmlFor={`sub-${subject.id}`}
                                            className="text-sm font-extrabold text-heading cursor-pointer flex items-center gap-2"
                                        >
                                            <span>{subject.name}</span>
                                            {subject.isCore && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-[#E06A19] border border-orange-200">
                                                    Core Prerequisite
                                                </span>
                                            )}
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold text-gray">
                                            {subjectChaptersSelected} / {totalChapters} Chapters
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                                        >
                                            {isExpanded ? 'Collapse' : 'Expand'}
                                        </button>
                                    </div>
                                </div>

                                {/* Chapters Body */}
                                {isExpanded && (
                                    <div className="p-4 pt-0 border-t border-disabled/30 bg-[#FBFBFC]">
                                        <div className="space-y-3 pt-3">
                                            {subject.chapters.map((chapter) => {
                                                const chapterObj = selections[subject.id]?.chapters?.[chapter.id];
                                                const isChapterSelected = Boolean(chapterObj);
                                                const isChapterExpanded = expandedChapter === chapter.id;

                                                return (
                                                    <div
                                                        key={chapter.id}
                                                        className={`border rounded-lg transition-all ${
                                                            isChapterSelected
                                                                ? 'border-orange-200 bg-white'
                                                                : 'border-disabled/70 bg-white/50'
                                                        }`}
                                                    >
                                                        <div className="p-3 flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`ch-${chapter.id}`}
                                                                    checked={isChapterSelected}
                                                                    onChange={() =>
                                                                        handleToggleChapter(subject.id, subject.name, chapter)
                                                                    }
                                                                    className="w-3.5 h-3.5 accent-[#E06A19] rounded cursor-pointer"
                                                                />
                                                                <label
                                                                    htmlFor={`ch-${chapter.id}`}
                                                                    className="text-xs font-bold text-heading cursor-pointer"
                                                                >
                                                                    {chapter.name}
                                                                </label>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[11px] text-gray">
                                                                    {chapterObj ? chapterObj.topics.length : 0} / {chapter.topics.length} Topics
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setExpandedChapter(isChapterExpanded ? null : chapter.id)
                                                                    }
                                                                    className="text-[11px] font-bold text-gray hover:text-heading cursor-pointer"
                                                                >
                                                                    {isChapterExpanded ? '▲' : '▼'}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Topics List */}
                                                        {isChapterExpanded && (
                                                            <div className="p-3 pt-1 border-t border-disabled/30 bg-[#F8FAFC]">
                                                                <div className="flex items-center justify-between text-[11px] text-gray mb-2">
                                                                    <span>Select topics to include:</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleSelectAllTopicsInChapter(
                                                                                    subject.id,
                                                                                    subject.name,
                                                                                    chapter,
                                                                                    true
                                                                                )
                                                                            }
                                                                            className="text-[#E06A19] hover:underline font-bold"
                                                                        >
                                                                            All
                                                                        </button>
                                                                        <span>•</span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleSelectAllTopicsInChapter(
                                                                                    subject.id,
                                                                                    subject.name,
                                                                                    chapter,
                                                                                    false
                                                                                )
                                                                            }
                                                                            className="text-alert hover:underline font-bold"
                                                                        >
                                                                            None
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {chapter.topics.map((topic) => {
                                                                        const isTopicActive =
                                                                            chapterObj?.topics?.includes(topic);
                                                                        return (
                                                                            <button
                                                                                type="button"
                                                                                key={topic}
                                                                                onClick={() =>
                                                                                    handleToggleTopic(
                                                                                        subject.id,
                                                                                        subject.name,
                                                                                        chapter,
                                                                                        topic
                                                                                    )
                                                                                }
                                                                                className={`text-[10px] px-2 py-1 rounded-md font-medium transition-colors cursor-pointer border ${
                                                                                    isTopicActive
                                                                                        ? 'bg-orange-50 border-orange-300 text-[#E06A19] font-bold'
                                                                                        : 'bg-disabled/20 border-disabled text-gray hover:text-heading'
                                                                                }`}
                                                                            >
                                                                                {isTopicActive && '✓ '}
                                                                                {topic}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 4. Footer & Confirmation Action */}
                <div className="p-4 border-t border-disabled/40 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-heading">
                        Portion to assign: <strong>{summary.summaryLabel}</strong>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-disabled rounded-lg text-xs font-bold text-gray hover:text-heading hover:bg-disabled/20 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={summary.topicCount === 0}
                            onClick={handleConfirm}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-[#E06A19] hover:bg-[#c85a10] disabled:bg-disabled text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            <CheckIcon className="w-3.5 h-3.5" />
                            <span>
                                Confirm & Assign Portion ({candidateCount} Student{candidateCount === 1 ? '' : 's'})
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
