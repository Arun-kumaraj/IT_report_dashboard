package com.example.monitoring.service;

import com.example.monitoring.entity.*;
import com.example.monitoring.exception.ResourceNotFoundException;
import com.example.monitoring.repository.IncidentRepository;
import com.example.monitoring.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ServiceMonitoringService {

    private final ServiceRepository serviceRepository;
    private final AlertService alertService;
    private final IncidentRepository incidentRepository;

    @Autowired
    public ServiceMonitoringService(ServiceRepository serviceRepository,
                                  AlertService alertService,
                                  IncidentRepository incidentRepository) {
        this.serviceRepository = serviceRepository;
        this.alertService = alertService;
        this.incidentRepository = incidentRepository;
    }

    public List<ServiceEntity> getAllServices(ServiceStatus status) {
        if (status != null) {
            return serviceRepository.findByStatus(status);
        }
        return serviceRepository.findAll();
    }

    public ServiceEntity getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));
    }

    public ServiceEntity createService(ServiceEntity service) {
        if (service.getLastChecked() == null) {
            service.setLastChecked(LocalDateTime.now());
        }
        return serviceRepository.save(service);
    }

    public ServiceEntity updateService(Long id, ServiceEntity updated) {
        ServiceEntity existing = getServiceById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        
        ServiceStatus oldStatus = existing.getStatus();
        existing.setStatus(updated.getStatus());
        existing.setResponseTime(updated.getResponseTime());
        existing.setLastChecked(LocalDateTime.now());

        ServiceEntity saved = serviceRepository.save(existing);

        // Automation requirement: If status transitioned to DOWN, trigger alert and incident
        if (oldStatus != ServiceStatus.DOWN && updated.getStatus() == ServiceStatus.DOWN) {
            handleServiceFailure(saved);
        }

        return saved;
    }

    public void deleteService(Long id) {
        ServiceEntity existing = getServiceById(id);
        serviceRepository.delete(existing);
    }

    /**
     * Automated Incident Creation Logic:
     * When a service transitions to DOWN:
     * 1. Create a CRITICAL alert
     * 2. Automatically create an incident ticket if one is not already OPEN/IN_PROGRESS for this service
     */
    public void handleServiceFailure(ServiceEntity service) {
        // Step 1: Create alert
        String alertMsg = service.getName() + " is DOWN";
        alertService.createAlert(alertMsg, IncidentSeverity.CRITICAL, AlertType.SERVICE);

        // Step 2: Create automated incident if no active incident exists
        boolean hasActiveIncident = incidentRepository.existsByServiceNameAndStatusNot(
                service.getName(),
                IncidentStatus.RESOLVED
        );

        if (!hasActiveIncident) {
            IncidentEntity autoIncident = new IncidentEntity(
                    service.getName() + " service failure",
                    "Automated alert: " + service.getName() + " became unreachable during automated health check ping. Response time: " 
                            + (service.getResponseTime() != null ? service.getResponseTime() + "ms" : "--") + ".",
                    IncidentSeverity.CRITICAL,
                    IncidentStatus.OPEN,
                    service.getName()
            );
            incidentRepository.save(autoIncident);
        }
    }
}
