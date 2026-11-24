import { getQuestionsByChapters, CBT_QUESTION_BANK } from './cbtQuestionBank';
import { getSyllabusForTargetGrade } from './syllabusData';

/**
 * Recommended Duration & Question Density Matrix based on authentic curriculum research.
 */
export const GRADE_TEST_SPECS = {
    '6': { durationMinutes: 60, recommendedQuestions: 30, marksPerQ: 1, negPerQ: 0, testGrade: '5' },
    '7': { durationMinutes: 60, recommendedQuestions: 30, marksPerQ: 1, negPerQ: 0, testGrade: '6' },
    '8': { durationMinutes: 75, recommendedQuestions: 35, marksPerQ: 1, negPerQ: 0, testGrade: '7' },
    '9': { durationMinutes: 90, recommendedQuestions: 45, marksPerQ: 2, negPerQ: 0, testGrade: '8' },
    '10': { durationMinutes: 90, recommendedQuestions: 45, marksPerQ: 2, negPerQ: 0, testGrade: '9' },
    '11': { durationMinutes: 120, recommendedQuestions: 50, marksPerQ: 4, negPerQ: 0, testGrade: '10' },
    '12': { durationMinutes: 120, recommendedQuestions: 50, marksPerQ: 4, negPerQ: 0, testGrade: '11' },
};

export function getRecommendedSpecs(targetGrade) {
    const key = String(targetGrade || '7');
    return GRADE_TEST_SPECS[key] || GRADE_TEST_SPECS['7'];
}

/**
 * Extracts a flat array of chapter IDs from a student's testConfig.
 */
export function extractSelectedChapterIds(testConfig) {
    if (!testConfig || !testConfig.selectedSubjects) return [];
    const chapterIds = [];
    Object.values(testConfig.selectedSubjects).forEach((subj) => {
        if (subj.chapters) {
            Object.keys(subj.chapters).forEach((chId) => {
                chapterIds.push(chId);
            });
        }
    });
    return chapterIds;
}

/**
 * Generates an entrance test paper strictly mapped to the candidate's selected chapters.
 *
 * @param {Object} options
 * @param {string} options.targetGrade - e.g. '6', '7', '11'
 * @param {Object} [options.testConfig] - portion configuration from CBT portion modal
 * @param {number} [options.durationMinutes] - test duration in minutes
 * @param {string} [options.title] - custom test title
 * @param {string} [options.studentId] - candidate lead ID (optional)
 * @param {string} [options.studentName] - candidate name (optional)
 */
export function generateTestPaper({
    targetGrade = '7',
    testConfig = null,
    durationMinutes = null,
    title = null,
    studentId = '',
    studentName = '',
}) {
    const specs = getRecommendedSpecs(targetGrade);
    const resolvedDuration = durationMinutes || specs.durationMinutes;
    const testGrade = specs.testGrade;

    // 1. Extract selected chapter IDs
    const selectedChapterIds = extractSelectedChapterIds(testConfig);

    // 2. Query question bank strictly for these chapters
    let candidateQuestions = [];
    if (selectedChapterIds.length > 0) {
        candidateQuestions = getQuestionsByChapters(selectedChapterIds, testGrade);
    } else {
        // Fallback: If no chapters specifically chosen, pull all standard questions for that test grade
        candidateQuestions = CBT_QUESTION_BANK.filter((q) => String(q.testGrade) === String(testGrade));
    }

    // 3. Fallback safety: If question bank has fewer questions than expected, pull all grade-appropriate questions
    if (candidateQuestions.length === 0) {
        candidateQuestions = CBT_QUESTION_BANK.filter((q) => String(q.testGrade) === String(testGrade));
    }

    // 4. Calculate total marks
    const totalMarks = candidateQuestions.reduce((acc, q) => acc + (q.marks || specs.marksPerQ), 0);

    // 5. Unique test paper ID
    const testId = `CBT-${targetGrade}-${Date.now().toString(36).toUpperCase()}`;

    // 6. Test paper object
    const testPaper = {
        testId,
        title: title || `Grade ${targetGrade} Admission Entrance Assessment`,
        targetGrade: String(targetGrade),
        testGrade: String(testGrade),
        syllabusLabel: `Grade ${testGrade} Curriculum (Prerequisite Standard)`,
        durationMinutes: resolvedDuration,
        totalQuestions: candidateQuestions.length,
        totalMarks,
        marksPerQ: specs.marksPerQ,
        negPerQ: specs.negPerQ,
        selectedChapterIds,
        portionSummary: testConfig?.summaryLabel || `${candidateQuestions.length} Questions across core chapters`,
        questions: candidateQuestions,
        createdAt: new Date().toISOString(),
        studentId,
        studentName,
    };

    return testPaper;
}

/**
 * Builds the shareable test link.
 */
export function buildTestShareUrl(testId, studentId = '') {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({ testId });
    if (studentId) params.append('studentId', studentId);
    return `${origin}/cbt/take-test?${params.toString()}`;
}
