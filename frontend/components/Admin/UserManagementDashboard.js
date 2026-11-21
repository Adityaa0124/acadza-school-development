import React, { useState, useMemo } from 'react';
import { UserIcon, CheckIcon } from './icons';

/**
 * Core User & Account Administration console.
 * Handles system user directories, role governance, and registration.
 */
export default function UserManagementDashboard({
    users,
    onRoleChange,
    onBlockUser,
    onDeleteUser,
    onAddUser,
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        role: 'student',
        course: 'JEE',
        planType: 'silver',
    });

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.phone && user.phone.includes(searchTerm)) ||
                (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesTab =
                activeTab === 'all' ||
                (activeTab === 'students' && user.role === 'student') ||
                (activeTab === 'teachers' && user.role === 'teacher') ||
                (activeTab === 'staff' && user.role === 'staff') ||
                (activeTab === 'admins' && user.role === 'admin') ||
                (activeTab === 'superadmins' && user.role === 'superadmin');

            return matchesSearch && matchesTab;
        });
    }, [users, searchTerm, activeTab]);

    const stats = useMemo(() => {
        const total = users.length;
        const students = users.filter((u) => u.role === 'student').length;
        const staffAndAdmins = users.filter((u) => ['admin', 'superadmin', 'staff', 'teacher'].includes(u.role)).length;
        const verified = users.filter((u) => u.phoneVerified || u.emailVerified).length;
        return { total, students, staffAndAdmins, verified };
    }, [users]);

    const handleCreateUser = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;
        onAddUser(formData);
        setFormData({
            name: '',
            username: '',
            email: '',
            phone: '',
            password: '',
            role: 'student',
            course: 'JEE',
            planType: 'silver',
        });
        setShowAddModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Header & New User Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-heading tracking-tight">Admin Dashboard</h1>
                    <p className="text-sm text-gray mt-1">
                        Manage school enrollment, student directories, and user privileges.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                >
                    <span>+ Add New User</span>
                </button>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-semibold text-gray uppercase tracking-wider">Total Users</div>
                    <div className="text-2xl font-black text-heading mt-1">{stats.total}</div>
                    <div className="text-[11px] text-gray mt-1">All registered accounts</div>
                </div>
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-semibold text-gray uppercase tracking-wider">Students</div>
                    <div className="text-2xl font-black text-primary mt-1">{stats.students}</div>
                    <div className="text-[11px] text-gray mt-1">Active JEE students</div>
                </div>
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-semibold text-gray uppercase tracking-wider">Staff & Admins</div>
                    <div className="text-2xl font-black text-amber-600 mt-1">{stats.staffAndAdmins}</div>
                    <div className="text-[11px] text-gray mt-1">Faculty & moderators</div>
                </div>
                <div className="bg-white border border-disabled rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-semibold text-gray uppercase tracking-wider">Verified Accounts</div>
                    <div className="text-2xl font-black text-green mt-1">{stats.verified}</div>
                    <div className="text-[11px] text-gray mt-1">Phone or email active</div>
                </div>
            </div>

            {/* User Directory Container */}
            <div className="bg-white border border-disabled rounded-xl shadow-sm p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-disabled/40">
                    <div>
                        <h2 className="text-lg font-bold text-heading">User Management</h2>
                        <div className="text-xs text-gray mt-0.5">
                            Showing {filteredUsers.length} of {users.length} accounts
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name, email, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pl-3 pr-3 py-1.5 text-xs bg-disabled/20 border border-disabled rounded-lg focus:outline-none focus:border-primary text-heading placeholder-gray"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 pt-4 pb-3">
                    {[
                        { id: 'all', label: 'All Users' },
                        { id: 'students', label: 'Students' },
                        { id: 'teachers', label: 'Teachers' },
                        { id: 'staff', label: 'Staff' },
                        { id: 'admins', label: 'Admins' },
                        { id: 'superadmins', label: 'Superadmins' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-primary text-white font-semibold'
                                    : 'bg-disabled/30 text-gray hover:bg-disabled/60'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-disabled/60 text-gray uppercase text-[10px] tracking-wider font-semibold">
                                <th className="py-3 px-3">User</th>
                                <th className="py-3 px-3">Contact</th>
                                <th className="py-3 px-3">Role</th>
                                <th className="py-3 px-3">Verification</th>
                                <th className="py-3 px-3">Course / Plan</th>
                                <th className="py-3 px-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-disabled/30 text-heading">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray">
                                        No users found matching current filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-disabled/10 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-primary-16 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                    {user.name ? user.name[0] : 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-heading">{user.name || 'Anonymous User'}</div>
                                                    <div className="text-[11px] text-gray">{user.username || 'No handle'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="font-medium">{user.email || '—'}</div>
                                            <div className="text-[11px] text-gray">{user.phone || '—'}</div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <select
                                                value={user.role}
                                                onChange={(e) => onRoleChange(user._id, e.target.value)}
                                                className="text-xs bg-disabled/20 border border-disabled rounded px-2 py-1 font-medium focus:outline-none focus:border-primary"
                                            >
                                                <option value="student">student</option>
                                                <option value="teacher">teacher</option>
                                                <option value="staff">staff</option>
                                                <option value="admin">admin</option>
                                                <option value="superadmin">superadmin</option>
                                            </select>
                                        </td>
                                        <td className="py-3 px-3">
                                            {user.phoneVerified ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green bg-green/10 px-2 py-0.5 rounded">
                                                    <CheckIcon className="w-3 h-3" /> Phone: Verified
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-medium text-gray bg-disabled/40 px-2 py-0.5 rounded">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="font-bold">{user.course || 'JEE'}</div>
                                            <div className="text-[11px] text-gray capitalize">{user.planType || 'silver'}</div>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    onClick={() => onBlockUser(user._id, !user.isBlocked)}
                                                    className="text-xs text-alert hover:underline font-medium"
                                                >
                                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                                </button>
                                                <span className="text-disabled">|</span>
                                                <button
                                                    onClick={() => onDeleteUser(user._id)}
                                                    className="text-xs text-gray hover:text-alert hover:underline"
                                                >
                                                    Delete
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

            {/* Modal: Create System User */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-disabled">
                        <div className="flex items-center justify-between pb-3 border-b border-disabled/40">
                            <h3 className="text-base font-bold text-heading">Register New User</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray hover:text-heading text-lg font-bold"
                            >
                                x
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray font-semibold mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-disabled rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-heading"
                                        placeholder="e.g. Rahul Sharma"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray font-semibold mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full border border-disabled rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-heading"
                                        placeholder="e.g. rahul-sharma"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray font-semibold mb-1">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border border-disabled rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-heading"
                                        placeholder="rahul@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray font-semibold mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border border-disabled rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-heading"
                                        placeholder="10-digit number"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray font-semibold mb-1">System Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full border border-disabled rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-heading bg-white"
                                    >
                                        <option value="student">student</option>
                                        <option value="teacher">teacher</option>
                                        <option value="staff">staff</option>
                                        <option value="admin">admin</option>
                                        <option value="superadmin">superadmin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray font-semibold mb-1">Target Course</label>
                                    <select
                                        value={formData.course}
                                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                        className="w-full border border-disabled rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-heading bg-white"
                                    >
                                        <option value="JEE">JEE</option>
                                        <option value="NEET">NEET</option>
                                        <option value="FOUNDATION">FOUNDATION</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-disabled/40">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-disabled rounded-lg text-gray hover:bg-disabled/20 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-bold shadow-sm"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
