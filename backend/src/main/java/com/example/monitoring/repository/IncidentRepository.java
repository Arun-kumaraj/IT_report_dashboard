package com.example.monitoring.repository;

import com.example.monitoring.entity.IncidentEntity;
import com.example.monitoring.entity.IncidentSeverity;
import com.example.monitoring.entity.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<IncidentEntity, Long> {

    // Count open incidents (used for Summary Cards: Open Incidents)
    long countByStatus(IncidentStatus status);

    // List all incidents ordered from newest to oldest
    List<IncidentEntity> findAllByOrderByCreatedAtDesc();

    // Filter by status
    List<IncidentEntity> findByStatusOrderByCreatedAtDesc(IncidentStatus status);

    // Filter by severity
    List<IncidentEntity> findBySeverityOrderByCreatedAtDesc(IncidentSeverity severity);

    // Filter by both status and severity
    List<IncidentEntity> findByStatusAndSeverityOrderByCreatedAtDesc(IncidentStatus status, IncidentSeverity severity);

    // Check if an open incident already exists for this service to avoid duplicate auto-creation
    boolean existsByServiceNameAndStatusNot(String serviceName, IncidentStatus status);
}
