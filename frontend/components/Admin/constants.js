/**
 * Domain constants, lifecycle definitions, and mock dataset
 * based on the reference admissions architecture.
 */

export const GRADES = ['6', '7', '8', '9', '10', '11', '12'];
export const SOURCES = ['Walk-in', 'Phone', 'Website', 'Referral', 'School event'];
export const ACADEMIC_YEAR = '2027/28';
export const SCHOOL_NAME = 'Acadza Greenfield School';

/**
 * Standard progression stages from clerk intake through conversion.
 */
export const STAGE_LABELS = {
    ENQUIRY: 'New enquiry',
    INTERESTED: 'Interested',
    READY_FOR_CBT: 'Ready for test',
    CBT_SCHEDULED: 'Test scheduled',
    CBT_COMPLETED: 'Test completed',
    ADMISSION_IN_PROGRESS: 'Admission in progress',
    CONVERTED: 'Admission completed',
    LOST: 'Closed, not admitted',
    INVALID: 'Invalid enquiry',
};

/**
 * Available admission counseling team members.
 */
export const CALLERS = [
    { id: 'usr-1', name: 'Vikram Singh', role: 'caller' },
    { id: 'usr-2', name: 'Megha Rao', role: 'caller' },
    { id: 'usr-3', name: 'Anjali Sharma', role: 'caller' },
];

/**
 * Initial dataset modeling real admissions scenarios across all stages.
 */
export const INITIAL_ADMISSIONS_LEADS = [
    {
        id: 'AC-2027-001',
        school: SCHOOL_NAME,
        student: 'Aarav Mehta',
        parent: 'Sanjay Mehta',
        phone: '9820112233',
        alternate: '9820112234',
        grade: '11',
        source: 'Walk-in',
        cycle: ACADEMIC_YEAR,
        stage: 'ENQUIRY',
        caller: 'usr-1',
        nextAction: 'Arrange welcome call',
        due: '2026-11-21T08:00:00.000Z',
        lastOutcome: 'Parent visited front desk; inquired for 2-year JEE coaching + schooling.',
        created: '2026-11-21T09:30:00.000Z',
        history: [
            {
                id: 'act-1',
                at: '2026-11-21T09:30:00.000Z',
                actor: 'Front desk clerk',
                text: 'Enquiry recorded at school counter. Parent requested information pack.',
            },
        ],
    },
    {
        id: 'AC-2027-002',
        school: SCHOOL_NAME,
        student: 'Diya Sharma',
        parent: 'Ramesh Sharma',
        phone: '9871122334',
        alternate: '',
        grade: '12',
        source: 'Phone',
        cycle: ACADEMIC_YEAR,
        stage: 'INTERESTED',
        caller: 'usr-1',
        nextAction: 'Discuss syllabus & batches',
        due: '2026-11-22T14:30:00.000Z',
        lastOutcome: 'Parent interested in Physics and Maths revision batch.',
        created: '2026-11-20T11:20:00.000Z',
        history: [
            {
                id: 'act-2',
                at: '2026-11-20T11:20:00.000Z',
                actor: 'Front desk clerk',
                text: 'Phone enquiry taken. Student currently studying in Class 12.',
            },
            {
                id: 'act-3',
                at: '2026-11-20T15:00:00.000Z',
                actor: 'Vikram Singh',
                text: 'Spoke with father. Very keen on upcoming weekend batch.',
            },
        ],
    },
    {
        id: 'AC-2027-003',
        school: SCHOOL_NAME,
        student: 'Kabir Singhania',
        parent: 'Anita Singhania',
        phone: '9819988776',
        alternate: '9819988770',
        grade: '10',
        source: 'Referral',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test',
        due: '2026-11-23T11:00:00.000Z',
        lastOutcome: 'Passed clerk intake; opted straight for entrance evaluation.',
        created: '2026-11-19T10:15:00.000Z',
        history: [
            {
                id: 'act-4',
                at: '2026-11-19T10:15:00.000Z',
                actor: 'Front desk clerk',
                text: 'New enquiry taken. Mother requested direct entrance test slot.',
            },
        ],
    },
    {
        id: 'AC-2027-004',
        school: SCHOOL_NAME,
        student: 'Rohan Deshmukh',
        parent: 'Prakash Deshmukh',
        phone: '9765432109',
        alternate: '',
        grade: '11',
        source: 'Website',
        cycle: ACADEMIC_YEAR,
        stage: 'ENQUIRY',
        caller: 'usr-1',
        nextAction: 'First call to parent',
        due: null,
        lastOutcome: 'New online inquiry waiting for caller.',
        created: '2026-11-21T12:00:00.000Z',
        history: [
            {
                id: 'act-5',
                at: '2026-11-21T12:00:00.000Z',
                actor: 'Front desk clerk',
                text: 'Web enquiry received. Dispatched to caller team.',
            },
        ],
    },
    {
        id: 'AC-2027-005',
        school: SCHOOL_NAME,
        student: 'Ananya Sen',
        parent: 'Debashis Sen',
        phone: '9830099887',
        alternate: '9830099880',
        grade: '11',
        source: 'School event',
        cycle: ACADEMIC_YEAR,
        stage: 'CONVERTED',
        caller: 'usr-1',
        nextAction: 'Enrollment complete',
        due: null,
        lastOutcome: 'Admission formalities completed, fee verified.',
        created: '2026-11-15T09:30:00.000Z',
        history: [
            {
                id: 'act-6',
                at: '2026-11-15T09:30:00.000Z',
                actor: 'Front desk clerk',
                text: 'Met at Science Olympiad school event.',
            },
            {
                id: 'act-7',
                at: '2026-11-18T12:00:00.000Z',
                actor: 'Vikram Singh',
                text: 'Admission confirmed into Class 11 JEE Classroom Batch.',
            },
        ],
    },
];

export const INITIAL_USERS = [
    {
        _id: 'demo-u1',
        name: 'Aditya Kumar',
        username: 'Acadza-User-1',
        email: 'adityaa.iiitd@gmail.com',
        phone: '8800539496',
        role: 'student',
        course: 'JEE',
        planType: 'silver',
        phoneVerified: true,
    },
    {
        _id: 'demo-u2',
        name: 'Aditya Kumar',
        username: 'Acadza-User-2',
        email: 'say.yo.adi@gmail.com',
        phone: '8800539496',
        role: 'student',
        course: 'JEE',
        planType: 'silver',
        phoneVerified: true,
    },
];

export function formatDateTime(isoString) {
    if (!isoString) return 'Not scheduled';
    try {
        const d = new Date(isoString);
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return isoString;
    }
}

export function getStageBadgeClasses(stage) {
    switch (stage) {
        case 'ENQUIRY':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'INTERESTED':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'READY_FOR_CBT':
            return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'CBT_SCHEDULED':
            return 'bg-primary-16 text-primary border-primary-64/20';
        case 'CBT_COMPLETED':
            return 'bg-teal-100 text-teal-800 border-teal-200';
        case 'ADMISSION_IN_PROGRESS':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'CONVERTED':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'LOST':
        case 'INVALID':
            return 'bg-disabled/60 text-gray border-disabled';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}
