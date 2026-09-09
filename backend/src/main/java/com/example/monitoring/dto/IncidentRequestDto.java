package com.example.monitoring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.example.monitoring.entity.IncidentSeverity;
import com.example.monitoring.entity.IncidentStatus;

public class IncidentRequestDto {

    @NotBlank(message = "Incident title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Incident description is required")
    private String description;

    @NotNull(message = "Severity is required (LOW, MEDIUM, HIGH, CRITICAL)")
    private IncidentSeverity severity;

    private IncidentStatus status = IncidentStatus.OPEN;

    @NotBlank(message = "Associated service name is required")
    private String serviceName;

    public IncidentRequestDto() {
    }

    public IncidentRequestDto(String title, String description, IncidentSeverity severity, IncidentStatus status, String serviceName) {
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.status = status != null ? status : IncidentStatus.OPEN;
        this.serviceName = serviceName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public IncidentSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(IncidentSeverity severity) {
        this.severity = severity;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
}
