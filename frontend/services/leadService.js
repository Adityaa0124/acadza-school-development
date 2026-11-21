import axiosInstance from '@utils/axios';

/**
 * Service client for admissions leads and admin pipeline operations.
 * Communicates with backend /admin/leads endpoints using the authenticated session.
 */

export async function fetchLeads(params = {}) {
    try {
        const response = await axiosInstance.get('/admin/leads', { params });
        if (response.data && response.data.isSuccessful) {
            return response.data.leads || [];
        }
        return null;
    } catch (err) {
        console.warn('Backend leads API unavailable; operating in local mode:', err.message);
        return null;
    }
}

export async function fetchLeadStats() {
    try {
        const response = await axiosInstance.get('/admin/leads/stats');
        if (response.data && response.data.isSuccessful) {
            return response.data.stats || null;
        }
        return null;
    } catch (err) {
        console.warn('Backend lead stats API unavailable:', err.message);
        return null;
    }
}

export async function createLead(leadData) {
    try {
        const response = await axiosInstance.post('/admin/leads/create', leadData);
        if (response.data && response.data.isSuccessful) {
            return response.data.lead;
        }
        return null;
    } catch (err) {
        console.warn('Failed to persist new lead to backend:', err.message);
        return null;
    }
}

export async function recordLeadOutcome(payload) {
    try {
        const response = await axiosInstance.post('/admin/leads/outcome', payload);
        if (response.data && response.data.isSuccessful) {
            return response.data.lead;
        }
        return null;
    } catch (err) {
        console.warn('Failed to persist call outcome to backend:', err.message);
        return null;
    }
}

export async function updateLeadStage(id, stage) {
    try {
        const response = await axiosInstance.post('/admin/leads/stage', { id, stage });
        if (response.data && response.data.isSuccessful) {
            return response.data.lead;
        }
        return null;
    } catch (err) {
        console.warn('Failed to persist stage update to backend:', err.message);
        return null;
    }
}

export async function addLeadNote(id, note) {
    try {
        const response = await axiosInstance.post('/admin/leads/note', { id, note });
        if (response.data && response.data.isSuccessful) {
            return response.data.lead;
        }
        return null;
    } catch (err) {
        console.warn('Failed to persist note to backend:', err.message);
        return null;
    }
}
