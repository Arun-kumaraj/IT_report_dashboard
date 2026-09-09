import React from 'react';
import { Activity, RefreshCw, Server, BookOpen } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onSimulateTick: () => void;
  isSimulating: boolean;
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isRefreshing,
  onSimulateTick,
  isSimulating,
  onOpenArchitecture,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center text-white shadow-xs">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                IT Incident & Job Monitoring
              </h1>
              <p className="text-xs text-slate-550 flex items-center gap-1.5 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Internal IT Operations Dashboard • Simulated Health Worker Active
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5">
            <button
              id="simulate-health-check-btn"
              onClick={onSimulateTick}
              disabled={isSimulating}
              title="Simulates background health check cycle"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              <Activity className={`w-3.5 h-3.5 text-slate-600 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Pinging...' : 'Ping Services'}
            </button>

            <button
              id="refresh-dashboard-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Reload all dashboard data from backend"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              id="view-architecture-btn"
              onClick={onOpenArchitecture}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-300" />
              Architecture & Code
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
