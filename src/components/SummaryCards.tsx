import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, XCircle } from 'lucide-react';
import { DashboardSummary } from '../types';

interface SummaryCardsProps {
  summary: DashboardSummary | null;
  loading: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, loading }) => {
  const cards = [
    {
      id: 'card-services-up',
      label: 'Services Up',
      value: summary ? summary.servicesUp : 0,
      icon: CheckCircle2,
      borderColor: 'border-emerald-300',
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/60',
      textColor: 'text-emerald-950',
    },
    {
      id: 'card-services-down',
      label: 'Services Down',
      value: summary ? summary.servicesDown : 0,
      icon: AlertOctagon,
      borderColor: summary && summary.servicesDown > 0 ? 'border-rose-300' : 'border-slate-200',
      iconColor: summary && summary.servicesDown > 0 ? 'text-rose-600' : 'text-slate-400',
      bgColor: summary && summary.servicesDown > 0 ? 'bg-rose-50/60' : 'bg-slate-50',
      textColor: summary && summary.servicesDown > 0 ? 'text-rose-950' : 'text-slate-700',
    },
    {
      id: 'card-open-incidents',
      label: 'Open Incidents',
      value: summary ? summary.openIncidents : 0,
      icon: AlertTriangle,
      borderColor: summary && summary.openIncidents > 0 ? 'border-amber-300' : 'border-slate-200',
      iconColor: summary && summary.openIncidents > 0 ? 'text-amber-600' : 'text-slate-400',
      bgColor: summary && summary.openIncidents > 0 ? 'bg-amber-50/60' : 'bg-slate-50',
      textColor: summary && summary.openIncidents > 0 ? 'text-amber-950' : 'text-slate-700',
    },
    {
      id: 'card-failed-jobs',
      label: 'Failed Jobs',
      value: summary ? summary.failedJobs : 0,
      icon: XCircle,
      borderColor: summary && summary.failedJobs > 0 ? 'border-rose-300' : 'border-slate-200',
      iconColor: summary && summary.failedJobs > 0 ? 'text-rose-600' : 'text-slate-400',
      bgColor: summary && summary.failedJobs > 0 ? 'bg-rose-50/60' : 'bg-slate-50',
      textColor: summary && summary.failedJobs > 0 ? 'text-rose-950' : 'text-slate-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`p-4 rounded-lg bg-white border ${card.borderColor} shadow-xs flex items-center justify-between transition-shadow hover:shadow-sm`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${card.textColor}`}>
                {loading ? '...' : card.value}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${card.bgColor}`}>
              <Icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
