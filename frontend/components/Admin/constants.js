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
        id: 'AC-2027-006',
        school: SCHOOL_NAME,
        student: 'Reyansh Verma',
        parent: 'Sunil Verma',
        phone: '9820223344',
        alternate: '9820223345',
        grade: '6',
        source: 'Walk-in',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T10:00:00.000Z',
        lastOutcome: 'Enquired for Grade 6 middle school admission. Ready for CBT evaluation.',
        created: '2026-11-21T09:30:00.000Z',
        history: [
            {
                id: 'act-601',
                at: '2026-11-21T09:30:00.000Z',
                actor: 'Front desk clerk',
                text: 'Parent visited admissions desk for Grade 6 intake. Handed over to CBT exam team.',
            },
        ],
    },
    {
        id: 'AC-2027-007',
        school: SCHOOL_NAME,
        student: 'Aanya Patel',
        parent: 'Kiran Patel',
        phone: '9833445566',
        alternate: '9833445567',
        grade: '7',
        source: 'Website',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T10:30:00.000Z',
        lastOutcome: 'Direct online application for Grade 7. Ready for Grade 6 syllabus assessment.',
        created: '2026-11-21T10:00:00.000Z',
        history: [
            {
                id: 'act-701',
                at: '2026-11-21T10:00:00.000Z',
                actor: 'Web admissions portal',
                text: 'Online registration confirmed. Candidate queued for CBT.',
            },
        ],
    },
    {
        id: 'AC-2027-008',
        school: SCHOOL_NAME,
        student: 'Vihaan Reddy',
        parent: 'Venkat Reddy',
        phone: '9844556677',
        alternate: '9844556678',
        grade: '8',
        source: 'Referral',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T11:00:00.000Z',
        lastOutcome: 'Referred by existing parent. Applying for Grade 8 admission.',
        created: '2026-11-21T11:00:00.000Z',
        history: [
            {
                id: 'act-801',
                at: '2026-11-21T11:00:00.000Z',
                actor: 'Front desk clerk',
                text: 'Application registered. Candidate queued for Grade 8 CBT.',
            },
        ],
    },
    {
        id: 'AC-2027-015',
        school: SCHOOL_NAME,
        student: 'Tanvi Deshpande',
        parent: 'Sudhir Deshpande',
        phone: '9844778811',
        alternate: '',
        grade: '8',
        source: 'Website',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T11:00:00.000Z',
        lastOutcome: 'Online application submitted for Grade 8. Ready for CBT.',
        created: '2026-11-21T11:05:00.000Z',
        history: [
            {
                id: 'act-802',
                at: '2026-11-21T11:05:00.000Z',
                actor: 'Web Admissions Portal',
                text: 'Registered online for Grade 8 entrance test.',
            },
        ],
    },
    {
        id: 'AC-2027-016',
        school: SCHOOL_NAME,
        student: 'Atharva Bhat',
        parent: 'Narayanan Bhat',
        phone: '9844778899',
        alternate: '',
        grade: '8',
        source: 'Website',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T11:10:00.000Z',
        lastOutcome: 'Candidate for Grade 8. Ready for entrance evaluation.',
        created: '2026-11-21T11:10:00.000Z',
        history: [
            {
                id: 'act-803',
                at: '2026-11-21T11:10:00.000Z',
                actor: 'Web Admissions Portal',
                text: 'Registered online for Grade 8 entrance test.',
            },
        ],
    },
    {
        id: 'AC-2027-022',
        school: SCHOOL_NAME,
        student: 'Advait Joshi',
        parent: 'Makarand Joshi',
        phone: '9844889900',
        alternate: '',
        grade: '8',
        source: 'Walk-in',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T11:15:00.000Z',
        lastOutcome: 'Walk-in enquiry for Class 8 middle school admission.',
        created: '2026-11-21T11:15:00.000Z',
        history: [
            {
                id: 'act-804',
                at: '2026-11-21T11:15:00.000Z',
                actor: 'Front desk clerk',
                text: 'Application registered. Candidate queued for Grade 8 CBT.',
            },
        ],
    },
    {
        id: 'AC-2027-023',
        school: SCHOOL_NAME,
        student: 'Anika Kulkarni',
        parent: 'Prasad Kulkarni',
        phone: '9844991122',
        alternate: '',
        grade: '8',
        source: 'Referral',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T11:20:00.000Z',
        lastOutcome: 'Sibling studying in school. Applying for Class 8 admission.',
        created: '2026-11-21T11:20:00.000Z',
        history: [
            {
                id: 'act-805',
                at: '2026-11-21T11:20:00.000Z',
                actor: 'Admissions Officer',
                text: 'Sibling reference verification complete. Queued for CBT test.',
            },
        ],
    },
    {
        id: 'AC-2027-009',
        school: SCHOOL_NAME,
        student: 'Ishaan Gupta',
        parent: 'Rajesh Gupta',
        phone: '9855667788',
        alternate: '9855667789',
        grade: '9',
        source: 'Walk-in',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T11:30:00.000Z',
        lastOutcome: 'Secondary school intake for Grade 9. Ready for Grade 8 syllabus evaluation.',
        created: '2026-11-21T11:30:00.000Z',
        history: [
            {
                id: 'act-901',
                at: '2026-11-21T11:30:00.000Z',
                actor: 'Front desk clerk',
                text: 'Walk-in intake for Class 9 foundation batch.',
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
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T12:00:00.000Z',
        lastOutcome: 'Opted straight for Grade 10 board prep evaluation.',
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
        id: 'AC-2027-001',
        school: SCHOOL_NAME,
        student: 'Aarav Mehta',
        parent: 'Sanjay Mehta',
        phone: '9820112233',
        alternate: '9820112234',
        grade: '11',
        source: 'Walk-in',
        cycle: ACADEMIC_YEAR,
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T12:30:00.000Z',
        lastOutcome: 'Inquired for 2-year JEE coaching + schooling. Routed to CBT.',
        created: '2026-11-21T09:30:00.000Z',
        history: [
            {
                id: 'act-1',
                at: '2026-11-21T09:30:00.000Z',
                actor: 'Front desk clerk',
                text: 'Enquiry recorded at school counter. Candidate routed to CBT evaluation.',
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
        stage: 'READY_FOR_CBT',
        caller: null,
        nextAction: 'Schedule entrance test (CBT)',
        due: '2026-11-23T13:00:00.000Z',
        lastOutcome: 'Interested in Physics and Maths revision batch. Ready for CBT diagnostic.',
        created: '2026-11-20T11:20:00.000Z',
        history: [
            {
                id: 'act-2',
                at: '2026-11-20T11:20:00.000Z',
                actor: 'Front desk clerk',
                text: 'Phone enquiry taken. Routed to entrance diagnostic test.',
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
    { _id: 'demo-t1', name: 'Neha Verma', username: 'Acadza-Faculty-1', email: 'neha.verma@example.com', phone: '9000000001', role: 'teacher', phoneVerified: true },
    { _id: 'demo-t2', name: 'Rahul Mehta', username: 'Acadza-Faculty-2', email: 'rahul.mehta@example.com', phone: '9000000002', role: 'teacher', phoneVerified: true },
    { _id: 'demo-s1', name: 'Sunita Rao', username: 'Acadza-Staff-1', email: 'sunita.rao@example.com', phone: '9000000003', role: 'staff', phoneVerified: true },
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
