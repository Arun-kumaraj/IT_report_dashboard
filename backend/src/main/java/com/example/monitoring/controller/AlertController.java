package com.example.monitoring.controller;

import com.example.monitoring.entity.AlertEntity;
import com.example.monitoring.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    @Autowired
    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    // GET /api/alerts
    @GetMapping
    public ResponseEntity<List<AlertEntity>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    // PUT /api/alerts/{id}/acknowledge
    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<AlertEntity> acknowledgeAlert(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.acknowledgeAlert(id));
    }
}
