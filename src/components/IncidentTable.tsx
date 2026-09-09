import React, { useState } from 'react';
import { Filter, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { IncidentItem, IncidentSeverity, IncidentStatus } from '../types';

interface IncidentTableProps {
  incidents: IncidentItem[];
  loading: boolean;
  onOpenCreateModal: () => void;
  onUpdateStatus: (id: number, status: IncidentStatus) => Promise<void>;
  onUpdateSeverity: (id: number, severity: IncidentSeverity) => Promise<void>;
  onDeleteIncident: (id: number) => Promise<void>;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  loading,
  onOpenCreateModal,
  onUpdateStatus,
  onUpdateSeverity,
  onDeleteIncident,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | IncidentSeverity>('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) return false;
    return true;
  });

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'LOW':
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const formatCreatedAt = (isoString: string) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="incident-management-section" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Incident Management</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {incidents.length} Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Support tickets, operational outages, and resolution tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="incident-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs rounded border border-slate-300 bg-white px-2 py-1 text-slate-700 focus:outline-hidden focus:border-slate-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 text-xs">
            <select
              id="incident-severity-filter"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="text-xs rounded border border-slate-300 bg-white px-2 py-1 text-slate-700 focus:outline-hidden focus:border-slate-500 cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            id="create-incident-btn"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Incident
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <th className="py-3 px-5">Incident ID</th>
              <th className="py-3 px-4">Title & Description</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Loading incidents from database...
                </td>
              </tr>
            ) : filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No incidents matching current filters.
                </td>
              </tr>
            ) : (
              filteredIncidents.map((incident) => {
                const formattedId = `INC-${String(incident.id).padStart(3, '0')}`;
                return (
                  <tr key={incident.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formattedId}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900">{incident.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {incident.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {incident.serviceName}
                      </span>
                    </td>
                    {/* Severity dropdown */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={incident.severity}
                        onChange={(e) => onUpdateSeverity(incident.id, e.target.value as any)}
                        className={`text-[11px] font-semibold rounded px-2 py-0.5 border cursor-pointer ${getSeverityBadge(
                          incident.severity
                        )}`}
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </td>
                    {/* Status dropdown */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={incident.status}
                        onChange={(e) => onUpdateStatus(incident.id, e.target.value as any)}
                        className={`text-[11px] font-semibold rounded px-2 py-0.5 border cursor-pointer ${
                          incident.status === 'OPEN'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : incident.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatCreatedAt(incident.createdAt)}
                    </td>
                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {incident.status !== 'RESOLVED' ? (
                          <button
                            onClick={() => onUpdateStatus(incident.id, 'RESOLVED')}
                            title="Quick mark as Resolved"
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Resolve
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateStatus(incident.id, 'IN_PROGRESS')}
                            title="Re-open ticket"
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition-colors"
                          >
                            <Clock className="w-3 h-3" />
                            Re-open
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteIncident(incident.id)}
                          title="Delete incident"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
