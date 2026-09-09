package com.example.monitoring.repository;

import com.example.monitoring.entity.ServiceEntity;
import com.example.monitoring.entity.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    
    // Count services by status (used for Summary Cards: Services Up, Services Down)
    long countByStatus(ServiceStatus status);

    // Filter services by status in the table
    List<ServiceEntity> findByStatus(ServiceStatus status);

    // Find service by unique name
    Optional<ServiceEntity> findByName(String name);
}
