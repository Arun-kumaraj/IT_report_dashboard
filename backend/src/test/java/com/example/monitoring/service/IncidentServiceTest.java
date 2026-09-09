package com.example.monitoring.service;

import com.example.monitoring.dto.IncidentRequestDto;
import com.example.monitoring.entity.IncidentEntity;
import com.example.monitoring.entity.IncidentSeverity;
import com.example.monitoring.entity.IncidentStatus;
import com.example.monitoring.exception.ResourceNotFoundException;
import com.example.monitoring.repository.IncidentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock
    private IncidentRepository incidentRepository;

    @InjectMocks
    private IncidentService incidentService;

    private IncidentEntity sampleIncident;

    @BeforeEach
    void setUp() {
        sampleIncident = new IncidentEntity(
                "Payment API latency spike",
                "Transactions taking over 2000ms to complete.",
                IncidentSeverity.HIGH,
                IncidentStatus.OPEN,
                "Payment API"
        );
        sampleIncident.setId(1L);
    }

    @Test
    @DisplayName("Should successfully create a new incident ticket")
    void testCreateIncident() {
        IncidentRequestDto dto = new IncidentRequestDto(
                "Payment API latency spike",
                "Transactions taking over 2000ms to complete.",
                IncidentSeverity.HIGH,
                IncidentStatus.OPEN,
                "Payment API"
        );

        when(incidentRepository.save(any(IncidentEntity.class))).thenReturn(sampleIncident);

        IncidentEntity created = incidentService.createIncident(dto);

        assertNotNull(created);
        assertEquals("Payment API latency spike", created.getTitle());
        assertEquals(IncidentSeverity.HIGH, created.getSeverity());
        assertEquals(IncidentStatus.OPEN, created.getStatus());
        verify(incidentRepository, times(1)).save(any(IncidentEntity.class));
    }

    @Test
    @DisplayName("Should update incident status to RESOLVED")
    void testUpdateIncidentStatus() {
        when(incidentRepository.findById(1L)).thenReturn(Optional.of(sampleIncident));
        when(incidentRepository.save(any(IncidentEntity.class))).thenReturn(sampleIncident);

        IncidentEntity updated = incidentService.updateStatus(1L, IncidentStatus.RESOLVED);

        assertEquals(IncidentStatus.RESOLVED, updated.getStatus());
        verify(incidentRepository, times(1)).save(sampleIncident);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when incident ID does not exist")
    void testGetIncidentNotFound() {
        when(incidentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> incidentService.getIncidentById(999L));
    }
}
