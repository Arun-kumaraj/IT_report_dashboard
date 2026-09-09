import {
  AlertItem,
  CreateIncidentPayload,
  DashboardSummary,
  IncidentItem,
  IncidentSeverity,
  IncidentStatus,
  JobItem,
  JobStatus,
  ServiceItem,
  ServiceStatus,
} from '../types';

const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const data = await res.json();
      if (data.message) errorMsg = data.message;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export const api = {
  // Summary
  getSummary: async (): Promise<DashboardSummary> => {
    const res = await fetch(`${BASE_URL}/dashboard/summary`);
    return handleResponse<DashboardSummary>(res);
  },

  // Services
  getServices: async (status?: ServiceStatus): Promise<ServiceItem[]> => {
    const url = status ? `${BASE_URL}/services?status=${status}` : `${BASE_URL}/services`;
    const res = await fetch(url);
    return handleResponse<ServiceItem[]>(res);
  },

  updateService: async (id: number, payload: Partial<ServiceItem>): Promise<ServiceItem> => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<ServiceItem>(res);
  },

  deleteService: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/services/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Jobs
  getJobs: async (status?: JobStatus): Promise<JobItem[]> => {
    const url = status ? `${BASE_URL}/jobs?status=${status}` : `${BASE_URL}/jobs`;
    const res = await fetch(url);
    return handleResponse<JobItem[]>(res);
  },

  triggerJobRun: async (id: number): Promise<JobItem> => {
    const res = await fetch(`${BASE_URL}/jobs/${id}/run`, { method: 'POST' });
    return handleResponse<JobItem>(res);
  },

  // Incidents
  getIncidents: async (status?: IncidentStatus, severity?: IncidentSeverity): Promise<IncidentItem[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (severity) params.append('severity', severity);
    const url = `${BASE_URL}/incidents${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse<IncidentItem[]>(res);
  },

  createIncident: async (payload: CreateIncidentPayload): Promise<IncidentItem> => {
    const res = await fetch(`${BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<IncidentItem>(res);
  },

  updateIncidentStatus: async (id: number, status: IncidentStatus): Promise<IncidentItem> => {
    const res = await fetch(`${BASE_URL}/incidents/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
    return handleResponse<IncidentItem>(res);
  },

  updateIncidentSeverity: async (id: number, severity: IncidentSeverity): Promise<IncidentItem> => {
    const res = await fetch(`${BASE_URL}/incidents/${id}/severity?severity=${severity}`, {
      method: 'PATCH',
    });
    return handleResponse<IncidentItem>(res);
  },

  deleteIncident: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/incidents/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Alerts
  getAlerts: async (): Promise<AlertItem[]> => {
    const res = await fetch(`${BASE_URL}/alerts`);
    return handleResponse<AlertItem[]>(res);
  },

  acknowledgeAlert: async (id: number): Promise<AlertItem> => {
    const res = await fetch(`${BASE_URL}/alerts/${id}/acknowledge`, { method: 'PUT' });
    return handleResponse<AlertItem>(res);
  },

  // Simulation Health Check Tick
  triggerSimulationTick: async (): Promise<void> => {
    const res = await fetch(`${BASE_URL}/simulation/tick`, { method: 'POST' });
    return handleResponse<void>(res);
  },
};
