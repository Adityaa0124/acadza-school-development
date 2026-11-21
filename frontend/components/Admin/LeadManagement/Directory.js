import React, { useState, useMemo } from 'react';
import { PhoneIcon, ClockIcon } from '../icons';
import WhatsAppContactButton from '../WhatsAppContactButton';
import { GRADES, STAGE_LABELS, getStageBadgeClasses, formatDateTime } from '../constants';

/**
 * Admissions Directory component.
 * Displays searchable registry of leads with real-time filters and quick communication actions.
 */
export default function Directory({
    leads,
    onSelectLead,
    onNewEnquiry,
    onOpenCallingDesk,
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            const matchesSearch =
                (lead.student && lead.student.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (lead.parent && lead.parent.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (lead.phone && lead.phone.includes(searchTerm)) ||
                (lead.id && lead.id.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStage = !stageFilter || lead.stage === stageFilter;
            const matchesGrade = !gradeFilter || lead.grade === gradeFilter;

            return matchesSearch && matchesStage && matchesGrade;
        });
    }, [leads, searchTerm, stageFilter, gradeFilter]);

    const stats = useMemo(() => {
        const total = leads.length;
        const now = new Date().toISOString();
        const dueCalls = leads.filter(
            (l) => ['ENQUIRY', 'INTERESTED'].includes(l.stage) && l.due && l.due <= now
        ).length;
        const readyForTest = leads.filter((l) => l.stage === 'READY_FOR_CBT').length;
        const converted = leads.filter((l) => l.stage === 'CONVERTED').length;
        return { total, dueCalls, readyForTest, converted };
    }, [leads]);

    return (
        <div className="space-y-6">
            {/* Header with Navigation Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Admissions Office
                    </span>
                    <h1 className="text-2xl font-extrabold text-heading tracking-tight mt-0.5">
                        Enquiries & Leads
                    </h1>
                    <p className="text-sm text-gray mt-1">
                        Find an applicant, review next counseling steps, or intake a new student.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onOpenCallingDesk}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        <PhoneIcon className="w-3.5 h-3.5" />
                        <span>Calling Desk ({stats.dueCalls} Due)</span>
                    </button>
                    <button
                        onClick={onNewEnquiry}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        <span>+ Add Enquiry</span>
                    </button>
                </div>
            </div>

            {/* Admissions KPI Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-semibold text-gray uppercase tracking-wider">Total Enquiries</div>
                    <div className="text-2xl font-black text-heading mt-1">{stats.total}</div>
                    <div className="text-[11px] text-gray mt-1">Active academic cycle</div>
                </div>
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-semibold text-gray uppercase tracking-wider">Calls Due</div>
                    <div className="text-2xl font-black text-amber-600 mt-1">{stats.dueCalls}</div>
                    <div className="text-[11px] text-gray mt-1">Requiring caller follow-up</div>
                </div>
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-semibold text-gray uppercase tracking-wider">Ready for Test</div>
                    <div className="text-2xl font-black text-primary mt-1">{stats.readyForTest}</div>
                    <div className="text-[11px] text-gray mt-1">Handed over to test team</div>
                </div>
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-semibold text-gray uppercase tracking-wider">Admissions Done</div>
                    <div className="text-2xl font-black text-green mt-1">{stats.converted}</div>
                    <div className="text-[11px] text-gray mt-1">Successfully enrolled</div>
                </div>
            </div>

            {/* Table Filter Strip */}
            <div className="bg-white border border-disabled rounded-xl shadow-sm p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-disabled/40">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search student, parent, phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 pl-3 pr-3 py-1.5 text-xs bg-disabled/20 border border-disabled rounded-lg focus:outline-none focus:border-primary text-heading placeholder-gray"
                            />
                        </div>
                        <select
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value)}
                            className="text-xs bg-disabled/20 border border-disabled rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-heading"
                        >
                            <option value="">All Stages</option>
                            {Object.entries(STAGE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={gradeFilter}
                            onChange={(e) => setGradeFilter(e.target.value)}
                            className="text-xs bg-disabled/20 border border-disabled rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-heading"
                        >
                            <option value="">All Grades</option>
                            {GRADES.map((g) => (
                                <option key={g} value={g}>
                                    Grade {g}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-xs text-gray">
                        Showing {filteredLeads.length} of {leads.length} records
                    </div>
                </div>

                {/* Leads Listing */}
                <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-disabled/60 text-gray uppercase text-[10px] tracking-wider font-semibold">
                                <th className="py-3 px-3">Student & ID</th>
                                <th className="py-3 px-3">Parent & Contact</th>
                                <th className="py-3 px-3">Grade</th>
                                <th className="py-3 px-3">Current Stage</th>
                                <th className="py-3 px-3">Next Action / Due</th>
                                <th className="py-3 px-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-disabled/30 text-heading">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray">
                                        No admissions records found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-disabled/10 transition-colors">
                                        <td className="py-3 px-3">
                                            <div
                                                onClick={() => onSelectLead(lead.id)}
                                                className="font-bold text-heading hover:text-primary cursor-pointer"
                                            >
                                                {lead.student}
                                            </div>
                                            <div className="text-[11px] text-gray">{lead.id}</div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="font-medium text-heading">{lead.parent}</div>
                                            <div className="text-[11px] text-gray">{lead.phone}</div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className="font-semibold px-2 py-0.5 rounded bg-disabled/30 text-heading">
                                                Grade {lead.grade}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getStageBadgeClasses(
                                                    lead.stage
                                                )}`}
                                            >
                                                {STAGE_LABELS[lead.stage] || lead.stage}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="font-medium">{lead.nextAction || '—'}</div>
                                            <div className="text-[11px] text-gray flex items-center gap-1 mt-0.5">
                                                <ClockIcon className="w-3 h-3" />
                                                <span>{formatDateTime(lead.due)}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <div className="inline-flex items-center justify-end gap-2">
                                                <WhatsAppContactButton lead={lead} />
                                                <a
                                                    href={`tel:${lead.phone}`}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-disabled/40 hover:bg-disabled/80 text-heading transition-colors"
                                                    title={`Call ${lead.phone}`}
                                                >
                                                    <PhoneIcon className="w-3.5 h-3.5" />
                                                    <span>Call</span>
                                                </a>
                                                <button
                                                    onClick={() => onSelectLead(lead.id)}
                                                    className="px-2.5 py-1 text-xs font-semibold rounded-md bg-primary-16 text-primary hover:bg-primary-64/20 transition-colors"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
