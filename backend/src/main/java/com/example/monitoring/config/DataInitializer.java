package com.example.monitoring.config;

import com.example.monitoring.entity.*;
import com.example.monitoring.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ServiceRepository serviceRepository;
    private final JobRepository jobRepository;
    private final IncidentRepository incidentRepository;
    private final AlertRepository alertRepository;

    @Autowired
    public DataInitializer(ServiceRepository serviceRepository,
                           JobRepository jobRepository,
                           IncidentRepository incidentRepository,
                           AlertRepository alertRepository) {
        this.serviceRepository = serviceRepository;
        this.jobRepository = jobRepository;
        this.incidentRepository = incidentRepository;
        this.alertRepository = alertRepository;
    }

    @Override
    public void run(String... args) {
        if (serviceRepository.count() == 0) {
            log.info("Database is empty. Initializing sample monitoring data...");

            // 1. Seed Services
            serviceRepository.save(new ServiceEntity("Payment Gateway API", "Handles customer checkout, card payments", ServiceStatus.UP, 115));
            serviceRepository.save(new ServiceEntity("User Authentication Service", "JWT session validation and OAuth SSO", ServiceStatus.UP, 65));
            serviceRepository.save(new ServiceEntity("Notification Engine", "Sends transactional SMS and email alerts", ServiceStatus.DOWN, null));
            serviceRepository.save(new ServiceEntity("Order Management Service", "Processes orders and fulfillment queues", ServiceStatus.DEGRADED, 420));
            serviceRepository.save(new ServiceEntity("Core Database Cluster", "Primary transactional database instance", ServiceStatus.UP, 18));

            // 2. Seed Jobs
            jobRepository.save(new JobEntity("Database Backup", "Automated snapshot dump to S3 cold storage", "Daily 02:00 AM", JobStatus.SUCCESS));
            jobRepository.save(new JobEntity("Customer Billing Batch", "Nightly subscription renewal and invoice generation", "Daily 04:00 AM", JobStatus.FAILED));
            jobRepository.save(new JobEntity("Inventory Catalog Sync", "Hourly product stock synchronization", "Every Hour", JobStatus.SUCCESS));
            jobRepository.save(new JobEntity("Audit Log Archival", "Rotates compliance logs to archival storage", "Weekly Sunday", JobStatus.SUCCESS));

            // 3. Seed Incidents
            IncidentEntity inc1 = new IncidentEntity(
                    "Notification Engine Connection Timeout",
                    "Notification Engine stopped responding to health checks. Customers cannot receive OTP SMS.",
                    IncidentSeverity.CRITICAL,
                    IncidentStatus.OPEN,
                    "Notification Engine"
            );
            incidentRepository.save(inc1);

            IncidentEntity inc2 = new IncidentEntity(
                    "Billing Batch partial transaction failure",
                    "Nightly billing batch crashed on chunk #42 due to network socket timeout.",
                    IncidentSeverity.HIGH,
                    IncidentStatus.IN_PROGRESS,
                    "Customer Billing Batch"
            );
            incidentRepository.save(inc2);

            // 4. Seed Alerts
            alertRepository.save(new AlertEntity("Notification Engine is DOWN - HTTP 503 Service Unavailable", IncidentSeverity.CRITICAL, AlertType.SERVICE));
            alertRepository.save(new AlertEntity("Customer Billing Batch job run FAILED with exit code 1", IncidentSeverity.HIGH, AlertType.JOB));
            
            AlertEntity ackAlert = new AlertEntity("Order Management Service response time degraded (420ms > 300ms threshold)", IncidentSeverity.MEDIUM, AlertType.SERVICE);
            ackAlert.setAcknowledged(true);
            alertRepository.save(ackAlert);

            log.info("Sample monitoring data initialized successfully!");
        }
    }
}
