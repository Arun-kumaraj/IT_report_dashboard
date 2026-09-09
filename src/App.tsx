import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { ServiceTable } from './components/ServiceTable';
import { JobTable } from './components/JobTable';
import { IncidentTable } from './components/IncidentTable';
import { AlertList } from './components/AlertList';
import { IncidentModal } from './components/IncidentModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { api } from './services/api';
import {
  AlertItem,
  CreateIncidentPayload,
  DashboardSummary,
  IncidentItem,
  IncidentSeverity,
  IncidentStatus,
  JobItem,
  ServiceItem,
  ServiceStatus,
} from './types';

export function App() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [sumRes, srvRes, jbRes, incRes, altRes] = await Promise.all([
        api.getSummary(),
        api.getServices(),
        api.getJobs(),
        api.getIncidents(),
        api.getAlerts(),
      ]);
      setSummary(sumRes);
      setServices(srvRes);
      setJobs(jbRes);
      setIncidents(incRes);
      setAlerts(altRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Background polling every 30 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Service status change (simulate DOWN or restore UP)
  const handleServiceStatusChange = async (service: ServiceItem, newStatus: ServiceStatus) => {
    try {
      await api.updateService(service.id, { status: newStatus });
      if (newStatus === 'DOWN') {
        showToast(`Simulated failure on "${service.name}". Alert and auto-incident generated!`);
      } else {
        showToast(`Service "${service.name}" restored to UP.`);
      }
      await loadData(true);
    } catch (err: any) {
      alert(`Error updating service status: ${err.message}`);
    }
  };

  // Trigger Job Run
  const handleTriggerJob = async (jobId: number) => {
    try {
      const updated = await api.triggerJobRun(jobId);
      if (updated.status === 'FAILED') {
        showToast(`Job "${updated.name}" failed! High severity alert recorded.`);
      } else {
        showToast(`Job "${updated.name}" executed successfully.`);
      }
      await loadData(true);
    } catch (err: any) {
      alert(`Failed to trigger job: ${err.message}`);
    }
  };

  // Create Incident
  const handleCreateIncident = async (payload: CreateIncidentPayload) => {
    await api.createIncident(payload);
    showToast(`Incident ticket logged successfully.`);
    await loadData(true);
  };

  // Update Incident Status
  const handleUpdateIncidentStatus = async (id: number, status: IncidentStatus) => {
    try {
      await api.updateIncidentStatus(id, status);
      showToast(`Incident INC-${String(id).padStart(3, '0')} updated to ${status}.`);
      await loadData(true);
    } catch (err: any) {
      alert(`Failed to update incident status: ${err.message}`);
    }
  };

  // Update Incident Severity
  const handleUpdateIncidentSeverity = async (id: number, severity: IncidentSeverity) => {
    try {
      await api.updateIncidentSeverity(id, severity);
      showToast(`Incident INC-${String(id).padStart(3, '0')} severity changed to ${severity}.`);
      await loadData(true);
    } catch (err: any) {
      alert(`Failed to update incident severity: ${err.message}`);
    }
  };

  // Delete Incident
  const handleDeleteIncident = async (id: number) => {
    if (confirm(`Are you sure you want to delete incident ticket INC-${String(id).padStart(3, '0')}?`)) {
      try {
        await api.deleteIncident(id);
        showToast(`Incident ticket deleted.`);
        await loadData(true);
      } catch (err: any) {
        alert(`Failed to delete incident: ${err.message}`);
      }
    }
  };

  // Acknowledge Alert
  const handleAcknowledgeAlert = async (id: number) => {
    try {
      await api.acknowledgeAlert(id);
      showToast(`Alert acknowledged.`);
      await loadData(true);
    } catch (err: any) {
      alert(`Failed to acknowledge alert: ${err.message}`);
    }
  };

  // Trigger manual simulation health ping
  const handleSimulateTick = async () => {
    setIsSimulating(true);
    try {
      await api.triggerSimulationTick();
      showToast('Health check cycle simulated! Latencies and timestamps updated.');
      await loadData(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased">
      {/* Top Navigation Bar */}
      <Header
        onRefresh={() => loadData(false)}
        isRefreshing={isRefreshing}
        onSimulateTick={handleSimulateTick}
        isSimulating={isSimulating}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          {toastMessage}
        </div>
      )}

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Section 1: Summary Metric Cards */}
        <section aria-label="System Metrics">
          <SummaryCards summary={summary} loading={loading} />
        </section>

        {/* Section 2: Services & Scheduled Jobs */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Monitoring Tables">
          <ServiceTable
            services={services}
            loading={loading}
            onStatusChange={handleServiceStatusChange}
          />
          <JobTable
            jobs={jobs}
            loading={loading}
            onTriggerJob={handleTriggerJob}
          />
        </section>

        {/* Section 3: Incident Management */}
        <section aria-label="Incident Management">
          <IncidentTable
            incidents={incidents}
            loading={loading}
            onOpenCreateModal={() => setIsIncidentModalOpen(true)}
            onUpdateStatus={handleUpdateIncidentStatus}
            onUpdateSeverity={handleUpdateIncidentSeverity}
            onDeleteIncident={handleDeleteIncident}
          />
        </section>

        {/* Section 4: Recent Alerts */}
        <section aria-label="Operational Alerts">
          <AlertList
            alerts={alerts}
            loading={loading}
            onAcknowledge={handleAcknowledgeAlert}
          />
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            IT Incident & Job Monitoring Dashboard • Built with Spring Boot, MySQL & React
          </p>
          <p className="text-slate-400">
            REST API: <code className="text-slate-600 font-mono">/api/services</code>, <code className="text-slate-600 font-mono">/api/jobs</code>, <code className="text-slate-600 font-mono">/api/incidents</code>, <code className="text-slate-600 font-mono">/api/alerts</code>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <IncidentModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        onSubmit={handleCreateIncident}
        services={services}
      />

      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}

export default App;
