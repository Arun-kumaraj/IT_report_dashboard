package com.example.monitoring.controller;

import com.example.monitoring.dto.IncidentRequestDto;
import com.example.monitoring.entity.IncidentEntity;
import com.example.monitoring.entity.IncidentSeverity;
import com.example.monitoring.entity.IncidentStatus;
import com.example.monitoring.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService incidentService;

    @Autowired
    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    // GET /api/incidents?status=OPEN&severity=CRITICAL
    @GetMapping
    public ResponseEntity<List<IncidentEntity>> getAllIncidents(
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) IncidentSeverity severity) {
        return ResponseEntity.ok(incidentService.getAllIncidents(status, severity));
    }

    // GET /api/incidents/{id}
    @GetMapping("/{id}")
    public ResponseEntity<IncidentEntity> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }

    // POST /api/incidents
    @PostMapping
    public ResponseEntity<IncidentEntity> createIncident(
            @Valid @RequestBody IncidentRequestDto dto) {
        IncidentEntity created = incidentService.createIncident(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/incidents/{id}
    @PutMapping("/{id}")
    public ResponseEntity<IncidentEntity> updateIncident(
            @PathVariable Long id,
            @Valid @RequestBody IncidentRequestDto dto) {
        return ResponseEntity.ok(incidentService.updateIncident(id, dto));
    }

    // PATCH /api/incidents/{id}/status?status=RESOLVED
    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentEntity> updateStatus(
            @PathVariable Long id,
            @RequestParam IncidentStatus status) {
        return ResponseEntity.ok(incidentService.updateStatus(id, status));
    }

    // PATCH /api/incidents/{id}/severity?severity=HIGH
    @PatchMapping("/{id}/severity")
    public ResponseEntity<IncidentEntity> updateSeverity(
            @PathVariable Long id,
            @RequestParam IncidentSeverity severity) {
        return ResponseEntity.ok(incidentService.updateSeverity(id, severity));
    }

    // DELETE /api/incidents/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }
}
