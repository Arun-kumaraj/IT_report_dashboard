package com.example.monitoring.service;

import com.example.monitoring.dto.DashboardSummaryDto;
import com.example.monitoring.entity.IncidentStatus;
import com.example.monitoring.entity.JobStatus;
import com.example.monitoring.entity.ServiceStatus;
import com.example.monitoring.repository.IncidentRepository;
import com.example.monitoring.repository.JobRepository;
import com.example.monitoring.repository.ServiceRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    @DisplayName("Should correctly calculate dashboard summary counts from repositories")
    void testGetSummaryCalculation() {
        when(serviceRepository.countByStatus(ServiceStatus.UP)).thenReturn(4L);
        when(serviceRepository.countByStatus(ServiceStatus.DOWN)).thenReturn(1L);
        when(incidentRepository.countByStatus(IncidentStatus.OPEN)).thenReturn(2L);
        when(incidentRepository.countByStatus(IncidentStatus.IN_PROGRESS)).thenReturn(1L);
        when(jobRepository.countByStatus(JobStatus.FAILED)).thenReturn(1L);

        DashboardSummaryDto summary = dashboardService.getSummary();

        assertNotNull(summary);
        assertEquals(4L, summary.getServicesUp(), "Services UP should equal 4");
        assertEquals(1L, summary.getServicesDown(), "Services DOWN should equal 1");
        assertEquals(3L, summary.getOpenIncidents(), "Open incidents should equal 3 (2 OPEN + 1 IN_PROGRESS)");
        assertEquals(1L, summary.getFailedJobs(), "Failed jobs should equal 1");
    }
}
