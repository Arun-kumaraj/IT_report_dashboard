import React, { useState } from 'react';
import { X, Layers, Database, Code, HelpCircle } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'schema' | 'java' | 'interview'>('flow');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Java + Spring Boot + MySQL Architecture & Interview Guide
            </h3>
            <p className="text-xs text-slate-500">
              Technical documentation and code walkthrough for your portfolio interview
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'flow'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Layered Architecture
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            MySQL Schema
          </button>
          <button
            onClick={() => setActiveTab('java')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'java'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Spring Boot Classes
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'interview'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Interview Q&A Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
          {activeTab === 'flow' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-slate-200 rounded font-mono text-[11px] leading-relaxed whitespace-pre overflow-x-auto">
{`React Frontend (Vite)
       │ HTTP / REST (JSON)
       ▼
Spring Boot Controllers (@RestController)
  ├── ServiceController.java    --> /api/services
  ├── JobController.java        --> /api/jobs
  ├── IncidentController.java   --> /api/incidents
  ├── AlertController.java      --> /api/alerts
  └── DashboardController.java  --> /api/dashboard/summary
       │ Calls Business Logic
       ▼
Service Layer (@Service, @Transactional)
  ├── ServiceMonitoringService
  ├── JobMonitoringService
  ├── IncidentService
  ├── AlertService
  └── DashboardService
       ▲
       │ Triggers health checks & automated incident creation
  MonitoringScheduler (@Scheduled fixedRate = 30000)
       │
       ▼
Data Access Layer (Spring Data JpaRepository)
  ├── ServiceRepository  (countByStatus, findByStatus)
  ├── JobRepository      (countByStatus, findByStatus)
  ├── IncidentRepository (countByStatus, filtering queries)
  └── AlertRepository    (findAllByOrderByCreatedAtDesc)
       │ Hibernate ORM / JDBC
       ▼
MySQL Database (services, jobs, incidents, alerts)`}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 border border-slate-200 rounded bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-1">1. Presentation & Controller</h4>
                  <p className="text-slate-600 leading-relaxed">
                    React consumes REST APIs. Spring Boot Controllers map HTTP requests, bind path variables, and use Jakarta validation (<code>@Valid</code>) to validate incoming request bodies.
                  </p>
                </div>
                <div className="p-3 border border-slate-200 rounded bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-1">2. Service & Business Automation</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Contains business rules and transactional integrity (<code>@Transactional</code>). When a service fails, it checks for active tickets and automatically logs a ticket without duplication.
                  </p>
                </div>
                <div className="p-3 border border-slate-200 rounded bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-1">3. JPA Repositories</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Spring Data JPA generates optimized SQL from method signatures (e.g. <code>countByStatus()</code>) eliminating hundreds of lines of boilerplate JDBC code.
                  </p>
                </div>
                <div className="p-3 border border-slate-200 rounded bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-1">4. Scheduled Background Worker</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Enabled with <code>@EnableScheduling</code>. Runs <code>@Scheduled(fixedRate = 30000)</code> to simulate periodic heartbeats, latency checks, and failure alarms.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                The database schema consists of 4 clean relational tables designed for MySQL with appropriate indexing, primary keys, and timestamp columns.
              </p>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded font-mono text-[11px] leading-relaxed overflow-x-auto">
{`-- 1. services table
CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL, -- 'UP', 'DOWN', 'DEGRADED'
    response_time INT,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. jobs table
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    schedule VARCHAR(50) NOT NULL,
    last_run TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL -- 'SUCCESS', 'FAILED', 'RUNNING'
);

-- 3. incidents table
CREATE TABLE incidents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    status VARCHAR(20) NOT NULL,   -- 'OPEN', 'IN_PROGRESS', 'RESOLVED'
    service_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. alerts table
CREATE TABLE alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,     -- 'SERVICE', 'JOB'
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
              </pre>
            </div>
          )}

          {activeTab === 'java' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Complete Java code is organized under <code>/backend/src/main/java/com/example/monitoring/</code>:
              </p>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <span className="font-bold text-slate-800">MonitoringApplication.java</span>
                  <span className="text-slate-500 font-sans">@SpringBootApplication, @EnableScheduling</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <span className="font-bold text-slate-800">ServiceMonitoringService.java</span>
                  <span className="text-slate-500 font-sans">Handles service failure, alert & auto-incident logic</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <span className="font-bold text-slate-800">MonitoringScheduler.java</span>
                  <span className="text-slate-500 font-sans">@Scheduled(fixedRate = 30000) health check task</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <span className="font-bold text-slate-800">IncidentController.java</span>
                  <span className="text-slate-500 font-sans">REST endpoints for viewing, filtering, updating tickets</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <span className="font-bold text-slate-800">GlobalExceptionHandler.java</span>
                  <span className="text-slate-500 font-sans">@RestControllerAdvice handles 404, 400 validation, 500</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded p-3 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q1: How does the automatic incident creation work?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  <em>"When a service health check reports DOWN or is changed to DOWN, <code>ServiceMonitoringService.handleServiceFailure()</code> is called. It creates an unacknowledged CRITICAL alert in the alerts table, checks via <code>IncidentRepository.existsByServiceNameAndStatusNot(serviceName, IncidentStatus.RESOLVED)</code> if an unresolved ticket already exists, and if not, saves a new ticket with status OPEN."</em>
                </p>
              </div>

              <div className="border border-slate-200 rounded p-3 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q2: Why did you use DTOs instead of passing JPA Entities directly?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  <em>"DTOs prevent over-posting and hide internal database fields like IDs and timestamps. They also allow using Jakarta validation annotations like <code>@NotBlank</code> and <code>@Size</code> on input payloads without polluting database entity definitions."</em>
                </p>
              </div>

              <div className="border border-slate-200 rounded p-3 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q3: How are dashboard statistics computed?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  <em>"The <code>/api/dashboard/summary</code> endpoint invokes <code>DashboardService.getSummary()</code>, which calls Spring Data derived queries <code>serviceRepository.countByStatus(UP)</code>, <code>countByStatus(DOWN)</code>, <code>incidentRepository.countByStatus(OPEN)</code>, and <code>jobRepository.countByStatus(FAILED)</code>. These run direct SQL <code>SELECT COUNT(*)</code> statements on MySQL."</em>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
