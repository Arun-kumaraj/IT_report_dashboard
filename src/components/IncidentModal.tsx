import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { CreateIncidentPayload, IncidentSeverity, IncidentStatus, ServiceItem } from '../types';

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateIncidentPayload) => Promise<void>;
  services: ServiceItem[];
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  services,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH');
  const [serviceName, setServiceName] = useState('');
  const [status] = useState<IncidentStatus>('OPEN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Incident title is required');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Description is required');
      return;
    }
    if (!serviceName.trim()) {
      setErrorMessage('Please select or specify a service name');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        severity,
        serviceName: serviceName.trim(),
        status,
      });
      // reset form
      setTitle('');
      setDescription('');
      setSeverity('HIGH');
      setServiceName('');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Create Incident Ticket</h3>
            <p className="text-xs text-slate-500">Log a new operational incident in the system</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Incident Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="incident-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Payment Gateway SSL Certificate Expired"
              maxLength={150}
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Associated Service <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-1.5">
              <select
                id="incident-service-select"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:border-slate-500 bg-white"
              >
                <option value="">-- Choose from Monitored Services --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.status})
                  </option>
                ))}
                <option value="Other">Other / Custom Service</option>
              </select>
              {serviceName === 'Other' && (
                <input
                  type="text"
                  placeholder="Type custom service name..."
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:border-slate-500 mt-1"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Severity Level <span className="text-rose-500">*</span>
              </label>
              <select
                id="incident-severity-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:border-slate-500 bg-white"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
              <input
                type="text"
                disabled
                value="OPEN"
                className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Description & Troubleshooting Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="incident-description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide symptoms, error messages, and customer impact..."
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:border-slate-500"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-incident-btn"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
