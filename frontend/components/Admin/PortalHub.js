import React from 'react';
import { ArrowRightIcon, UserIcon, ClockIcon } from './icons';

/**
 * Hub navigation matrix rendered upon admin authentication.
 * Fully colored, high-impact module cards matching Acadza design system.
 */
export default function PortalHub({ onSelectModule, metrics }) {
    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Administration Hub
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-heading tracking-tight mt-1">
                    Select Management Module
                </h1>
                <p className="text-sm text-gray mt-1">
                    Access school administration, user privileges, or the admissions lead funnel.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module 1: Admin Dashboard (Fully Colored Blue Card) */}
                <div
                    onClick={() => onSelectModule('users')}
                    className="group relative bg-gradient-to-br from-[#2D5BFF] via-[#1254FF] to-[#0038D1] rounded-2xl p-7 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[250px]"
                >
                    {/* Subtle decorative background glow */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="w-12 h-12 rounded-xl bg-white/20 text-white backdrop-blur-xs flex items-center justify-center font-bold border border-white/30 shadow-inner">
                                <UserIcon className="w-6 h-6" />
                            </div>
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/30 tracking-wide uppercase">
                                System Core
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Admin Dashboard
                        </h2>
                        <p className="text-sm text-blue-100/90 mt-2 leading-relaxed">
                            Manage student directory, user roles, faculty privileges, course enrollments, and system accounts.
                        </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-blue-100">
                            <div>
                                <span className="font-bold text-white text-sm">{metrics?.totalUsers || 0}</span> Total Users
                            </div>
                            <div>
                                <span className="font-bold text-white text-sm">{metrics?.activeStudents || 0}</span> Students
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-lg border border-white/30 transition-all group-hover:translate-x-1">
                            <span>Open Dashboard</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Module 2: Lead Management (Fully Colored Warm Amber-Orange Card) */}
                <div
                    onClick={() => onSelectModule('leads')}
                    className="group relative bg-gradient-to-br from-[#FF842B] via-[#E06A19] to-[#B84500] rounded-2xl p-7 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[250px]"
                >
                    {/* Subtle decorative background glow */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="w-12 h-12 rounded-xl bg-white/20 text-white backdrop-blur-xs flex items-center justify-center font-bold border border-white/30 shadow-inner">
                                <ClockIcon className="w-6 h-6" />
                            </div>
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/30 tracking-wide uppercase">
                                Admissions Funnel
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Lead Management
                        </h2>
                        <p className="text-sm text-orange-100/90 mt-2 leading-relaxed">
                            Front desk clerk intake, calling desk queue, WhatsApp outreach, entrance test handovers, and conversion tracking.
                        </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-orange-100">
                            <div>
                                <span className="font-bold text-white text-sm">{metrics?.totalLeads || 0}</span> Enquiries
                            </div>
                            <div>
                                <span className="font-bold text-white text-sm">{metrics?.dueCalls || 0}</span> Calls Due
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-lg border border-white/30 transition-all group-hover:translate-x-1">
                            <span>Open Lead Desk</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
