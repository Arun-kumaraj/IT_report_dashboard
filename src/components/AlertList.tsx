import React from 'react';
import { AlertOctagon, Check, Clock } from 'lucide-react';
import { AlertItem, IncidentSeverity } from '../types';

interface AlertListProps {
  alerts: AlertItem[];
  loading: boolean;
  onAcknowledge: (id: number) => Promise<void>;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts, loading, onAcknowledge }) => {
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

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

  const formatTime = (isoString: string) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + date.toLocaleDateString() + ')';
  };

  return (
    <div id="alerts-section" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Alerts</h2>
            {unacknowledgedCount > 0 ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                {unacknowledgedCount} Active
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                0 Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts raised when services go DOWN or jobs FAIL
          </p>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 text-xs">
        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading alerts from database...</div>
        ) : alerts.length === 0 ? (
          <div className="py-8 text-center text-slate-400">No alerts recorded. All systems normal.</div>
        ) : (
          alerts.slice(0, 8).map((alert) => (
            <div
              key={alert.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                alert.acknowledged ? 'bg-slate-50/40 opacity-75' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 p-1.5 rounded-md ${
                    alert.severity === 'CRITICAL' || alert.severity === 'HIGH'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getSeverityBadge(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {alert.type}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(alert.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 mt-1">{alert.message}</p>
                </div>
              </div>

              <div className="shrink-0 flex items-center self-end sm:self-center">
                {alert.acknowledged ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Acknowledged
                  </span>
                ) : (
                  <button
                    id={`btn-ack-alert-${alert.id}`}
                    onClick={() => onAcknowledge(alert.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-slate-600" />
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
