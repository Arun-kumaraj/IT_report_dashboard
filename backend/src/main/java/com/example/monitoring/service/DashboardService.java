package com.example.monitoring.service;

import com.example.monitoring.dto.DashboardSummaryDto;
import com.example.monitoring.entity.IncidentStatus;
import com.example.monitoring.entity.JobStatus;
import com.example.monitoring.entity.ServiceStatus;
import com.example.monitoring.repository.IncidentRepository;
import com.example.monitoring.repository.JobRepository;
import com.example.monitoring.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ServiceRepository serviceRepository;
    private final IncidentRepository incidentRepository;
    private final JobRepository jobRepository;

    @Autowired
    public DashboardService(ServiceRepository serviceRepository,
                            IncidentRepository incidentRepository,
                            JobRepository jobRepository) {
        this.serviceRepository = serviceRepository;
        this.incidentRepository = incidentRepository;
        this.jobRepository = jobRepository;
    }

    public DashboardSummaryDto getSummary() {
        long servicesUp = serviceRepository.countByStatus(ServiceStatus.UP);
        long servicesDown = serviceRepository.countByStatus(ServiceStatus.DOWN);
        long openIncidents = incidentRepository.countByStatus(IncidentStatus.OPEN) 
                           + incidentRepository.countByStatus(IncidentStatus.IN_PROGRESS);
        long failedJobs = jobRepository.countByStatus(JobStatus.FAILED);

        return new DashboardSummaryDto(servicesUp, servicesDown, openIncidents, failedJobs);
    }
}
