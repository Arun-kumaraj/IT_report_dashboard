import React, { useState } from 'react';
import { Filter, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { ServiceItem, ServiceStatus } from '../types';

interface ServiceTableProps {
  services: ServiceItem[];
  loading: boolean;
  onStatusChange: (service: ServiceItem, newStatus: ServiceStatus) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  loading,
  onStatusChange,
}) => {
  const [filter, setFilter] = useState<'ALL' | ServiceStatus>('ALL');

  const filteredServices = services.filter((s) => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case 'UP':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            UP
          </span>
        );
      case 'DOWN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            DOWN
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            DEGRADED
          </span>
        );
    }
  };

  const formatLastChecked = (isoString: string) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div id="service-monitoring-section" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header / Controls */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Service Monitoring</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitored backend microservices and health status
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-600 font-medium">Status Filter:</span>
          <select
            id="service-status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-xs rounded border border-slate-300 bg-white px-2.5 py-1 text-slate-700 focus:outline-hidden focus:border-slate-500 cursor-pointer"
          >
            <option value="ALL">All Services ({services.length})</option>
            <option value="UP">UP ({services.filter((s) => s.status === 'UP').length})</option>
            <option value="DOWN">DOWN ({services.filter((s) => s.status === 'DOWN').length})</option>
            <option value="DEGRADED">DEGRADED ({services.filter((s) => s.status === 'DEGRADED').length})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <th className="py-3 px-5">Service Name</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Response Time</th>
              <th className="py-3 px-4">Last Checked</th>
              <th className="py-3 px-4 text-right">Simulate Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Loading services from database...
                </td>
              </tr>
            ) : filteredServices.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No services matching "{filter}" status.
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-5 font-medium text-slate-900">
                    <div className="font-semibold">{service.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{service.description}</div>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(service.status)}</td>
                  <td className="py-3 px-4 font-mono">
                    {service.responseTime !== null ? (
                      <span className={service.responseTime > 300 ? 'text-amber-700 font-semibold' : 'text-slate-800'}>
                        {service.responseTime} ms
                      </span>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{formatLastChecked(service.lastChecked)}</td>
                  <td className="py-3 px-4 text-right">
                    {service.status === 'UP' ? (
                      <button
                        id={`btn-simulate-fail-${service.id}`}
                        onClick={() => onStatusChange(service, 'DOWN')}
                        title="Simulate service failing to test alert and auto-incident generation"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
                      >
                        <ArrowDownCircle className="w-3.5 h-3.5" />
                        Simulate Down
                      </button>
                    ) : (
                      <button
                        id={`btn-restore-${service.id}`}
                        onClick={() => onStatusChange(service, 'UP')}
                        title="Restore service to healthy state"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        Restore UP
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
