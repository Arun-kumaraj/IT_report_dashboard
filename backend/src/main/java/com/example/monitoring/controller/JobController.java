package com.example.monitoring.controller;

import com.example.monitoring.entity.JobEntity;
import com.example.monitoring.entity.JobStatus;
import com.example.monitoring.service.JobMonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobMonitoringService jobMonitoringService;

    @Autowired
    public JobController(JobMonitoringService jobMonitoringService) {
        this.jobMonitoringService = jobMonitoringService;
    }

    // GET /api/jobs?status=FAILED
    @GetMapping
    public ResponseEntity<List<JobEntity>> getAllJobs(
            @RequestParam(required = false) JobStatus status) {
        return ResponseEntity.ok(jobMonitoringService.getAllJobs(status));
    }

    // GET /api/jobs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<JobEntity> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobMonitoringService.getJobById(id));
    }

    // PUT /api/jobs/{id}
    @PutMapping("/{id}")
    public ResponseEntity<JobEntity> updateJob(
            @PathVariable Long id,
            @RequestBody JobEntity job) {
        return ResponseEntity.ok(jobMonitoringService.updateJob(id, job));
    }

    // POST /api/jobs/{id}/run (Triggers simulated execution)
    @PostMapping("/{id}/run")
    public ResponseEntity<JobEntity> triggerJobRun(@PathVariable Long id) {
        return ResponseEntity.ok(jobMonitoringService.triggerJobRun(id));
    }
}
