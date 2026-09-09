package com.example.monitoring.service;

import com.example.monitoring.entity.*;
import com.example.monitoring.repository.IncidentRepository;
import com.example.monitoring.repository.ServiceRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceMonitoringServiceTest {

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private AlertService alertService;

    @Mock
    private IncidentRepository incidentRepository;

    @InjectMocks
    private ServiceMonitoringService serviceMonitoringService;

    @Test
    @DisplayName("Should create CRITICAL alert and auto incident when service fails and no active incident exists")
    void testHandleServiceFailureCreatesAlertAndIncident() {
        ServiceEntity failedService = new ServiceEntity("Payment API", "Checkout service", ServiceStatus.DOWN, null);

        // When no active unresolved incident exists
        when(incidentRepository.existsByServiceNameAndStatusNot(eq("Payment API"), eq(IncidentStatus.RESOLVED)))
                .thenReturn(false);

        serviceMonitoringService.handleServiceFailure(failedService);

        // Verify CRITICAL alert created
        verify(alertService, times(1)).createAlert(
                eq("Payment API is DOWN"),
                eq(IncidentSeverity.CRITICAL),
                eq(AlertType.SERVICE)
        );

        // Verify incident auto-saved
        verify(incidentRepository, times(1)).save(any(IncidentEntity.class));
    }

    @Test
    @DisplayName("Should not create duplicate incident if one is already active for this service")
    void testHandleServiceFailureAvoidsDuplicateIncident() {
        ServiceEntity failedService = new ServiceEntity("Payment API", "Checkout service", ServiceStatus.DOWN, null);

        // When an active incident ALREADY exists
        when(incidentRepository.existsByServiceNameAndStatusNot(eq("Payment API"), eq(IncidentStatus.RESOLVED)))
                .thenReturn(true);

        serviceMonitoringService.handleServiceFailure(failedService);

        // Alert is still sent
        verify(alertService, times(1)).createAlert(any(), any(), any());

        // But NO duplicate incident is created
        verify(incidentRepository, never()).save(any(IncidentEntity.class));
    }
}
