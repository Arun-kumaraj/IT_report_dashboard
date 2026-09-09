package com.example.monitoring.controller;

import com.example.monitoring.entity.ServiceEntity;
import com.example.monitoring.entity.ServiceStatus;
import com.example.monitoring.service.ServiceMonitoringService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceMonitoringService serviceMonitoringService;

    @Autowired
    public ServiceController(ServiceMonitoringService serviceMonitoringService) {
        this.serviceMonitoringService = serviceMonitoringService;
    }

    // GET /api/services?status=UP
    @GetMapping
    public ResponseEntity<List<ServiceEntity>> getAllServices(
            @RequestParam(required = false) ServiceStatus status) {
        return ResponseEntity.ok(serviceMonitoringService.getAllServices(status));
    }

    // GET /api/services/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ServiceEntity> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceMonitoringService.getServiceById(id));
    }

    // POST /api/services
    @PostMapping
    public ResponseEntity<ServiceEntity> createService(@Valid @RequestBody ServiceEntity service) {
        ServiceEntity created = serviceMonitoringService.createService(service);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/services/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ServiceEntity> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceEntity service) {
        return ResponseEntity.ok(serviceMonitoringService.updateService(id, service));
    }

    // DELETE /api/services/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceMonitoringService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
