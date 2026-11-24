import React, { useState, useMemo } from 'react';
import { PhoneIcon, ArrowRightIcon, AlertIcon, CheckIcon } from '../icons';
import { GRADES, SOURCES, ACADEMIC_YEAR, SCHOOL_NAME } from '../constants';

/**
 * Clerk Intake Portal for recording prospective admissions.
 * Features real-time duplicate phone number matching and routing dispatch
 * (Counseling Caller Desk vs Direct CBT Entrance Evaluation).
 */
export default function AddEnquiry({
    existingLeads,
    onSaveEnquiry,
    onCancel,
}) {
    const [student, setStudent] = useState('');
    const [parent, setParent] = useState('');
    const [phone, setPhone] = useState('');
    const [alternate, setAlternate] = useState('');
    const [grade, setGrade] = useState('11');
    const [source, setSource] = useState('Walk-in');
    const [note, setNote] = useState('');
    const [routeToTest, setRouteToTest] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Duplicate telephone detection
    const duplicateLead = useMemo(() => {
        const clean = phone.replace(/\D/g, '');
        if (clean.length < 10) return null;
        return existingLeads.find((l) => l.phone.includes(clean)) || null;
    }, [phone, existingLeads]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!student.trim() || !parent.trim() || !phone.trim()) return;

        const cleanPhone = phone.replace(/\D/g, '');
        // Next ID = highest existing number + 1. Using the list length collides
        // with existing IDs once the sequence has gaps, which made two rows share one ID.
        const maxSeq = existingLeads.reduce((max, l) => {
            const m = /^AC-2027-(\d+)$/.exec(l.id || '');
            return m ? Math.max(max, parseInt(m[1], 10)) : max;
        }, 0);
        const newLead = {
            id: `AC-2027-${String(maxSeq + 1).padStart(3, '0')}`,
            school: SCHOOL_NAME,
            student: student.trim(),
            parent: parent.trim(),
            phone: cleanPhone,
            alternate: alternate.trim(),
            grade,
            source,
            cycle: ACADEMIC_YEAR,
            stage: routeToTest ? 'READY_FOR_CBT' : 'ENQUIRY',
            caller: routeToTest ? null : 'usr-1',
            nextAction: routeToTest ? 'Schedule entrance test (CBT)' : 'Arrange welcome call',
            due: routeToTest ? null : new Date().toISOString(),
            lastOutcome: note.trim() || 'New clerk intake registered at admissions counter.',
            created: new Date().toISOString(),
            history: [
                {
                    id: `act-${Date.now()}`,
                    at: new Date().toISOString(),
                    actor: 'Front desk clerk',
                    text: note.trim()
                        ? `Enquiry registered: ${note.trim()}`
                        : `Enquiry registered via ${source}. ${
                              routeToTest ? 'Routed directly to CBT Evaluation.' : 'Queued for counseling call.'
                          }`,
                },
            ],
        };

        setSubmitted(true);
        onSaveEnquiry(newLead);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header & Breadcrumb */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={onCancel}
                        className="text-xs font-semibold text-gray hover:text-heading flex items-center gap-1 mb-1 transition-colors"
                    >
                        <span>&larr; Return to Enquiries</span>
                    </button>
                    <h1 className="text-2xl font-extrabold text-heading tracking-tight">
                        Record New Enquiry
                    </h1>
                    <p className="text-sm text-gray mt-1">
                        Front desk intake form for prospective admissions into Acadza Greenfield School.
                    </p>
                </div>
            </div>

            {/* Main Layout: Form + Explanatory Aside */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <form
                    onSubmit={handleSubmit}
                    className="lg:col-span-8 bg-white border border-disabled rounded-2xl p-6 shadow-sm space-y-5"
                >
                    {/* Duplicate Warning Alert */}
                    {duplicateLead && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-start gap-2.5">
                            <AlertIcon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-amber-900">Existing applicant detected:</span>{' '}
                                An enquiry already exists for phone number <strong>{phone}</strong> under student{' '}
                                <strong>{duplicateLead.student}</strong> (Grade {duplicateLead.grade}). You may still
                                proceed if registering a sibling or distinct application.
                            </div>
                        </div>
                    )}

                    {/* Basic Applicant Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-heading font-bold mb-1">Student Full Name *</label>
                            <input
                                type="text"
                                required
                                value={student}
                                onChange={(e) => setStudent(e.target.value)}
                                placeholder="e.g. Aarav Mehta"
                                className="w-full border border-disabled rounded-lg px-3 py-2 text-heading focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-heading font-bold mb-1">Parent / Guardian Name *</label>
                            <input
                                type="text"
                                required
                                value={parent}
                                onChange={(e) => setParent(e.target.value)}
                                placeholder="e.g. Sanjay Mehta"
                                className="w-full border border-disabled rounded-lg px-3 py-2 text-heading focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-heading font-bold mb-1">Primary Mobile Number *</label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="10-digit number"
                                className="w-full border border-disabled rounded-lg px-3 py-2 text-heading focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-heading font-bold mb-1">Alternate Phone (Optional)</label>
                            <input
                                type="tel"
                                value={alternate}
                                onChange={(e) => setAlternate(e.target.value)}
                                placeholder="Secondary contact"
                                className="w-full border border-disabled rounded-lg px-3 py-2 text-heading focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-heading font-bold mb-1">Applying for Grade *</label>
                            <select
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full border border-disabled rounded-lg px-3 py-2 text-heading focus:outline-none focus:border-primary bg-white"
                            >
                                {GRADES.map((g) => (
                                    <option key={g} value={g}>
                                        Grade {g}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-heading font-bold mb-1">Enquiry Channel / Source *</label>
                            <select
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                className="w-full border border-disabled rounded-lg px-3 py-2 text-heading focus:outline-none focus:border-primary bg-white"
                            >
                                {SOURCES.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Routing Options */}
                    <div className="pt-2">
                        <label className="block text-xs font-bold text-heading mb-2">
                            Admissions Route & Next Step *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <label
                                onClick={() => setRouteToTest(false)}
                                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                                    !routeToTest
                                        ? 'bg-primary-16 border-primary shadow-sm text-heading'
                                        : 'bg-white border-disabled text-gray hover:bg-disabled/20'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="radio"
                                        name="route"
                                        checked={!routeToTest}
                                        onChange={() => setRouteToTest(false)}
                                        className="accent-primary"
                                    />
                                    <div>
                                        <div className="font-bold text-heading">Arrange a call</div>
                                        <div className="text-[11px] text-gray mt-0.5">
                                            A counselor will call the parent.
                                        </div>
                                    </div>
                                </div>
                                <PhoneIcon className="w-4 h-4 text-primary shrink-0" />
                            </label>

                            <label
                                onClick={() => setRouteToTest(true)}
                                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                                    routeToTest
                                        ? 'bg-amber-50 border-amber-500 shadow-sm text-heading'
                                        : 'bg-white border-disabled text-gray hover:bg-disabled/20'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="radio"
                                        name="route"
                                        checked={routeToTest}
                                        onChange={() => setRouteToTest(true)}
                                        className="accent-amber-600"
                                    />
                                    <div>
                                        <div className="font-bold text-heading">Ready for entrance test</div>
                                        <div className="text-[11px] text-gray mt-0.5">
                                            Send directly to the CBT team.
                                        </div>
                                    </div>
                                </div>
                                <ArrowRightIcon className="w-4 h-4 text-amber-600 shrink-0" />
                            </label>
                        </div>
                    </div>

                    {/* Intake Notes */}
                    <div>
                        <label className="block text-heading font-bold text-xs mb-1">
                            Counter Remarks / Requirements (Optional)
                        </label>
                        <textarea
                            rows="2"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. Interested in integrated coaching, hostel facility inquiry..."
                            className="w-full text-xs border border-disabled rounded-lg p-2.5 text-heading focus:outline-none focus:border-primary placeholder-gray"
                        />
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-disabled/40">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-disabled rounded-lg text-gray hover:bg-disabled/20 text-xs font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                        >
                            Save Enquiry
                        </button>
                    </div>
                </form>

                {/* Explanatory Aside */}
                <aside className="lg:col-span-4 bg-white border border-disabled rounded-2xl p-6 shadow-sm space-y-4 text-xs">
                    <h3 className="text-sm font-bold text-heading">What happens next?</h3>
                    <p className="text-gray leading-relaxed">
                        {routeToTest
                            ? 'The entrance test team receives this inquiry immediately and schedules the student for computer-based evaluation (CBT).'
                            : 'An available admissions counselor receives this enquiry in their Calling Desk and contacts the parent to address inquiries.'}
                    </p>
                    <p className="text-gray leading-relaxed">
                        You can track the assigned staff member, call recordings, and lifecycle progress in the enquiry record.
                    </p>
                    <div className="p-3 bg-disabled/20 rounded-xl text-gray">
                        <span className="font-bold text-heading">Need to verify?</span>
                        <div className="mt-1">
                            Check existing enquiries in the directory before recording a duplicate entry.
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
