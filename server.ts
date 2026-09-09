import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent database file
const DB_FILE = path.join(process.cwd(), "src", "data", "db.json");

interface ServiceItem {
  id: number;
  name: string;
  description: string;
  status: "UP" | "DOWN" | "DEGRADED";
  responseTime: number | null;
  lastChecked: string;
}

interface JobItem {
  id: number;
  name: string;
  description: string;
  schedule: string;
  lastRun: string | null;
  status: "SUCCESS" | "FAILED" | "RUNNING";
}

interface IncidentItem {
  id: number;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  serviceName: string;
  createdAt: string;
  updatedAt: string;
}

interface AlertItem {
  id: number;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  type: "SERVICE" | "JOB";
  acknowledged: boolean;
  createdAt: string;
}

interface DatabaseSchema {
  services: ServiceItem[];
  jobs: JobItem[];
  incidents: IncidentItem[];
  alerts: AlertItem[];
}

function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading db.json:", err);
  }
  return { services: [], jobs: [], incidents: [], alerts: [] };
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}

/**
 * AUTOMATED INCIDENT & ALERT LOGIC
 * Mirrors ServiceMonitoringService.java handleServiceFailure()
 */
function handleServiceFailure(db: DatabaseSchema, service: ServiceItem) {
  const alertMsg = `${service.name} is DOWN`;

  // 1. Create alert if unacknowledged doesn't exist
  const existingAlert = db.alerts.find(
    (a) => a.message === alertMsg && !a.acknowledged
  );
  if (!existingAlert) {
    const newAlert: AlertItem = {
      id: db.alerts.length > 0 ? Math.max(...db.alerts.map((a) => a.id)) + 1 : 1,
      message: alertMsg,
      severity: "CRITICAL",
      type: "SERVICE",
      acknowledged: false,
      createdAt: new Date().toISOString(),
    };
    db.alerts.unshift(newAlert);
  }

  // 2. Create automated incident if no unresolved ticket exists
  const hasActiveIncident = db.incidents.some(
    (inc) => inc.serviceName === service.name && inc.status !== "RESOLVED"
  );

  if (!hasActiveIncident) {
    const newIncident: IncidentItem = {
      id: db.incidents.length > 0 ? Math.max(...db.incidents.map((i) => i.id)) + 1 : 1,
      title: `${service.name} service failure`,
      description: `Automated alert: ${service.name} became unreachable during automated health check ping. Response time: -- ms.`,
      severity: "CRITICAL",
      status: "OPEN",
      serviceName: service.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.incidents.unshift(newIncident);
  }
}

// =========================================================================
// REST API ENDPOINTS
// =========================================================================

// GET /api/dashboard/summary
app.get("/api/dashboard/summary", (req, res) => {
  const db = readDb();
  const servicesUp = db.services.filter((s) => s.status === "UP").length;
  const servicesDown = db.services.filter((s) => s.status === "DOWN").length;
  const openIncidents = db.incidents.filter(
    (i) => i.status === "OPEN" || i.status === "IN_PROGRESS"
  ).length;
  const failedJobs = db.jobs.filter((j) => j.status === "FAILED").length;

  res.json({
    servicesUp,
    servicesDown,
    openIncidents,
    failedJobs,
  });
});

// GET /api/services
app.get("/api/services", (req, res) => {
  const db = readDb();
  const { status } = req.query;
  if (status) {
    return res.json(db.services.filter((s) => s.status === status));
  }
  res.json(db.services);
});

// GET /api/services/:id
app.get("/api/services/:id", (req, res) => {
  const db = readDb();
  const service = db.services.find((s) => s.id === Number(req.params.id));
  if (!service) {
    return res.status(404).json({ status: 404, message: "Service not found" });
  }
  res.json(service);
});

// POST /api/services
app.post("/api/services", (req, res) => {
  const { name, description, status, responseTime } = req.body;
  if (!name) {
    return res.status(400).json({ status: 400, message: "Service name is required" });
  }
  const db = readDb();
  const newService: ServiceItem = {
    id: db.services.length > 0 ? Math.max(...db.services.map((s) => s.id)) + 1 : 1,
    name,
    description: description || "",
    status: status || "UP",
    responseTime: responseTime !== undefined ? responseTime : 50,
    lastChecked: new Date().toISOString(),
  };

  db.services.push(newService);
  if (newService.status === "DOWN") {
    handleServiceFailure(db, newService);
  }
  writeDb(db);
  res.status(201).json(newService);
});

// PUT /api/services/:id
app.put("/api/services/:id", (req, res) => {
  const db = readDb();
  const index = db.services.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ status: 404, message: "Service not found" });
  }

  const oldStatus = db.services[index].status;
  const updated: ServiceItem = {
    ...db.services[index],
    ...req.body,
    lastChecked: new Date().toISOString(),
  };

  db.services[index] = updated;

  // If status became DOWN, trigger alert and automated incident
  if (oldStatus !== "DOWN" && updated.status === "DOWN") {
    handleServiceFailure(db, updated);
  }

  writeDb(db);
  res.json(updated);
});

// DELETE /api/services/:id
app.delete("/api/services/:id", (req, res) => {
  const db = readDb();
  const index = db.services.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ status: 404, message: "Service not found" });
  }
  db.services.splice(index, 1);
  writeDb(db);
  res.status(204).send();
});

// GET /api/jobs
app.get("/api/jobs", (req, res) => {
  const db = readDb();
  const { status } = req.query;
  if (status) {
    return res.json(db.jobs.filter((j) => j.status === status));
  }
  res.json(db.jobs);
});

// GET /api/jobs/:id
app.get("/api/jobs/:id", (req, res) => {
  const db = readDb();
  const job = db.jobs.find((j) => j.id === Number(req.params.id));
  if (!job) {
    return res.status(404).json({ status: 404, message: "Job not found" });
  }
  res.json(job);
});

// PUT /api/jobs/:id
app.put("/api/jobs/:id", (req, res) => {
  const db = readDb();
  const index = db.jobs.findIndex((j) => j.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ status: 404, message: "Job not found" });
  }
  db.jobs[index] = { ...db.jobs[index], ...req.body };
  writeDb(db);
  res.json(db.jobs[index]);
});

// POST /api/jobs/:id/run (trigger job run simulation)
app.post("/api/jobs/:id/run", (req, res) => {
  const db = readDb();
  const job = db.jobs.find((j) => j.id === Number(req.params.id));
  if (!job) {
    return res.status(404).json({ status: 404, message: "Job not found" });
  }

  job.lastRun = new Date().toISOString();
  const succeeds = Math.random() > 0.3; // 70% success, 30% failure
  job.status = succeeds ? "SUCCESS" : "FAILED";

  if (!succeeds) {
    const alertMsg = `${job.name} Job FAILED on scheduled execution`;
    const newAlert: AlertItem = {
      id: db.alerts.length > 0 ? Math.max(...db.alerts.map((a) => a.id)) + 1 : 1,
      message: alertMsg,
      severity: "HIGH",
      type: "JOB",
      acknowledged: false,
      createdAt: new Date().toISOString(),
    };
    db.alerts.unshift(newAlert);
  }

  writeDb(db);
  res.json(job);
});

// GET /api/incidents
app.get("/api/incidents", (req, res) => {
  const db = readDb();
  const { status, severity } = req.query;
  let result = db.incidents;
  if (status) {
    result = result.filter((i) => i.status === status);
  }
  if (severity) {
    result = result.filter((i) => i.severity === severity);
  }
  res.json(result);
});

// GET /api/incidents/:id
app.get("/api/incidents/:id", (req, res) => {
  const db = readDb();
  const incident = db.incidents.find((i) => i.id === Number(req.params.id));
  if (!incident) {
    return res.status(404).json({ status: 404, message: "Incident not found" });
  }
  res.json(incident);
});

// POST /api/incidents
app.post("/api/incidents", (req, res) => {
  const { title, description, severity, status, serviceName } = req.body;
  if (!title || !description || !severity || !serviceName) {
    return res.status(400).json({
      status: 400,
      message: "title, description, severity, and serviceName are all required fields",
    });
  }

  const db = readDb();
  const newIncident: IncidentItem = {
    id: db.incidents.length > 0 ? Math.max(...db.incidents.map((i) => i.id)) + 1 : 1,
    title,
    description,
    severity,
    status: status || "OPEN",
    serviceName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.incidents.unshift(newIncident);
  writeDb(db);
  res.status(201).json(newIncident);
});

// PUT /api/incidents/:id
app.put("/api/incidents/:id", (req, res) => {
  const db = readDb();
  const index = db.incidents.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ status: 404, message: "Incident not found" });
  }
  db.incidents[index] = {
    ...db.incidents[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  res.json(db.incidents[index]);
});

// PATCH /api/incidents/:id/status
app.patch("/api/incidents/:id/status", (req, res) => {
  const { status } = req.query;
  if (!status) {
    return res.status(400).json({ status: 400, message: "Status query parameter is required" });
  }
  const db = readDb();
  const incident = db.incidents.find((i) => i.id === Number(req.params.id));
  if (!incident) {
    return res.status(404).json({ status: 404, message: "Incident not found" });
  }
  incident.status = status as any;
  incident.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json(incident);
});

// PATCH /api/incidents/:id/severity
app.patch("/api/incidents/:id/severity", (req, res) => {
  const { severity } = req.query;
  if (!severity) {
    return res.status(400).json({ status: 400, message: "Severity query parameter is required" });
  }
  const db = readDb();
  const incident = db.incidents.find((i) => i.id === Number(req.params.id));
  if (!incident) {
    return res.status(404).json({ status: 404, message: "Incident not found" });
  }
  incident.severity = severity as any;
  incident.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json(incident);
});

// DELETE /api/incidents/:id
app.delete("/api/incidents/:id", (req, res) => {
  const db = readDb();
  const index = db.incidents.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ status: 404, message: "Incident not found" });
  }
  db.incidents.splice(index, 1);
  writeDb(db);
  res.status(204).send();
});

// GET /api/alerts
app.get("/api/alerts", (req, res) => {
  const db = readDb();
  res.json(db.alerts);
});

// PUT /api/alerts/:id/acknowledge
app.put("/api/alerts/:id/acknowledge", (req, res) => {
  const db = readDb();
  const alert = db.alerts.find((a) => a.id === Number(req.params.id));
  if (!alert) {
    return res.status(404).json({ status: 404, message: "Alert not found" });
  }
  alert.acknowledged = true;
  writeDb(db);
  res.json(alert);
});

// POST /api/simulation/tick (Manually triggers a simulated health check cycle)
app.post("/api/simulation/tick", (req, res) => {
  const db = readDb();
  db.services.forEach((s) => {
    s.lastChecked = new Date().toISOString();
    if (s.status === "UP") {
      s.responseTime = Math.floor(25 + Math.random() * 110);
    } else if (s.status === "DEGRADED") {
      s.responseTime = Math.floor(350 + Math.random() * 180);
    } else {
      s.responseTime = null;
    }
  });
  writeDb(db);
  res.json({ message: "Health check tick completed", services: db.services });
});

// =========================================================================
// BACKGROUND SIMULATION WORKER (@Scheduled simulation)
// =========================================================================
setInterval(() => {
  try {
    const db = readDb();
    let changed = false;
    db.services.forEach((s) => {
      s.lastChecked = new Date().toISOString();
      if (s.status === "UP") {
        s.responseTime = Math.floor(20 + Math.random() * 100);
        changed = true;
      }
    });
    if (changed) {
      writeDb(db);
    }
  } catch (err) {
    // silently catch background interval errors
  }
}, 30000);

// =========================================================================
// VITE MIDDLEWARE / SPA FALLBACK
// =========================================================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IT Incident & Job Monitoring Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
