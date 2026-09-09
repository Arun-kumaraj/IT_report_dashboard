package com.example.monitoring.service;

import com.example.monitoring.entity.ServiceEntity;
import com.example.monitoring.entity.ServiceStatus;
import com.example.monitoring.repository.ServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
public class MonitoringScheduler {

    private static final Logger log = LoggerFactory.getLogger(MonitoringScheduler.class);
    private final ServiceRepository serviceRepository;
    private final ServiceMonitoringService serviceMonitoringService;
    private final Random random = new Random();

    @Autowired
    public MonitoringScheduler(ServiceRepository serviceRepository,
                               ServiceMonitoringService serviceMonitoringService) {
        this.serviceRepository = serviceRepository;
        this.serviceMonitoringService = serviceMonitoringService;
    }

    /**
     * Periodically simulates health check pings every 30 seconds.
     * Updates response times and lastChecked timestamps.
     * Demonstrates automated monitoring and incident generation.
     */
    @Scheduled(fixedRate = 30000)
    public void runHealthChecks() {
        log.info("Executing scheduled health checks on monitored services...");
        List<ServiceEntity> services = serviceRepository.findAll();

        for (ServiceEntity service : services) {
            service.setLastChecked(LocalDateTime.now());

            if (service.getStatus() == ServiceStatus.UP) {
                // Simulate minor latency jitter between 30ms and 150ms
                int jitter = 30 + random.nextInt(120);
                service.setResponseTime(jitter);
                serviceRepository.save(service);
            } else if (service.getStatus() == ServiceStatus.DEGRADED) {
                int degradedTime = 350 + random.nextInt(200);
                service.setResponseTime(degradedTime);
                serviceRepository.save(service);
            } else if (service.getStatus() == ServiceStatus.DOWN) {
                service.setResponseTime(null);
                serviceRepository.save(service);
            }
        }
    }
}
