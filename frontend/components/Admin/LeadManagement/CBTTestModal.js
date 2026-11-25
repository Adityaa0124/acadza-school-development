import React, { useState } from 'react';
import { CopyIcon, CheckIcon, TestDocIcon, WhatsAppIcon } from '../icons';
import { buildTestShareUrl } from './testGenerator';
import { downloadTestPdf } from './testPdf';

/**
 * CBTTestModal: Admin Preview & Shareable Link Generator.
 *
 * Allows school administrators to:
 * 1. Review the generated entrance test (questions, correct options, duration, marks).
 * 2. Generate and copy the unique student test link.
 * 3. Send the test link directly to prospective candidates / parents via WhatsApp.
 * 4. Save and attach the test paper to the candidate record in MongoDB Atlas.
 */
export default function CBTTestModal({
    isOpen,
    testPaper,
    candidate,
    onClose,
    onConfirmAttach,
}) {
    const [copied, setCopied] = useState(false);
    const [previewQuestionsOpen, setPreviewQuestionsOpen] = useState(false);
    const [pdfBlocked, setPdfBlocked] = useState(false);

    if (!isOpen || !testPaper) return null;

    const handleDownloadPdf = (variant) => {
        const ok = downloadTestPdf(testPaper, { variant, candidate });
        setPdfBlocked(!ok);
    };

    const shareUrl = buildTestShareUrl(testPaper.testId, candidate?.id || candidate?.leadId || '');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (e) {
            // Fallback for older browsers
            const el = document.createElement('textarea');
            el.value = shareUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    // Pre-filled WhatsApp message for candidate invitation
    const studentName = candidate?.student || 'Student';
    const parentName = candidate?.parent || 'Parent';
    const targetGrade = testPaper.targetGrade;
    const duration = testPaper.durationMinutes;

    const whatsappMessage = encodeURIComponent(
        `Dear ${parentName},\n\nWe have generated the Computer Based Entrance Test (CBT) for ${studentName} for admission to Grade ${targetGrade} at Acadza Greenfield School.\n\n` +
        `Test Details:\n` +
        `- Test ID: ${testPaper.testId}\n` +
        `- Duration: ${duration} Minutes\n` +
        `- Total Questions: ${testPaper.totalQuestions} Questions (${testPaper.totalMarks} Marks)\n\n` +
        `Please open this link on a computer/laptop to take the test:\n${shareUrl}\n\n` +
        `Best regards,\nAdmissions Office - Acadza Greenfield School`
    );

    const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-disabled w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
                {/* 1. Header */}
                <div className="p-6 border-b border-disabled/40 bg-disabled/10 flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800">
                                <CheckIcon className="w-3.5 h-3.5" />
                                <span>Test Generated Successfully</span>
                            </span>
                            <span className="text-xs font-mono text-gray">
                                ID: {testPaper.testId}
                            </span>
                        </div>
                        <h2 className="text-xl font-extrabold text-heading mt-1.5 tracking-tight">
                            {testPaper.title}
                        </h2>
                        <p className="text-xs text-gray mt-1">
                            Candidate: <strong className="text-heading">{studentName}</strong> &bull; Applying for <strong>Grade {targetGrade}</strong> &bull; Evaluated on <strong>{testPaper.syllabusLabel}</strong>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray hover:text-heading text-lg font-bold p-1 rounded-md transition-colors cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* 2. Test Specifications Strip */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-r from-blue-50/40 via-white to-orange-50/40 border border-blue-200/80 rounded-xl p-4 text-xs">
                        <div>
                            <div className="text-[10px] uppercase font-bold text-gray">Total Questions</div>
                            <div className="text-lg font-black text-blue-900 mt-0.5">{testPaper.totalQuestions} Questions</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-gray">Duration</div>
                            <div className="text-lg font-black text-blue-900 mt-0.5">{testPaper.durationMinutes} Minutes</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-gray">Total Marks</div>
                            <div className="text-lg font-black text-[#E06A19] mt-0.5">{testPaper.totalMarks} Marks</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-gray">Marking Scheme</div>
                            <div className="text-xs font-bold text-heading mt-1">
                                +{testPaper.marksPerQ} / {testPaper.negPerQ === 0 ? 'No negative' : `${testPaper.negPerQ}`}
                            </div>
                        </div>
                    </div>

                    {/* 3. Shareable Test Link Card */}
                    <div className="bg-white border-2 border-orange-300 rounded-xl p-5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
                                <TestDocIcon className="w-4 h-4 text-[#E06A19]" />
                                <span>Unique Student Test Link</span>
                            </span>
                            <span className="text-[11px] font-semibold text-[#E06A19] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                                Ready to Send
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="w-full bg-disabled/15 border border-disabled rounded-lg px-3 py-2 text-xs font-mono text-heading select-all focus:outline-none"
                            />
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                                        copied
                                            ? 'bg-green text-white'
                                            : 'bg-[#E06A19] hover:bg-[#c85a10] text-white'
                                    }`}
                                >
                                    {copied ? (
                                        <>
                                            <CheckIcon className="w-3.5 h-3.5" />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <CopyIcon className="w-3.5 h-3.5" />
                                            <span>Copy Link</span>
                                        </>
                                    )}
                                </button>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                                >
                                    <WhatsAppIcon className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                        <p className="text-[11px] text-gray">
                            Send this link to the student or parent. They can open it in any browser to take the entrance test.
                        </p>
                    </div>

                    {/* 3b. Offline Test PDF */}
                    <div className="bg-white border-2 border-blue-200 rounded-xl p-5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
                                <TestDocIcon className="w-4 h-4 text-blue-700" />
                                <span>Offline Test (PDF)</span>
                            </span>
                            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                For pen &amp; paper tests
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                type="button"
                                onClick={() => handleDownloadPdf('paper')}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <span>Download Question Paper (PDF)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDownloadPdf('key')}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <span>Download Answer Key (PDF)</span>
                            </button>
                        </div>
                        <p className="text-[11px] text-gray">
                            Opens the print dialog &mdash; choose <strong>Save as PDF</strong> as the destination. The question
                            paper has no answers, so it can be printed and handed to students; keep the answer key for evaluation.
                        </p>
                        {pdfBlocked && (
                            <p className="text-[11px] font-semibold text-red-600">
                                Your browser blocked the PDF window. Allow pop-ups for this site and try again.
                            </p>
                        )}
                    </div>

                    {/* 4. Question Preview Accordion */}
                    <div className="border border-disabled rounded-xl overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setPreviewQuestionsOpen(!previewQuestionsOpen)}
                            className="w-full p-4 bg-disabled/10 hover:bg-disabled/20 transition-colors flex items-center justify-between text-left cursor-pointer"
                        >
                            <span className="text-xs font-extrabold text-heading flex items-center gap-2">
                                <span>View Test Questions & Answer Key</span>
                                <span className="text-[11px] font-normal text-gray">
                                    ({testPaper.questions.length} Questions)
                                </span>
                            </span>
                            <span className="text-xs font-bold text-[#E06A19] hover:text-[#c85a10]">
                                {previewQuestionsOpen ? 'Hide Preview' : 'Show Preview'}
                            </span>
                        </button>

                        {previewQuestionsOpen && (
                            <div className="divide-y divide-disabled/40 max-h-80 overflow-y-auto p-4 space-y-4">
                                {testPaper.questions.map((q, idx) => (
                                    <div key={q.id || idx} className="pt-3 first:pt-0 space-y-2 text-xs">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="font-bold text-blue-700">
                                                Question {idx + 1} &bull; {q.subjectName} ({q.chapterName})
                                            </span>
                                            <span className="font-semibold text-gray">
                                                +{q.marks || 1} Marks
                                            </span>
                                        </div>
                                        <div className="font-bold text-heading leading-relaxed">
                                            {q.questionText}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                            {q.options.map((opt) => {
                                                const isCorrect = opt.key === q.correctOption;
                                                return (
                                                    <div
                                                        key={opt.key}
                                                        className={`p-2 rounded-lg border text-[11px] flex items-center gap-2 ${
                                                            isCorrect
                                                                ? 'bg-green-50 border-green text-green font-bold'
                                                                : 'bg-white border-disabled/70 text-gray'
                                                        }`}
                                                    >
                                                        <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-disabled/30">
                                                            {opt.key}
                                                        </span>
                                                        <span>{opt.text}</span>
                                                        {isCorrect && <span className="ml-auto text-[10px] uppercase font-bold">Correct</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {q.explanation && (
                                            <div className="text-[11px] text-gray bg-disabled/15 p-2 rounded-md">
                                                <strong>Explanation:</strong> {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Footer */}
                <div className="p-4 border-t border-disabled/40 bg-white flex items-center justify-between gap-3">
                    <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#E06A19] hover:text-[#c85a10] underline"
                    >
                        Try Test in Student Mode &rarr;
                    </a>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-disabled rounded-lg text-xs font-bold text-gray hover:text-heading hover:bg-disabled/20 transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onConfirmAttach(testPaper);
                                onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#E06A19] hover:bg-[#c85a10] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            <CheckIcon className="w-3.5 h-3.5" />
                            <span>Save & Assign to Candidate</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
