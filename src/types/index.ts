export type ServiceStatus = 'UP' | 'DOWN' | 'DEGRADED';
export type JobStatus = 'SUCCESS' | 'FAILED' | 'RUNNING';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type AlertType = 'SERVICE' | 'JOB';

export interface ServiceItem {
  id: number;
  name: string;
  description: string;
  status: ServiceStatus;
  responseTime: number | null;
  lastChecked: string;
}

export interface JobItem {
  id: number;
  name: string;
  description: string;
  schedule: string;
  lastRun: string | null;
  status: JobStatus;
}

export interface IncidentItem {
  id: number;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  serviceName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertItem {
  id: number;
  message: string;
  severity: IncidentSeverity;
  type: AlertType;
  acknowledged: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  servicesUp: number;
  servicesDown: number;
  openIncidents: number;
  failedJobs: number;
}

export interface CreateIncidentPayload {
  title: string;
  description: string;
  severity: IncidentSeverity;
  serviceName: string;
  status?: IncidentStatus;
}
