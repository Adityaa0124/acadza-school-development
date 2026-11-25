/**
 * Offline test paper export.
 *
 * Builds a print-ready HTML document from a generated CBT test paper and opens the browser's
 * print dialog, where "Save as PDF" produces the downloadable file. Schools can then print the
 * PDF and run the entrance test on paper. No external PDF library is needed, and Unicode
 * (math symbols, Indian numbering) renders exactly as in the on-screen test.
 *
 * Two variants:
 *  - 'paper'  : student question paper (no answers) with name / roll / date fields
 *  - 'key'    : answer key with explanations (for the invigilator / evaluator)
 */

const SCHOOL_NAME = 'Acadza Greenfield School';

const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const slug = (value) =>
    String(value || 'test')
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '');

const STYLES = `
    @page { size: A4; margin: 16mm 14mm; }
    * { box-sizing: border-box; }
    body { font-family: "Segoe UI", Arial, sans-serif; color: #111827; font-size: 12.5px; line-height: 1.5; margin: 0; }
    .head { text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 8px; margin-bottom: 10px; }
    .school { font-size: 18px; font-weight: 800; color: #1d4ed8; letter-spacing: .3px; }
    .title { font-size: 15px; font-weight: 700; margin-top: 2px; }
    .tag { display: inline-block; margin-top: 4px; padding: 1px 10px; border: 1px solid #E06A19; color: #E06A19; border-radius: 99px; font-size: 10.5px; font-weight: 700; }
    .meta { display: flex; justify-content: space-between; gap: 8px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 10px; margin-bottom: 8px; font-weight: 600; }
    .fields { display: flex; gap: 14px; margin-bottom: 8px; }
    .field { flex: 1; border-bottom: 1px solid #111827; padding-bottom: 1px; font-size: 11.5px; }
    .field span { color: #475569; }
    .instr { background: #f1f5f9; border-radius: 6px; padding: 6px 10px; font-size: 11px; margin-bottom: 12px; }
    .instr ul { margin: 2px 0 0 16px; padding: 0; }
    .subject { font-weight: 800; font-size: 13px; color: #1d4ed8; border-bottom: 1px solid #bfdbfe; margin: 14px 0 6px; padding-bottom: 2px; }
    .q { page-break-inside: avoid; break-inside: avoid; margin-bottom: 11px; }
    .qtext { font-weight: 600; }
    .qno { display: inline-block; min-width: 26px; font-weight: 800; }
    .marks { float: right; color: #475569; font-size: 10.5px; font-weight: 600; }
    .opts { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 18px; margin: 3px 0 0 26px; }
    .opt b { display: inline-block; width: 18px; }
    .foot { margin-top: 14px; text-align: center; font-size: 10.5px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 6px; }
    table.key { width: 100%; border-collapse: collapse; margin-top: 6px; }
    table.key th, table.key td { border: 1px solid #cbd5e1; padding: 4px 6px; text-align: left; vertical-align: top; font-size: 11.5px; }
    table.key th { background: #eff6ff; }
    .ans { font-weight: 800; color: #047857; text-align: center; }
`;

function buildPaperBody(paper, candidate) {
    const questions = paper.questions || [];
    const negText =
        Number(paper.negPerQ) > 0 ? `Negative marking: -${paper.negPerQ} per wrong answer.` : 'There is no negative marking.';

    // Group consecutive questions by subject so the paper reads in sections.
    let lastSubject = null;
    let questionHtml = '';
    questions.forEach((q, i) => {
        if (q.subjectName && q.subjectName !== lastSubject) {
            lastSubject = q.subjectName;
            questionHtml += `<div class="subject">${escapeHtml(q.subjectName)}</div>`;
        }
        const opts = (q.options || [])
            .map((o) => `<div class="opt"><b>(${escapeHtml(o.key)})</b> ${escapeHtml(o.text)}</div>`)
            .join('');
        questionHtml += `
            <div class="q">
                <span class="marks">[${escapeHtml(q.marks || paper.marksPerQ || 1)} Mark${(q.marks || 1) > 1 ? 's' : ''}]</span>
                <div class="qtext"><span class="qno">Q${i + 1}.</span>${escapeHtml(q.questionText)}</div>
                <div class="opts">${opts}</div>
            </div>`;
    });

    return `
        <div class="head">
            <div class="school">${escapeHtml(SCHOOL_NAME)}</div>
            <div class="title">${escapeHtml(paper.title)}</div>
            <span class="tag">Admission Entrance Test &bull; Grade ${escapeHtml(paper.targetGrade)}</span>
        </div>
        <div class="meta">
            <span>Time: ${escapeHtml(paper.durationMinutes)} Minutes</span>
            <span>Questions: ${escapeHtml(paper.totalQuestions)}</span>
            <span>Maximum Marks: ${escapeHtml(paper.totalMarks)}</span>
            <span>Paper ID: ${escapeHtml(paper.testId)}</span>
        </div>
        <div class="fields">
            <div class="field"><span>Student Name:</span> ${escapeHtml(candidate?.student || '')}</div>
            <div class="field"><span>Roll / Enquiry No.:</span> ${escapeHtml(candidate?.id || '')}</div>
            <div class="field"><span>Date:</span></div>
        </div>
        <div class="instr">
            <b>Instructions</b>
            <ul>
                <li>Each question has four options; choose the single best answer and write its letter in the answer sheet.</li>
                <li>${escapeHtml(negText)}</li>
                <li>Do not use a calculator or any other aid unless the invigilator allows it.</li>
            </ul>
        </div>
        ${questionHtml}
        <div class="foot">&mdash; End of Question Paper &mdash;</div>`;
}

function buildKeyBody(paper) {
    const rows = (paper.questions || [])
        .map(
            (q, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${escapeHtml(q.subjectName)}${q.chapterName ? ` &mdash; ${escapeHtml(q.chapterName)}` : ''}</td>
                <td class="ans">${escapeHtml(q.correctOption)}</td>
                <td>${escapeHtml(q.marks || paper.marksPerQ || 1)}</td>
                <td>${escapeHtml(q.explanation || '')}</td>
            </tr>`
        )
        .join('');

    return `
        <div class="head">
            <div class="school">${escapeHtml(SCHOOL_NAME)}</div>
            <div class="title">${escapeHtml(paper.title)} &mdash; Answer Key</div>
            <span class="tag">For invigilator / evaluator use only</span>
        </div>
        <div class="meta">
            <span>Grade ${escapeHtml(paper.targetGrade)}</span>
            <span>Questions: ${escapeHtml(paper.totalQuestions)}</span>
            <span>Maximum Marks: ${escapeHtml(paper.totalMarks)}</span>
            <span>Paper ID: ${escapeHtml(paper.testId)}</span>
        </div>
        <table class="key">
            <thead><tr><th>Q.</th><th>Subject / Chapter</th><th>Answer</th><th>Marks</th><th>Explanation</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
}

/**
 * Opens the print dialog for the paper ("Save as PDF" downloads it).
 *
 * @param {Object} paper - generated test paper (see generateTestPaper)
 * @param {Object} [options]
 * @param {'paper'|'key'} [options.variant='paper']
 * @param {Object} [options.candidate] - prefills the student name / roll number on the paper
 * @returns {boolean} false when the browser blocked the print window
 */
export function downloadTestPdf(paper, { variant = 'paper', candidate = null } = {}) {
    if (!paper || typeof window === 'undefined') return false;

    const isKey = variant === 'key';
    const fileName = `${slug(paper.title)}_${paper.testId}${isKey ? '_Answer-Key' : ''}`;
    const body = isKey ? buildKeyBody(paper) : buildPaperBody(paper, candidate);

    const win = window.open('', '_blank');
    if (!win) return false;

    win.document.open();
    win.document.write(
        `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(fileName)}</title><style>${STYLES}</style></head><body>${body}</body></html>`
    );
    win.document.close();
    win.focus();
    // Give the new window a tick to lay out before the print dialog opens.
    setTimeout(() => win.print(), 300);
    return true;
}
