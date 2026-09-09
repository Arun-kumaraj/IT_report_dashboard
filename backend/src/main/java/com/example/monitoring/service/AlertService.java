package com.example.monitoring.service;

import com.example.monitoring.entity.AlertEntity;
import com.example.monitoring.entity.AlertType;
import com.example.monitoring.entity.IncidentSeverity;
import com.example.monitoring.exception.ResourceNotFoundException;
import com.example.monitoring.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AlertService {

    private final AlertRepository alertRepository;

    @Autowired
    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<AlertEntity> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedAtDesc();
    }

    public AlertEntity createAlert(String message, IncidentSeverity severity, AlertType type) {
        // Prevent duplicate spam if the exact unacknowledged alert already exists
        if (alertRepository.existsByMessageAndAcknowledgedFalse(message)) {
            return null;
        }
        AlertEntity alert = new AlertEntity(message, severity, type);
        return alertRepository.save(alert);
    }

    public AlertEntity acknowledgeAlert(Long id) {
        AlertEntity alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with ID: " + id));
        alert.setAcknowledged(true);
        return alertRepository.save(alert);
    }
}
