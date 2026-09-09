package com.example.monitoring.service;

import com.example.monitoring.dto.IncidentRequestDto;
import com.example.monitoring.entity.IncidentEntity;
import com.example.monitoring.entity.IncidentSeverity;
import com.example.monitoring.entity.IncidentStatus;
import com.example.monitoring.exception.ResourceNotFoundException;
import com.example.monitoring.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class IncidentService {

    private final IncidentRepository incidentRepository;

    @Autowired
    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<IncidentEntity> getAllIncidents(IncidentStatus status, IncidentSeverity severity) {
        if (status != null && severity != null) {
            return incidentRepository.findByStatusAndSeverityOrderByCreatedAtDesc(status, severity);
        } else if (status != null) {
            return incidentRepository.findByStatusOrderByCreatedAtDesc(status);
        } else if (severity != null) {
            return incidentRepository.findBySeverityOrderByCreatedAtDesc(severity);
        }
        return incidentRepository.findAllByOrderByCreatedAtDesc();
    }

    public IncidentEntity getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with ID: " + id));
    }

    public IncidentEntity createIncident(IncidentRequestDto dto) {
        IncidentEntity entity = new IncidentEntity(
                dto.getTitle(),
                dto.getDescription(),
                dto.getSeverity(),
                dto.getStatus() != null ? dto.getStatus() : IncidentStatus.OPEN,
                dto.getServiceName()
        );
        return incidentRepository.save(entity);
    }

    public IncidentEntity updateIncident(Long id, IncidentRequestDto dto) {
        IncidentEntity existing = getIncidentById(id);
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setSeverity(dto.getSeverity());
        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }
        existing.setServiceName(dto.getServiceName());
        return incidentRepository.save(existing);
    }

    public IncidentEntity updateStatus(Long id, IncidentStatus newStatus) {
        IncidentEntity existing = getIncidentById(id);
        existing.setStatus(newStatus);
        return incidentRepository.save(existing);
    }

    public IncidentEntity updateSeverity(Long id, IncidentSeverity newSeverity) {
        IncidentEntity existing = getIncidentById(id);
        existing.setSeverity(newSeverity);
        return incidentRepository.save(existing);
    }

    public void deleteIncident(Long id) {
        IncidentEntity existing = getIncidentById(id);
        incidentRepository.delete(existing);
    }
}
