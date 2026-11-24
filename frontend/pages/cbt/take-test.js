import React, { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { CBT_QUESTION_BANK } from '@components/Admin/LeadManagement/cbtQuestionBank';
import { getRecommendedSpecs } from '@components/Admin/LeadManagement/testGenerator';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Authentic Acadza CBT Test Runner (/cbt/take-test)
 *
 * Implemented to replicate the authentic, high-stakes examination testing engine
 * from the reference architecture:
 * 1. Test bench background (#edece8) with crisp, bordered question paper sheet (#fff, border #d8d8d8).
 * 2. Monospace digital countdown timer with low-time warning.
 * 3. Subject section tabs with live question count.
 * 4. Authentic Acadza option blocks (.cbt-opt) with circular letter keys and signature orange (#E06A19) active states.
 * 5. Authentic Question Palette:
 *    - Status summary table (Status, Qs, Counted) with evaluation metric.
 *    - 5-color NTA/JEE numeric matrix grid (Answered #E06A19, Answered & Marked #7C3AED, Marked Later #EFAD4D, Not Answered #D8D8D8, Current #2563EB).
 * 6. Sticky bottom action bar in signature warm cream (#FEFBF0) with Mark for Later toggle, Clear, Previous, Skip, and Save & Next / Save & Finish.
 * 7. Zero emojis: pure vector SVG icons throughout.
 */
export default function TakeCBTTestPage() {
    const router = useRouter();
    const { testId, studentId } = router.query;

    // Test lifecycle: 'loading' | 'welcome' | 'in_progress' | 'submitting' | 'result'
    const [testState, setTestState] = useState('welcome');
    const [testPaper, setTestPaper] = useState(null);
    const [candidate, setCandidate] = useState(null);

    // Question runner state
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { [qIdx]: 'A' | 'B' | 'C' | 'D' }
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
    const [activeSubjectTab, setActiveSubjectTab] = useState('ALL');

    // Timer state
    const [secondsRemaining, setSecondsRemaining] = useState(3600);
    const timerRef = useRef(null);

    // Modal state
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [testResult, setTestResult] = useState(null);

    // Load or reconstruct test paper from query params or database
    useEffect(() => {
        if (!router.isReady) return;

        async function initTest() {
            let loadedCandidate = null;

            // 1. Fetch candidate and attached test paper if studentId provided
            if (studentId) {
                try {
                    const res = await axios.get(`${API_URL}/admin/leads/cbt/test-paper/${studentId}`);
                    if (res.data && res.data.isSuccessful) {
                        if (res.data.candidate) {
                            loadedCandidate = res.data.candidate;
                            setCandidate(res.data.candidate);
                        }
                        if (res.data.testPaper) {
                            setTestPaper(res.data.testPaper);
                            setSecondsRemaining(res.data.testPaper.durationMinutes * 60);
                            return;
                        }
                    }
                } catch (e) {
                    console.warn('Could not fetch test paper from backend:', e.message);
                }
            }

            // 2. Otherwise generate / reconstruct from testId and candidate's target grade
            const targetGrade = loadedCandidate?.grade || (testId ? testId.split('-')[1] : '6') || '6';
            const specs = getRecommendedSpecs(targetGrade);

            // Pull questions appropriate for this grade's prerequisite syllabus
            const questions = CBT_QUESTION_BANK.filter((q) => String(q.testGrade) === String(specs.testGrade));
            const selectedQuestions = questions.length > 0 ? questions : CBT_QUESTION_BANK.slice(0, 10);

            const reconstructedPaper = {
                testId: testId || `CBT-${targetGrade}-DEMO`,
                title: `Grade ${targetGrade} Admission Entrance Assessment`,
                targetGrade: String(targetGrade),
                testGrade: specs.testGrade,
                syllabusLabel: `Grade ${specs.testGrade} Curriculum (Prerequisite Standard)`,
                durationMinutes: specs.durationMinutes,
                totalQuestions: selectedQuestions.length,
                totalMarks: selectedQuestions.reduce((acc, q) => acc + (q.marks || specs.marksPerQ || 1), 0),
                marksPerQ: specs.marksPerQ,
                negPerQ: specs.negPerQ,
                questions: selectedQuestions,
            };

            setTestPaper(reconstructedPaper);
            setSecondsRemaining(specs.durationMinutes * 60);
        }

        initTest();
    }, [router.isReady, testId, studentId]);

    // Timer countdown
    useEffect(() => {
        if (testState !== 'in_progress') return;

        timerRef.current = setInterval(() => {
            setSecondsRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleFinalSubmit(); // Auto-submit on time expiry
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [testState]);

    const formatTimer = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const questions = testPaper?.questions || [];
    const currentQ = questions[currentIdx] || null;

    // Distinct subjects in this test
    const subjects = useMemo(() => {
        const set = new Set();
        questions.forEach((q) => {
            if (q.subjectName) set.add(q.subjectName);
        });
        return Array.from(set);
    }, [questions]);

    // Filter questions if user selects a specific subject tab
    const filteredQuestionIndices = useMemo(() => {
        if (activeSubjectTab === 'ALL') {
            return questions.map((_, idx) => idx);
        }
        return questions
            .map((q, idx) => (q.subjectName === activeSubjectTab ? idx : null))
            .filter((idx) => idx !== null);
    }, [questions, activeSubjectTab]);

    // Track visited questions & navigate
    const handleSelectQuestion = (idx) => {
        if (idx < 0 || idx >= questions.length) return;
        setCurrentIdx(idx);
        setVisitedQuestions((prev) => new Set([...prev, idx]));
    };

    const handleSelectOption = (key) => {
        setAnswers((prev) => ({
            ...prev,
            [currentIdx]: key,
        }));
    };

    const handleClearResponse = () => {
        setAnswers((prev) => {
            const next = { ...prev };
            delete next[currentIdx];
            return next;
        });
    };

    const handleToggleMarkForReview = () => {
        setMarkedForReview((prev) => {
            const next = new Set(prev);
            if (next.has(currentIdx)) {
                next.delete(currentIdx);
            } else {
                next.add(currentIdx);
            }
            return next;
        });
    };

    const handleNext = () => {
        if (currentIdx < questions.length - 1) {
            handleSelectQuestion(currentIdx + 1);
        } else {
            setIsSubmitModalOpen(true);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            handleSelectQuestion(currentIdx - 1);
        }
    };

    // Calculate question status: 'answered' | 'answered_marked' | 'marked' | 'unanswered' | 'not_visited'
    const getQuestionStatus = (idx) => {
        const isAnswered = answers[idx] !== undefined;
        const isMarked = markedForReview.has(idx);

        if (isAnswered && isMarked) return 'answered_marked';
        if (isAnswered) return 'answered';
        if (isMarked) return 'marked';
        if (visitedQuestions.has(idx)) return 'unanswered';
        return 'not_visited';
    };

    // Palette metrics matching authentic Acadza summary logic
    const stats = useMemo(() => {
        let answered = 0;
        let answeredMarked = 0;
        let markedOnly = 0;
        let unanswered = 0;
        let notVisited = 0;

        questions.forEach((_, idx) => {
            const s = getQuestionStatus(idx);
            if (s === 'answered') answered++;
            else if (s === 'answered_marked') answeredMarked++;
            else if (s === 'marked') markedOnly++;
            else if (s === 'unanswered') unanswered++;
            else notVisited++;
        });

        const total = questions.length;
        const evaluatedCount = answered + answeredMarked;

        return {
            answered,
            answeredMarked,
            markedOnly,
            unanswered,
            notVisited,
            total,
            evaluatedCount,
        };
    }, [questions, answers, markedForReview, visitedQuestions]);

    // Handle test grading & submission
    const handleFinalSubmit = async () => {
        setIsSubmitModalOpen(false);
        setTestState('submitting');
        if (timerRef.current) clearInterval(timerRef.current);

        let totalScore = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let unattemptedCount = 0;
        const breakdownBySubject = {};

        questions.forEach((q, idx) => {
            const studentAns = answers[idx];
            const isCorrect = studentAns === q.correctOption;
            const marksForQ = q.marks || testPaper?.marksPerQ || 1;
            const negForQ = q.negativeMarks || testPaper?.negPerQ || 0;

            const sName = q.subjectName || 'General';
            if (!breakdownBySubject[sName]) {
                breakdownBySubject[sName] = { total: 0, correct: 0, score: 0, maxScore: 0 };
            }
            breakdownBySubject[sName].total += 1;
            breakdownBySubject[sName].maxScore += marksForQ;

            if (studentAns === undefined) {
                unattemptedCount += 1;
            } else if (isCorrect) {
                correctCount += 1;
                totalScore += marksForQ;
                breakdownBySubject[sName].correct += 1;
                breakdownBySubject[sName].score += marksForQ;
            } else {
                incorrectCount += 1;
                totalScore -= negForQ;
                breakdownBySubject[sName].score -= negForQ;
            }
        });

        const totalMarks = testPaper?.totalMarks || 30;
        const scorePercentage = Math.max(0, Math.round((totalScore / totalMarks) * 100));

        const resultObj = {
            testId: testPaper?.testId || 'CBT-SUBMITTED',
            studentId: candidate?.id || candidate?.leadId || studentId || 'GUEST',
            studentName: candidate?.student || 'Prospective Candidate',
            targetGrade: testPaper?.targetGrade,
            testGrade: testPaper?.testGrade,
            score: totalScore,
            totalMarks,
            percentage: scorePercentage,
            correctCount,
            incorrectCount,
            unattemptedCount,
            totalQuestions: questions.length,
            timeSpentSeconds: ((testPaper?.durationMinutes || 60) * 60) - secondsRemaining,
            breakdownBySubject,
            submittedAt: new Date().toISOString(),
        };

        setTestResult(resultObj);

        // Sync with MongoDB Atlas lead record (using public candidate endpoint)
        const targetStudentId = candidate?.id || candidate?.leadId || studentId;
        if (targetStudentId) {
            try {
                await axios.post(`${API_URL}/admin/leads/cbt/submit-test`, {
                    studentId: targetStudentId,
                    testId: testPaper.testId,
                    clientResult: resultObj,
                });
            } catch (err) {
                console.warn('Failed to sync CBT result with Atlas:', err.message);
            }
        }

        setTestState('result');
    };

    // =========================================================================
    // SCREEN 1: WELCOME SCREEN (Authentic Acadza Portal)
    // =========================================================================
    if (testState === 'welcome') {
        return (
            <div className="min-h-screen bg-[#edece8] flex flex-col justify-between font-sans select-none">
                <Head>
                    <title>Online Assessment | Acadza Entrance Examination</title>
                </Head>

                {/* Top Banner */}
                <header className="bg-white border-b border-[#d8d8d8] px-6 py-3 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[#E06A19] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                            A
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[#1f2937] tracking-tight">Acadza Assessment Portal</div>
                            <div className="text-[11px] text-gray-500 font-medium">Computer Based Entrance Examination (CBT)</div>
                        </div>
                    </div>

                    {candidate && (
                        <div className="text-right">
                            <div className="text-xs font-bold text-[#1f2937]">{candidate.student}</div>
                            <div className="text-[11px] text-gray-500 font-mono">Candidate ID: {candidate.id || candidate.leadId}</div>
                        </div>
                    )}
                </header>

                <main className="max-w-2xl mx-auto p-4 sm:p-6 w-full flex-1 flex flex-col justify-center">
                    <div className="bg-white border border-[#d8d8d8] rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="border-b border-[#eceae4] pb-5 space-y-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E06A19]/10 text-[#E06A19] border border-[#E06A19]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E06A19]" />
                                Official Entrance Assessment
                            </span>
                            <h1 className="text-2xl font-bold text-[#1f2937] tracking-tight">
                                {testPaper?.title || 'Entrance Assessment'}
                            </h1>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Diagnostic examination for <strong>Grade {testPaper?.targetGrade || '7'} Admission</strong>. Mapped strictly to the core competencies of <strong>{testPaper?.syllabusLabel}</strong>.
                            </p>
                        </div>

                        {/* Quick Spec Matrix */}
                        <div className="grid grid-cols-3 gap-3 bg-[#f8f7f4] p-4 rounded-lg border border-[#e5dec9] text-center">
                            <div>
                                <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Duration</div>
                                <div className="text-lg font-black text-[#1f2937] mt-0.5">{testPaper?.durationMinutes || 60} Mins</div>
                            </div>
                            <div>
                                <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Questions</div>
                                <div className="text-lg font-black text-[#1f2937] mt-0.5">{testPaper?.totalQuestions || 30} Qs</div>
                            </div>
                            <div>
                                <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Total Marks</div>
                                <div className="text-lg font-black text-[#E06A19] mt-0.5">{testPaper?.totalMarks || 30} Marks</div>
                            </div>
                        </div>

                        {/* Test Instructions */}
                        <div className="space-y-2 text-xs text-gray-700 bg-[#fbfbfc] border border-[#d8d8d8] p-4 rounded-lg">
                            <div className="font-bold text-[#1f2937] uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                General Instructions:
                            </div>
                            <ul className="list-disc pl-4 space-y-1 leading-relaxed text-gray-600">
                                <li>The countdown clock at the top will automatically submit your test when time expires.</li>
                                <li>Use <strong>Save & Next</strong> to preserve your selected answer and proceed to the next question.</li>
                                <li>Use <strong>Mark for Later</strong> to flag questions you want to revisit before submitting.</li>
                                <li>Jump to any question at any time using the <strong>Question Palette</strong> on the right.</li>
                            </ul>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setTestState('in_progress');
                                    setVisitedQuestions(new Set([0]));
                                }}
                                className="w-full sm:w-auto px-8 py-3 bg-[#E06A19] hover:bg-[#c85a10] text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer text-sm flex items-center justify-center gap-2"
                            >
                                <span>Start Assessment Now</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="py-4 text-center text-xs text-gray-500 border-t border-[#d8d8d8] bg-white">
                    Acadza Assessment Engine &bull; System Verified & Protected
                </footer>
            </div>
        );
    }

    // =========================================================================
    // SCREEN 2: POST-SUBMISSION SCORECARD
    // =========================================================================
    if (testState === 'result' && testResult) {
        return (
            <div className="min-h-screen bg-[#edece8] flex flex-col justify-between font-sans">
                <Head>
                    <title>Assessment Scorecard | Acadza Entrance</title>
                </Head>

                <header className="bg-white border-b border-[#d8d8d8] px-6 py-3 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[#27AE60] text-white font-bold flex items-center justify-center text-base">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[#1f2937] tracking-tight">Acadza Assessment Portal</div>
                            <div className="text-[11px] text-gray-500 font-medium">Entrance Assessment Result & Scorecard</div>
                        </div>
                    </div>
                </header>

                <main className="max-w-3xl mx-auto p-4 sm:p-6 w-full flex-1">
                    <div className="bg-white border border-[#d8d8d8] rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="text-center space-y-1.5 border-b border-[#eceae4] pb-5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Assessment Submitted & Evaluated
                            </span>
                            <h1 className="text-2xl font-bold text-[#1f2937]">
                                Entrance Performance Summary
                            </h1>
                            <p className="text-xs text-gray-600">
                                Candidate: <strong>{testResult.studentName}</strong> &bull; Grade <strong>{testResult.targetGrade}</strong> Admission
                            </p>
                        </div>

                        {/* Top Score Banner */}
                        <div className="bg-[#1f2937] text-white p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
                            <div>
                                <div className="text-xs uppercase font-semibold tracking-wider text-gray-400">Total Marks Scored</div>
                                <div className="text-4xl font-extrabold mt-1 text-white">
                                    {testResult.score} <span className="text-xl text-gray-400 font-normal">/ {testResult.totalMarks}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Evaluated on Grade {testResult.testGrade} Prerequisite Syllabus
                                </div>
                            </div>
                            <div className="bg-white/10 px-6 py-4 rounded-lg border border-white/15 text-center">
                                <div className="text-xs uppercase font-semibold text-gray-300">Accuracy Score</div>
                                <div className="text-3xl font-extrabold mt-0.5 text-white">{testResult.percentage}%</div>
                                <div className="text-[10px] text-[#27AE60] font-bold uppercase mt-1">
                                    {testResult.percentage >= 60 ? 'Recommended for Admission' : 'Diagnostic Complete'}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 text-center text-xs">
                            <div className="p-3 bg-green-50/70 border border-green-200 rounded-lg">
                                <div className="font-semibold text-green-800">Correct</div>
                                <div className="text-2xl font-bold text-green-700 mt-0.5">{testResult.correctCount}</div>
                            </div>
                            <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                                <div className="font-semibold text-red-800">Incorrect</div>
                                <div className="text-2xl font-bold text-red-600 mt-0.5">{testResult.incorrectCount}</div>
                            </div>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="font-semibold text-gray-700">Unattempted</div>
                                <div className="text-2xl font-bold text-gray-700 mt-0.5">{testResult.unattemptedCount}</div>
                            </div>
                        </div>

                        {/* Subject Breakdown */}
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Subject Breakdown</h3>
                            <div className="divide-y divide-[#eceae4] border border-[#d8d8d8] rounded-lg overflow-hidden bg-white">
                                {Object.entries(testResult.breakdownBySubject).map(([subj, data]) => (
                                    <div key={subj} className="p-3.5 flex items-center justify-between text-xs">
                                        <div>
                                            <div className="font-bold text-[#1f2937]">{subj}</div>
                                            <div className="text-[11px] text-gray-500">
                                                {data.correct} of {data.total} correct
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-[#1f2937]">{data.score} / {data.maxScore} Marks</div>
                                            <div className="text-[11px] text-gray-500">
                                                {data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Record Notice */}
                        <div className="p-3.5 bg-[#fbfbfc] rounded-lg border border-[#d8d8d8] text-xs text-gray-600 flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                            <span>
                                This test record has been synchronized with candidate profile #{testResult.studentId} in the school admissions portal.
                            </span>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // =========================================================================
    // SCREEN 3: ACTIVE TEST ENGINE RUNNER (Authentic Acadza CBT Shell)
    // =========================================================================
    const isLastQuestion = currentIdx === questions.length - 1;
    const isCurrentMarked = markedForReview.has(currentIdx);
    const hasCurrentAnswer = answers[currentIdx] !== undefined;

    return (
        <div className="min-h-screen bg-[#edece8] flex flex-col font-sans select-none text-[#1f2937]">
            <Head>
                <title>{testPaper?.title || 'CBT Assessment'} | Acadza</title>
            </Head>

            {/* Embedded CBT option styling matching reference cbt_client.css */}
            <style jsx global>{`
                .cbt-opt {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 10px 14px;
                    min-height: 48px;
                    border: 1.5px solid #d8d8d8;
                    border-radius: 10px;
                    background: #fff;
                    cursor: pointer;
                    transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
                }
                .cbt-opt:hover {
                    border-color: rgba(224, 106, 25, 0.7);
                    background: rgba(224, 106, 25, 0.03);
                }
                .cbt-opt.is-on {
                    border-color: #E06A19 !important;
                    background: rgba(224, 106, 25, 0.07) !important;
                    box-shadow: inset 0 0 0 1px #E06A19 !important;
                }
                .cbt-opt__key {
                    flex: 0 0 auto;
                    width: 30px;
                    height: 30px;
                    margin-top: 1px;
                    border-radius: 50%;
                    border: 1.5px solid #bdbdbd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                    color: #4b5563;
                    background: #fff;
                    transition: all .15s ease;
                }
                .cbt-opt.is-on .cbt-opt__key {
                    background: #E06A19 !important;
                    border-color: #E06A19 !important;
                    color: #fff !important;
                }
            `}</style>

            {/* Top Bar Banner */}
            <header className="bg-white border-b border-[#d8d8d8] px-4 md:px-6 py-2.5 sticky top-0 z-30 flex items-center justify-between shadow-xs">
                {/* Brand & Candidate Info */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#E06A19] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                        A
                    </div>
                    <div>
                        <div className="text-xs font-bold text-[#1f2937] leading-tight">{testPaper?.title}</div>
                        <div className="text-[11px] text-gray-500 font-medium">
                            Candidate: <span className="font-semibold text-gray-700">{candidate?.student || 'Prospective Student'}</span>
                            {candidate?.id && <span className="text-gray-400 font-mono ml-1">({candidate.id})</span>}
                        </div>
                    </div>
                </div>

                {/* Center Monospace Countdown Timer */}
                <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-md border font-mono font-bold text-xs sm:text-sm flex items-center gap-2 ${
                        secondsRemaining < 300
                            ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                            : 'bg-[#f4f3ef] text-[#1f2937] border-[#d8d8d8]'
                    }`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Time Left: {formatTimer(secondsRemaining)}</span>
                    </div>
                </div>

                {/* Right Action: Finish Test Button (Authentic Acadza Style #E0A800 / #8A5709) */}
                <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="shrink-0 inline-flex items-center gap-1.5 min-h-[34px] px-3.5 py-1 rounded-md border border-[#E0A800] text-[#8A5709] bg-[#FFF8E7] hover:bg-[#E0A800]/20 text-xs font-bold transition-colors cursor-pointer"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 21V4h9l.6 2H20v9h-6l-.6-2H5" />
                    </svg>
                    <span>Finish Test</span>
                </button>
            </header>

            {/* Subject Section Tab Bar */}
            <div className="w-full bg-[#f8f7f4] border-b border-[#d8d8d8] px-4 md:px-6 py-1.5">
                <div className="max-w-[1400px] mx-auto flex items-center gap-2 overflow-x-auto text-xs">
                    <button
                        type="button"
                        onClick={() => setActiveSubjectTab('ALL')}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                            activeSubjectTab === 'ALL'
                                ? 'bg-[#1f2937] text-white'
                                : 'text-gray-600 hover:bg-[#edece8] hover:text-black'
                        }`}
                    >
                        All Subjects ({questions.length})
                    </button>
                    {subjects.map((subj) => {
                        const count = questions.filter((q) => q.subjectName === subj).length;
                        const isActive = activeSubjectTab === subj;
                        return (
                            <button
                                key={subj}
                                type="button"
                                onClick={() => setActiveSubjectTab(subj)}
                                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                                    isActive
                                        ? 'bg-[#E06A19] text-white'
                                        : 'text-gray-600 hover:bg-[#edece8] hover:text-black'
                                }`}
                            >
                                <span>{subj}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Exam Workspace */}
            <div className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-5 items-stretch pb-24">
                {/* Left: Active Question Paper Sheet */}
                <div className="flex-1 min-w-0 bg-white border border-[#d8d8d8] rounded-xl p-5 sm:p-7 shadow-xs flex flex-col justify-between">
                    {currentQ ? (
                        <div className="space-y-5">
                            {/* Question Header Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#eceae4]">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-sm font-bold text-[#1f2937]">
                                        Question No. {currentIdx + 1}
                                    </span>
                                    <span className="text-[11px] font-semibold text-gray-500 bg-[#f4f3ef] border border-[#d8d8d8] px-2 py-0.5 rounded">
                                        Single Choice (SCQ)
                                    </span>
                                    <span className="text-xs text-gray-500 hidden sm:inline">
                                        &bull; {currentQ.subjectName} ({currentQ.chapterName})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                        +{currentQ.marks || 1}.00
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                        -0.00
                                    </span>
                                </div>
                            </div>

                            {/* Question Statement */}
                            <div className="text-base sm:text-[17px] font-medium text-[#1f2937] leading-relaxed pt-1">
                                {currentQ.questionText}
                            </div>

                            {/* Clickable Option Blocks (.cbt-opt) */}
                            <div className="space-y-2.5 pt-2">
                                {currentQ.options.map((opt) => {
                                    const isSelected = answers[currentIdx] === opt.key;
                                    return (
                                        <div
                                            key={opt.key}
                                            onClick={() => handleSelectOption(opt.key)}
                                            className={`cbt-opt ${isSelected ? 'is-on' : ''}`}
                                        >
                                            <span className="cbt-opt__key">
                                                {opt.key}
                                            </span>
                                            <div className="text-[15.5px] leading-relaxed text-[#1f2937] pt-0.5 font-normal flex-1">
                                                {opt.text}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center text-gray-400">No question selected.</div>
                    )}
                </div>

                {/* Right: Authentic Acadza Question Palette Matrix */}
                <div className="w-full md:w-[320px] lg:w-[340px] shrink-0 bg-[#FBFBFC] border border-[#d8d8d8] rounded-xl p-4 shadow-xs flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b border-[#eceae4] pb-2">
                        <h3 className="text-xs font-bold text-[#1f2937] uppercase tracking-wider">Choose a Question</h3>
                        <span className="text-[11px] text-gray-500 font-medium">{stats.total} Total Questions</span>
                    </div>

                    {/* Authentic Status Summary Table (From Acadza Reference) */}
                    <div className="w-full rounded-lg border border-[#d8d8d8] overflow-hidden bg-white text-xs shadow-2xs">
                        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-3 py-2 bg-[#f4f3ef] border-b border-[#d8d8d8]">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Status</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold text-right w-8">Qs</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold text-right w-14">Counted</span>
                        </div>
                        <div className="divide-y divide-[#eceae4] text-[11px]">
                            {/* Answered */}
                            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center px-3 py-1.5">
                                <span className="flex items-center gap-2 min-w-0">
                                    <span className="w-3 h-3 rounded-full shrink-0 bg-[#E06A19]" />
                                    <span className="truncate font-medium text-gray-800">Answered</span>
                                </span>
                                <span className="font-bold text-right w-8 tabular-nums text-gray-900">{stats.answered}</span>
                                <span className="text-right w-14 font-bold text-green-600">Yes</span>
                            </div>
                            {/* Answered & Marked */}
                            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center px-3 py-1.5">
                                <span className="flex items-center gap-2 min-w-0">
                                    <span className="w-3 h-3 rounded-full shrink-0 bg-[#7C3AED]" />
                                    <span className="truncate font-medium text-gray-800">Answered & Marked</span>
                                </span>
                                <span className="font-bold text-right w-8 tabular-nums text-gray-900">{stats.answeredMarked}</span>
                                <span className="text-right w-14 font-bold text-green-600">Yes</span>
                            </div>
                            {/* Marked, no answer */}
                            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center px-3 py-1.5">
                                <span className="flex items-center gap-2 min-w-0">
                                    <span className="w-3 h-3 rounded-full shrink-0 bg-[#EFAD4D]" />
                                    <span className="truncate font-medium text-gray-800">Marked Later</span>
                                </span>
                                <span className="font-bold text-right w-8 tabular-nums text-gray-900">{stats.markedOnly}</span>
                                <span className="text-right w-14 font-semibold text-gray-400">No</span>
                            </div>
                            {/* Not Attempted */}
                            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center px-3 py-1.5">
                                <span className="flex items-center gap-2 min-w-0">
                                    <span className="w-3 h-3 rounded-full shrink-0 bg-[#D8D8D8]" />
                                    <span className="truncate font-medium text-gray-800">Not Attempted</span>
                                </span>
                                <span className="font-bold text-right w-8 tabular-nums text-gray-900">{stats.unanswered + stats.notVisited}</span>
                                <span className="text-right w-14 font-semibold text-gray-400">No</span>
                            </div>
                        </div>
                        {/* Summary Footer: Will be evaluated */}
                        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center px-3 py-2 border-t border-[#d8d8d8] bg-[#f4f3ef]">
                            <span className="font-bold text-[#1f2937] text-[11px]">Will be evaluated</span>
                            <span className="font-extrabold text-right w-8 tabular-nums text-green-600 text-xs">
                                {stats.evaluatedCount}
                            </span>
                            <span className="text-gray-500 text-right w-14 tabular-nums text-[10px]">
                                of {stats.total}
                            </span>
                        </div>
                    </div>

                    {/* Numeric Question Grid (5 columns of authentic circular buttons) */}
                    <div className="flex-1">
                        <div className="grid grid-cols-5 gap-2 max-h-[340px] overflow-y-auto p-1 bg-white border border-[#d8d8d8] rounded-lg">
                            {questions.map((_, idx) => {
                                const status = getQuestionStatus(idx);
                                const isCurrent = idx === currentIdx;

                                let bgClass = 'bg-[#D8D8D8] text-[#4b5563]';
                                if (status === 'answered') {
                                    bgClass = 'bg-[#E06A19] text-white';
                                } else if (status === 'answered_marked') {
                                    bgClass = 'bg-[#7C3AED] text-white ring-2 ring-[#E06A19]';
                                } else if (status === 'marked') {
                                    bgClass = 'bg-[#EFAD4D] text-white';
                                } else if (status === 'unanswered') {
                                    bgClass = 'bg-[#D8D8D8] text-[#1f2937] border border-gray-400';
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSelectQuestion(idx)}
                                        className={`w-11 h-11 justify-self-center rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${bgClass} ${
                                            isCurrent ? 'ring-2 ring-[#2563EB] ring-offset-2 scale-105 shadow-sm' : 'hover:opacity-90'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Test Trigger Button */}
                    <button
                        type="button"
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="w-full py-2.5 bg-[#1f2937] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        <span>Submit Assessment</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Bottom Fixed Action Bar (Signature Acadza Warm Cream #FEFBF0) */}
            <footer className="fixed bottom-0 left-0 right-0 bg-[#FEFBF0] border-t border-[#e5dec9] h-18 z-40 flex items-center px-4 md:px-8 shadow-md">
                <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between gap-3">
                    {/* Left Controls: Mark for Later & Clear Response */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={handleToggleMarkForReview}
                            className={`px-3 sm:px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                                isCurrentMarked
                                    ? 'bg-[#EFAD4D] text-white border-[#d89c3c]'
                                    : 'bg-white border-[#d8d8d8] text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={isCurrentMarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                            <span>{isCurrentMarked ? 'Marked for Later' : 'Mark for Later'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleClearResponse}
                            disabled={!hasCurrentAnswer}
                            className="px-3 sm:px-4 py-2 border border-[#d8d8d8] bg-white hover:bg-gray-50 disabled:opacity-40 text-gray-700 text-xs font-bold rounded-md transition-colors cursor-pointer"
                        >
                            Clear Response
                        </button>
                    </div>

                    {/* Right Controls: Previous, Skip Q, Save & Next */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={currentIdx === 0}
                            className="px-3 sm:px-4 py-2 border border-[#d8d8d8] bg-white hover:bg-gray-50 disabled:opacity-40 text-gray-700 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            <span>Previous</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-3 sm:px-4 py-2 border border-[#d8d8d8] bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-md transition-colors cursor-pointer"
                        >
                            Skip Q
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-5 sm:px-6 py-2 bg-[#E06A19] hover:bg-[#c85a10] text-white text-xs font-bold rounded-md shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <span>{isLastQuestion ? 'Save & Finish' : 'Save & Next'}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </footer>

            {/* Test Submission Confirmation Dialog */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-xl p-6 sm:p-7 max-w-md w-full shadow-xl border border-[#d8d8d8] space-y-4">
                        <div className="text-center space-y-1">
                            <h3 className="text-base font-bold text-[#1f2937]">Submit Your Assessment?</h3>
                            <p className="text-xs text-gray-500">
                                Check your response summary below before finalizing your submission.
                            </p>
                        </div>

                        {/* Summary of Responses */}
                        <div className="bg-[#fbfbfc] border border-[#d8d8d8] rounded-lg p-3.5 text-xs space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Questions:</span>
                                <span className="font-bold text-[#1f2937]">{stats.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#E06A19] font-semibold">Answered (Evaluated):</span>
                                <span className="font-bold text-[#E06A19]">{stats.answered}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#7C3AED] font-semibold">Answered & Marked for Review:</span>
                                <span className="font-bold text-[#7C3AED]">{stats.answeredMarked}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#EFAD4D] font-semibold">Marked Later (No Answer):</span>
                                <span className="font-bold text-[#EFAD4D]">{stats.markedOnly}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-semibold">Unattempted:</span>
                                <span className="font-bold text-gray-600">{stats.unanswered + stats.notVisited}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-[#d8d8d8]">
                                <span className="text-gray-600">Time Remaining:</span>
                                <span className="font-mono font-bold text-[#1f2937]">{formatTimer(secondsRemaining)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsSubmitModalOpen(false)}
                                className="flex-1 py-2.5 border border-[#d8d8d8] hover:bg-gray-100 text-gray-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                            >
                                Resume Test
                            </button>
                            <button
                                type="button"
                                onClick={handleFinalSubmit}
                                className="flex-1 py-2.5 bg-[#E06A19] hover:bg-[#c85a10] text-white font-bold rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
                            >
                                Submit & Conclude
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
