package com.example.monitoring.service;

import com.example.monitoring.entity.AlertType;
import com.example.monitoring.entity.IncidentSeverity;
import com.example.monitoring.entity.JobEntity;
import com.example.monitoring.entity.JobStatus;
import com.example.monitoring.exception.ResourceNotFoundException;
import com.example.monitoring.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class JobMonitoringService {

    private final JobRepository jobRepository;
    private final AlertService alertService;

    @Autowired
    public JobMonitoringService(JobRepository jobRepository, AlertService alertService) {
        this.jobRepository = jobRepository;
        this.alertService = alertService;
    }

    public List<JobEntity> getAllJobs(JobStatus status) {
        if (status != null) {
            return jobRepository.findByStatus(status);
        }
        return jobRepository.findAll();
    }

    public JobEntity getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));
    }

    public JobEntity updateJob(Long id, JobEntity updated) {
        JobEntity existing = getJobById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setSchedule(updated.getSchedule());
        existing.setStatus(updated.getStatus());
        existing.setLastRun(updated.getLastRun());
        return jobRepository.save(existing);
    }

    /**
     * Simulates triggering a scheduled job execution on-demand.
     */
    public JobEntity triggerJobRun(Long id) {
        JobEntity job = getJobById(id);
        job.setStatus(JobStatus.RUNNING);
        job.setLastRun(LocalDateTime.now());
        jobRepository.save(job);

        // Simulate execution outcome: 75% success, 25% failure
        boolean succeeds = Math.random() > 0.25;
        if (succeeds) {
            job.setStatus(JobStatus.SUCCESS);
        } else {
            job.setStatus(JobStatus.FAILED);
            // Generate alert for failed job
            alertService.createAlert(
                    job.getName() + " Job FAILED on scheduled execution",
                    IncidentSeverity.HIGH,
                    AlertType.JOB
            );
        }
        return jobRepository.save(job);
    }
}
