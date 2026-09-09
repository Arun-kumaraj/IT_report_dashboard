package com.example.monitoring.repository;

import com.example.monitoring.entity.AlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<AlertEntity, Long> {

    // Fetch alerts ordered with latest first
    List<AlertEntity> findAllByOrderByCreatedAtDesc();

    // Check if an unacknowledged alert for a message already exists (prevent spam)
    boolean existsByMessageAndAcknowledgedFalse(String message);
}
