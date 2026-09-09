import React, { useState } from 'react';
import { Filter, Play, Loader2 } from 'lucide-react';
import { JobItem, JobStatus } from '../types';

interface JobTableProps {
  jobs: JobItem[];
  loading: boolean;
  onTriggerJob: (jobId: number) => Promise<void>;
}

export const JobTable: React.FC<JobTableProps> = ({ jobs, loading, onTriggerJob }) => {
  const [filter, setFilter] = useState<'ALL' | JobStatus>('ALL');
  const [runningJobId, setRunningJobId] = useState<number | null>(null);

  const filteredJobs = jobs.filter((j) => {
    if (filter === 'ALL') return true;
    return j.status === filter;
  });

  const handleRun = async (jobId: number) => {
    setRunningJobId(jobId);
    try {
      await onTriggerJob(jobId);
    } finally {
      setRunningJobId(null);
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            SUCCESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            FAILED
          </span>
        );
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <Loader2 className="w-3 h-3 animate-spin text-sky-600" />
            RUNNING
          </span>
        );
    }
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + date.toLocaleDateString() + ')';
  };

  return (
    <div id="job-monitoring-section" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header / Controls */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Scheduled Job Monitoring</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cron batches, data syncs, and background processing tasks
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-600 font-medium">Status Filter:</span>
          <select
            id="job-status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-xs rounded border border-slate-300 bg-white px-2.5 py-1 text-slate-700 focus:outline-hidden focus:border-slate-500 cursor-pointer"
          >
            <option value="ALL">All Jobs ({jobs.length})</option>
            <option value="SUCCESS">SUCCESS ({jobs.filter((j) => j.status === 'SUCCESS').length})</option>
            <option value="FAILED">FAILED ({jobs.filter((j) => j.status === 'FAILED').length})</option>
            <option value="RUNNING">RUNNING ({jobs.filter((j) => j.status === 'RUNNING').length})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <th className="py-3 px-5">Job Name</th>
              <th className="py-3 px-4">Schedule</th>
              <th className="py-3 px-4">Last Run</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Trigger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Loading jobs from database...
                </td>
              </tr>
            ) : filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No jobs matching "{filter}" status.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-5 font-medium text-slate-900">
                    <div className="font-semibold">{job.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{job.description}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">{job.schedule}</td>
                  <td className="py-3 px-4 text-slate-500">{formatTime(job.lastRun)}</td>
                  <td className="py-3 px-4">{getStatusBadge(job.status)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      id={`btn-run-job-${job.id}`}
                      onClick={() => handleRun(job.id)}
                      disabled={runningJobId === job.id || job.status === 'RUNNING'}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded disabled:opacity-50 transition-colors"
                    >
                      {runningJobId === job.id ? (
                        <Loader2 className="w-3 h-3 animate-spin text-slate-600" />
                      ) : (
                        <Play className="w-3 h-3 text-slate-600 fill-slate-600" />
                      )}
                      Run Now
                    </button>
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
