package com.example.monitoring.repository;

import com.example.monitoring.entity.JobEntity;
import com.example.monitoring.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<JobEntity, Long> {

    // Count jobs by status (used for Summary Cards: Failed Jobs)
    long countByStatus(JobStatus status);

    // Filter jobs by status
    List<JobEntity> findByStatus(JobStatus status);

    // Find job by name
    Optional<JobEntity> findByName(String name);
}
