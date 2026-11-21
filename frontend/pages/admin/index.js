import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@context/auth/authContext';
import Typography from '@components/Custom/Typography';
import Button from '@components/Custom/Button';
import InputField from '@components/Custom/InputField';
import Loader2 from '@components/Custom/Loader2';
import { ROUTE_LOGIN, ROUTE_DASHBOARD } from '@utils/constants/page_routes';

// Modular Admin Components
import PortalHub from '@components/Admin/PortalHub';
import UserManagementDashboard from '@components/Admin/UserManagementDashboard';
import Directory from '@components/Admin/LeadManagement/Directory';
import CallingDesk from '@components/Admin/LeadManagement/CallingDesk';
import AddEnquiry from '@components/Admin/LeadManagement/AddEnquiry';
import LeadDetail from '@components/Admin/LeadManagement/LeadDetail';

// Domain constants and seed fixtures
import { INITIAL_ADMISSIONS_LEADS, INITIAL_USERS } from '@components/Admin/constants';

// Backend Database Service
import {
    fetchLeads,
    createLead,
    recordLeadOutcome,
    updateLeadStage,
    addLeadNote,
} from '../../services/leadService';

/**
 * Top-level Admin Controller Page.
 * Coordinates system authentication, modular views (Hub, User Directory, Admissions Pipeline),
 * and state synchronization across the administrative lifecycle.
 */
export default function AdminPage() {
    const router = useRouter();
    const { user, loading, logout, demoAdminLogin } = useAuth();

    // View navigation state: 'hub' | 'users' | 'leads' | 'caller' | 'add_enquiry' | 'lead_detail'
    const [view, setView] = useState('hub');
    const [selectedLeadId, setSelectedLeadId] = useState(null);

    // Admissions leads state (seeded with reference realistic lifecycle scenarios)
    const [leads, setLeads] = useState(INITIAL_ADMISSIONS_LEADS);

    // User management state
    const [users, setUsers] = useState(INITIAL_USERS);

    // Authentication form state for unauthenticated admins
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authBusy, setAuthBusy] = useState(false);

    // Ensure only authorized admin roles can operate this workspace
    const isAdmin = useMemo(() => {
        if (!user) return false;
        return ['admin', 'superadmin', 'staff'].includes(user.role);
    }, [user]);

    // Synchronize leads from the MongoDB backend if available
    useEffect(() => {
        if (isAdmin) {
            fetchLeads().then((remoteLeads) => {
                if (remoteLeads && Array.isArray(remoteLeads) && remoteLeads.length > 0) {
                    setLeads(remoteLeads);
                }
            });
        }
    }, [isAdmin]);

    // Aggregate statistics across both domains for the Portal Hub
    const hubMetrics = useMemo(() => {
        const now = new Date().toISOString();
        const totalUsers = users.length;
        const activeStudents = users.filter((u) => u.role === 'student').length;
        const totalLeads = leads.length;
        const dueCalls = leads.filter(
            (l) => ['ENQUIRY', 'INTERESTED'].includes(l.stage) && l.due && l.due <= now
        ).length;
        return { totalUsers, activeStudents, totalLeads, dueCalls };
    }, [users, leads]);

    // Handler: User authentication via standard credentials
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setAuthBusy(true);
        setAuthError('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Authentication failed. Please verify credentials.');
            }
            window.location.reload();
        } catch (err) {
            setAuthError(err.message || 'Admin authentication failed.');
        } finally {
            setAuthBusy(false);
        }
    };

    // Handler: 1-click administrative demo access
    const handleDemoAdmin = async () => {
        setAuthBusy(true);
        setAuthError('');
        try {
            if (typeof demoAdminLogin === 'function') {
                demoAdminLogin();
            } else {
                router.reload();
            }
        } catch (err) {
            setAuthError('Demo admin login failed: ' + err.message);
        } finally {
            setAuthBusy(false);
        }
    };

    // Handler: Updating user roles
    const handleUserRoleChange = (userId, newRole) => {
        setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
    };

    // Handler: Toggling user block status
    const handleUserBlock = (userId, isBlocked) => {
        setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, isBlocked } : u))
        );
    };

    // Handler: Deleting user
    const handleUserDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user record?')) {
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        }
    };

    // Handler: Creating a new user
    const handleAddUser = (newUserData) => {
        const newUser = {
            _id: `user-${Date.now()}`,
            ...newUserData,
            phoneVerified: true,
            isBlocked: false,
        };
        setUsers((prev) => [newUser, ...prev]);
    };

    // Handler: Adding a new admissions enquiry from the clerk counter
    const handleSaveEnquiry = async (newLead) => {
        setLeads((prev) => [newLead, ...prev]);
        setView('leads');
        // Synchronize with database
        await createLead({
            student: newLead.student,
            parent: newLead.parent,
            phone: newLead.phone,
            alternate: newLead.alternate,
            grade: newLead.grade,
            source: newLead.source,
            cycle: newLead.cycle,
            routeToTest: newLead.stage === 'READY_FOR_CBT',
            note: newLead.lastOutcome,
        });
    };

    // Handler: Committing caller outcomes from the calling desk
    const handleSaveOutcome = async (leadId, outcomePayload) => {
        setLeads((prev) =>
            prev.map((lead) => {
                if (lead.id !== leadId) return lead;
                const newHistoryItem = {
                    id: `act-${Date.now()}`,
                    at: new Date().toISOString(),
                    actor: user?.name || 'Admissions Counselor',
                    text: outcomePayload.note
                        ? `Outcome: ${outcomePayload.outcome}. Note: ${outcomePayload.note}`
                        : `Outcome: ${outcomePayload.outcome}`,
                };
                return {
                    ...lead,
                    stage: outcomePayload.nextStage,
                    nextAction: outcomePayload.nextAction,
                    due: outcomePayload.due,
                    lastOutcome: outcomePayload.outcome + (outcomePayload.note ? ` - ${outcomePayload.note}` : ''),
                    history: [...(lead.history || []), newHistoryItem],
                };
            })
        );
        // Synchronize with database
        await recordLeadOutcome({
            id: leadId,
            outcome: outcomePayload.outcome,
            note: outcomePayload.note,
            due: outcomePayload.due,
            nextStage: outcomePayload.nextStage,
            nextAction: outcomePayload.nextAction,
        });
    };

    // Handler: Updating stage from lead detail
    const handleStageChange = async (leadId, newStage) => {
        setLeads((prev) =>
            prev.map((lead) => {
                if (lead.id !== leadId) return lead;
                const historyItem = {
                    id: `act-${Date.now()}`,
                    at: new Date().toISOString(),
                    actor: user?.name || 'Admin',
                    text: `Stage manually changed to ${newStage}`,
                };
                return {
                    ...lead,
                    stage: newStage,
                    history: [...(lead.history || []), historyItem],
                };
            })
        );
        // Synchronize with database
        await updateLeadStage(leadId, newStage);
    };

    // Handler: Adding internal note to lead dossier
    const handleAddLeadNote = async (leadId, noteText) => {
        setLeads((prev) =>
            prev.map((lead) => {
                if (lead.id !== leadId) return lead;
                const historyItem = {
                    id: `act-${Date.now()}`,
                    at: new Date().toISOString(),
                    actor: user?.name || 'Admissions Officer',
                    text: noteText,
                };
                return {
                    ...lead,
                    history: [...(lead.history || []), historyItem],
                };
            })
        );
        // Synchronize with database
        await addLeadNote(leadId, noteText);
    };

    // Show initial session loader
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-hotlightgreen/40">
                <Loader2 />
            </div>
        );
    }

    // Render Login Gate for unauthenticated guests
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-hotlightgreen flex flex-col justify-center items-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-disabled p-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <Typography variant="h3" color="primary" className="font-extrabold tracking-tight">
                                Acadza
                            </Typography>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-16 text-primary">
                                Admin Portal
                            </span>
                        </div>
                        <Typography variant="body2" color="gray">
                            Restricted staff workspace for school administration & admissions.
                        </Typography>
                    </div>

                    {authError && (
                        <div className="mb-4 p-3 rounded-lg bg-alert/10 border border-alert/30 text-alert text-xs">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <InputField
                            label="Admin Email"
                            type="email"
                            placeholder="admin@acadza.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full justify-center"
                            disabled={authBusy}
                        >
                            {authBusy ? 'Authenticating...' : 'Sign In as Admin'}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-disabled text-center space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-center border-primary text-primary hover:bg-primary-16"
                            onClick={handleDemoAdmin}
                            disabled={authBusy}
                        >
                            1-Click Demo Admin Login
                        </Button>
                        <div>
                            <button
                                onClick={() => router.push(ROUTE_LOGIN)}
                                className="text-xs text-gray hover:text-primary transition-colors"
                            >
                                Back to Student Portal Login &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Active Lead for Detail View
    const currentLead = selectedLeadId ? leads.find((l) => l.id === selectedLeadId) : null;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Standard Admin Navigation Header */}
            <header className="sticky top-0 z-30 bg-white border-b border-disabled px-4 sm:px-8 py-3.5 shadow-xs">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            onClick={() => setView('hub')}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <span className="text-lg font-black tracking-tight text-primary">Acadza</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-16 text-primary">
                                Admin Portal
                            </span>
                        </div>

                        {/* Breadcrumb indicator when inside submodules */}
                        {view !== 'hub' && (
                            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray">
                                <span>/</span>
                                <button
                                    onClick={() => setView('hub')}
                                    className="hover:text-primary transition-colors font-semibold"
                                >
                                    Hub
                                </button>
                                <span>/</span>
                                <span className="text-heading font-bold capitalize">
                                    {view === 'users'
                                        ? 'Dashboard'
                                        : view === 'leads'
                                        ? 'Lead Management'
                                        : view === 'caller'
                                        ? 'Calling Desk'
                                        : view === 'add_enquiry'
                                        ? 'New Enquiry'
                                        : 'Lead Dossier'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                        {view !== 'hub' && (
                            <button
                                onClick={() => setView('hub')}
                                className="px-3 py-1.5 rounded-lg border border-disabled bg-white hover:bg-disabled/20 font-semibold text-heading transition-colors"
                            >
                                &larr; Switch Module
                            </button>
                        )}
                        <button
                            onClick={() => router.push(ROUTE_DASHBOARD)}
                            className="text-gray hover:text-primary font-semibold transition-colors hidden sm:block"
                        >
                            Student View
                        </button>
                        <button
                            onClick={logout}
                            className="px-3 py-1.5 rounded-lg bg-disabled/40 hover:bg-disabled/80 text-heading font-semibold transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Dynamic View Router */}
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* View 1: Module Hub */}
                {view === 'hub' && (
                    <PortalHub
                        metrics={hubMetrics}
                        onSelectModule={(mod) => {
                            if (mod === 'users') setView('users');
                            if (mod === 'leads') setView('leads');
                        }}
                    />
                )}

                {/* View 2: User & Student Management Dashboard */}
                {view === 'users' && (
                    <UserManagementDashboard
                        users={users}
                        onRoleChange={handleUserRoleChange}
                        onBlockUser={handleUserBlock}
                        onDeleteUser={handleUserDelete}
                        onAddUser={handleAddUser}
                    />
                )}

                {/* View 3: Admissions Leads Directory */}
                {view === 'leads' && (
                    <Directory
                        leads={leads}
                        onSelectLead={(id) => {
                            setSelectedLeadId(id);
                            setView('lead_detail');
                        }}
                        onNewEnquiry={() => setView('add_enquiry')}
                        onOpenCallingDesk={() => setView('caller')}
                    />
                )}

                {/* View 4: Caller Workspace Desk */}
                {view === 'caller' && (
                    <CallingDesk
                        leads={leads}
                        onSaveOutcome={handleSaveOutcome}
                        onBackToDirectory={() => setView('leads')}
                    />
                )}

                {/* View 5: Clerk Intake / Record Enquiry */}
                {view === 'add_enquiry' && (
                    <AddEnquiry
                        existingLeads={leads}
                        onSaveEnquiry={handleSaveEnquiry}
                        onCancel={() => setView('leads')}
                    />
                )}

                {/* View 6: Single Lead Detail Dossier */}
                {view === 'lead_detail' && (
                    <LeadDetail
                        lead={currentLead}
                        onBack={() => setView('leads')}
                        onStageChange={handleStageChange}
                        onAddNote={handleAddLeadNote}
                    />
                )}
            </main>
        </div>
    );
}
