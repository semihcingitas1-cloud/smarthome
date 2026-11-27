import axios from 'axios';

const BASE_URL = "https://ornekciceksitesi.com";
// Sunucudaki tüm route'lar kökte (index.js: app.use('/', ...)); automationSlice ile aynı
const API_URL = BASE_URL;

// Onay isteklerinin adresleri: mobildeki services/approvals.js ile aynı olmalı
const APPROVALS_PENDING_PATH = '/automation/approvals';
const approvalRespondPath = (id) => `/automation/approvals/${id}/respond`;

const request = async (method, path, body) => {
  const { data } = await axios({
    method,
    url: `${API_URL}${path}`,
    data: body,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    timeout: 15000,
  });
  return data;
};

export const apiError = (e, fallback) => e?.response?.data?.message ?? fallback;

// ── Ev durumu ──
export const getHomeStateApi = (homeId) => request('get', `/homes/${homeId}/state`);
export const setHomeModeApi = (homeId, mode) => request('put', `/homes/${homeId}/mode`, { mode });

// ── Sahneler ──
export const getScenesApi = (homeId) => request('get', `/homes/${homeId}/scenes`);

// ── Onay istekleri ──
export const getPendingApprovalsApi = async () => (await request('get', APPROVALS_PENDING_PATH)).approvals ?? [];
export const respondToApprovalApi = (approvalId, response) => request('post', approvalRespondPath(approvalId), { response });
