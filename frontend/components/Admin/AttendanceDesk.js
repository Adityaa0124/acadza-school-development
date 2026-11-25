import React, { useMemo, useState } from 'react';
import { CheckIcon, AlertIcon, ClockIcon } from './icons';

const STATUSES = [
    { key: 'present', label: 'Present', on: 'bg-emerald-600 text-white border-emerald-600', off: 'text-emerald-700 border-emerald-200 hover:bg-emerald-50' },
    { key: 'late', label: 'Late', on: 'bg-amber-500 text-white border-amber-500', off: 'text-amber-700 border-amber-200 hover:bg-amber-50' },
    { key: 'absent', label: 'Absent', on: 'bg-red-600 text-white border-red-600', off: 'text-red-700 border-red-200 hover:bg-red-50' },
];

const ROLE_LABELS = { teacher: 'Faculty', staff: 'Staff', admin: 'Admin', superadmin: 'Super Admin' };
const STAFF_ROLES = Object.keys(ROLE_LABELS);

const todayStr = () => new Date().toISOString().slice(0, 10);

/**
 * Daily attendance register for school employees and faculty (teacher / staff / admin roles).
 * Pick a date and (optionally) a role, mark each person Present / Late / Absent, and save.
 * Records are kept per date in `attendance` ({ [date]: { [userId]: status } }), owned by the page.
 */
export default function AttendanceDesk({ users, attendance, onSaveAttendance, onBackToHub }) {
    const employees = useMemo(() => users.filter((u) => STAFF_ROLES.includes(u.role) && !u.isBlocked), [users]);

    const [date, setDate] = useState(todayStr());
    const [roleFilter, setRoleFilter] = useState('');
    const [search, setSearch] = useState('');
    const [draft, setDraft] = useState({}); // unsaved edits for the selected date
    const [savedNotice, setSavedNotice] = useState(false);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return employees.filter(
            (s) =>
                (!roleFilter || s.role === roleFilter) &&
                (!q || s.name?.toLowerCase().includes(q) || s.phone?.includes(q))
        );
    }, [employees, roleFilter, search]);

    const statusOf = (id) => draft[id] ?? attendance?.[date]?.[id] ?? '';
    const setStatus = (id, status) => {
        setSavedNotice(false);
        setDraft((prev) => ({ ...prev, [id]: status }));
    };
    const markAll = (status) => {
        setSavedNotice(false);
        setDraft((prev) => ({ ...prev, ...Object.fromEntries(visible.map((s) => [s._id, status])) }));
    };
    const changeDate = (value) => {
        setDate(value);
        setDraft({});
        setSavedNotice(false);
    };

    const counts = useMemo(() => {
        const c = { present: 0, late: 0, absent: 0, unmarked: 0 };
        visible.forEach((s) => {
            const st = draft[s._id] ?? attendance?.[date]?.[s._id] ?? '';
            if (st) c[st] += 1;
            else c.unmarked += 1;
        });
        return c;
    }, [visible, draft, attendance, date]);

    const hasChanges = Object.keys(draft).length > 0;
    const handleSave = () => {
        onSaveAttendance(date, draft);
        setDraft({});
        setSavedNotice(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    onClick={onBackToHub}
                    className="text-xs font-semibold text-gray hover:text-heading flex items-center gap-1.5 mb-1.5 transition-colors cursor-pointer"
                >
                    <span>&larr;</span>
                    <span>Back to Main Screen</span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-sm">
                        <CheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-heading tracking-tight">Attendance</h1>
                        <p className="text-xs text-gray mt-0.5">Mark daily attendance for faculty and school employees. Select a date, then save.</p>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70">
                    <div className="text-emerald-700 font-medium">Present</div>
                    <div className="text-xl font-black text-heading">{counts.present}</div>
                </div>
                <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/70">
                    <div className="text-amber-700 font-medium">Late</div>
                    <div className="text-xl font-black text-heading">{counts.late}</div>
                </div>
                <div className="p-3 rounded-xl border border-red-200 bg-red-50/70">
                    <div className="text-red-700 font-medium">Absent</div>
                    <div className="text-xl font-black text-heading">{counts.absent}</div>
                </div>
                <div className="p-3 rounded-xl border border-disabled bg-white">
                    <div className="text-gray font-medium">Not marked</div>
                    <div className="text-xl font-black text-heading">{counts.unmarked}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white border border-disabled rounded-2xl shadow-xs p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                    <input
                        type="date"
                        value={date}
                        max={todayStr()}
                        onChange={(e) => e.target.value && changeDate(e.target.value)}
                        className="text-xs bg-disabled/20 border border-disabled rounded-lg px-3 py-2 font-bold text-heading focus:outline-none focus:border-emerald-600"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="text-xs bg-disabled/20 border border-disabled rounded-lg px-3 py-2 font-bold text-heading focus:outline-none focus:border-emerald-600"
                    >
                        <option value="">All Faculty &amp; Staff</option>
                        {STAFF_ROLES.map((role) => (
                            <option key={role} value={role}>
                                {ROLE_LABELS[role]}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Search name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-56 px-3 py-2 text-xs bg-disabled/20 border border-disabled rounded-lg text-heading placeholder-gray focus:outline-none focus:border-emerald-600"
                    />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                    <button type="button" onClick={() => markAll('present')} className="px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 cursor-pointer">
                        Mark all present
                    </button>
                    <button type="button" onClick={() => markAll('absent')} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 cursor-pointer">
                        Mark all absent
                    </button>
                </div>
            </div>

            {/* Register */}
            <div className="bg-white border border-disabled rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-disabled/70 bg-[#F8FAFC] text-gray uppercase text-[10px] tracking-wider font-bold">
                                <th className="py-3 px-4 w-12">#</th>
                                <th className="py-3 px-3">Name</th>
                                <th className="py-3 px-3">Role</th>
                                <th className="py-3 px-4 text-right">Attendance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-disabled/40 text-heading">
                            {visible.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray">
                                        <AlertIcon className="w-6 h-6 mx-auto mb-2" />
                                        No faculty or staff match this filter.
                                    </td>
                                </tr>
                            ) : (
                                visible.map((s, i) => {
                                    const current = statusOf(s._id);
                                    return (
                                        <tr key={s._id} className="hover:bg-emerald-50/30 transition-colors">
                                            <td className="py-3 px-4 text-gray">{i + 1}</td>
                                            <td className="py-3 px-3">
                                                <div className="font-bold">{s.name}</div>
                                                {s.phone && <div className="text-[10px] text-gray">{s.phone}</div>}
                                            </td>
                                            <td className="py-3 px-3 text-gray">{ROLE_LABELS[s.role] || s.role}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-end gap-1.5">
                                                    {STATUSES.map((st) => (
                                                        <button
                                                            key={st.key}
                                                            type="button"
                                                            onClick={() => setStatus(s._id, st.key)}
                                                            className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                                                                current === st.key ? st.on : `bg-white ${st.off}`
                                                            }`}
                                                        >
                                                            {st.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 bg-[#F8FAFC] border-t border-disabled/60 flex items-center justify-between gap-3">
                    <span className="text-xs text-gray inline-flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {savedNotice ? <strong className="text-emerald-700">Attendance saved for {date}</strong> : `Date: ${date}`}
                    </span>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Attendance
                    </button>
                </div>
            </div>
        </div>
    );
}
