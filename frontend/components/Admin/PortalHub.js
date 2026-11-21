import React from 'react';
import { ArrowRightIcon, UserIcon, ClockIcon } from './icons';

/**
 * Hub navigation matrix rendered upon admin authentication.
 * Mirrors the modular card layout of the Acadza portal ecosystem.
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
                {/* Module 1: User & Student Management */}
                <div
                    onClick={() => onSelectModule('users')}
                    className="group relative bg-white border border-disabled rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-16 text-primary flex items-center justify-center font-bold">
                                <UserIcon className="w-6 h-6" />
                            </div>
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary-16 text-primary">
                                System Core
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-heading group-hover:text-primary transition-colors">
                            Admin Dashboard
                        </h2>
                        <p className="text-sm text-gray mt-2 leading-relaxed">
                            Manage student directory, user roles, faculty privileges, course enrollments, and system accounts.
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-disabled/40 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray">
                            <div>
                                <span className="font-semibold text-heading">{metrics?.totalUsers || 0}</span> Total Users
                            </div>
                            <div>
                                <span className="font-semibold text-heading">{metrics?.activeStudents || 0}</span> Students
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                            <span>Open Dashboard</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Module 2: Lead Management & Admissions */}
                <div
                    onClick={() => onSelectModule('leads')}
                    className="group relative bg-white border border-disabled rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                                <ClockIcon className="w-6 h-6" />
                            </div>
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                                Admissions Funnel
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-heading group-hover:text-amber-700 transition-colors">
                            Lead Management
                        </h2>
                        <p className="text-sm text-gray mt-2 leading-relaxed">
                            Front desk clerk intake, calling desk queue, WhatsApp outreach, entrance test handovers, and conversion tracking.
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-disabled/40 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray">
                            <div>
                                <span className="font-semibold text-heading">{metrics?.totalLeads || 0}</span> Enquiries
                            </div>
                            <div>
                                <span className="font-semibold text-amber-700">{metrics?.dueCalls || 0}</span> Calls Due
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
                            <span>Open Lead Desk</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
