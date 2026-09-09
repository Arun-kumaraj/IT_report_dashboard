# IT Incident & Job Monitoring System (Backend)

> **Technologies:** Java 17, Spring Boot 3.2, Spring Data JPA, Hibernate, MySQL, Maven, JUnit 5, Mockito.

---

## 1. Project Overview & Architecture

This project is a realistic IT Operations and Incident Monitoring backend developed with Spring Boot. It simulates how an internal enterprise operations center tracks microservice availability, monitors scheduled batch jobs, raises automated operational alerts upon downtime, and facilitates support ticket (Incident) lifecycle management.

```text
React Frontend (Vite)
       │ HTTP / REST (JSON)
       ▼
Spring Boot REST Controllers (@RestController)
  ├── ServiceController
  ├── JobController
  ├── IncidentController
  ├── AlertController
  └── DashboardController
       │ Method Invocations
       ▼
Service Layer (@Service, @Transactional)
  ├── ServiceMonitoringService
  ├── JobMonitoringService
  ├── IncidentService
  ├── AlertService
  └── DashboardService
       ▲
       │ Triggers periodic health-check simulation & auto-incident logic
  MonitoringScheduler (@Scheduled fixedRate = 30s)
       │
       ▼
Data Access Layer (Spring Data JpaRepository)
  ├── ServiceRepository
  ├── JobRepository
  ├── IncidentRepository
  └── AlertRepository
       │ Hibernate ORM / JDBC
       ▼
MySQL Relational Database (services, jobs, incidents, alerts)
```

---

## 2. Core Automation Workflow (Interview Realism)

1. **Scheduled Ping Simulation:**
   * Every 30 seconds, `MonitoringScheduler` pings all registered services and records latency.
2. **Failure Detection:**
   * When a service transitions from `UP` or `DEGRADED` to `DOWN`, `ServiceMonitoringService.handleServiceFailure()` is invoked.
3. **Automated Alert:**
   * An unacknowledged `CRITICAL` alert is immediately recorded in the `alerts` table.
4. **Duplicate-Safe Incident Generation:**
   * The system queries `IncidentRepository.existsByServiceNameAndStatusNot(serviceName, IncidentStatus.RESOLVED)`.
   * If no unresolved incident is currently open for that service, it automatically opens an `INCIDENT` ticket with `CRITICAL` severity and status `OPEN`.
   * If an incident is already open, it avoids spamming the database with duplicate tickets.

---

## 3. Database Schema

* `services`: `id`, `name`, `description`, `status` (UP, DOWN, DEGRADED), `response_time`, `last_checked`.
* `jobs`: `id`, `name`, `description`, `schedule`, `last_run`, `status` (SUCCESS, FAILED, RUNNING).
* `incidents`: `id`, `title`, `description`, `severity` (LOW, MEDIUM, HIGH, CRITICAL), `status` (OPEN, IN_PROGRESS, RESOLVED), `service_name`, `created_at`, `updated_at`.
* `alerts`: `id`, `message`, `severity`, `type` (SERVICE, JOB), `acknowledged`, `created_at`.

---

## 4. How to Run Locally with Maven & MySQL

### Prerequisites
* Java 17+ installed (`java -version`)
* Maven 3.8+ installed (`mvn -version`)
* MySQL server running (`mysql -u root -p`)

### Step 1: Create Database
```sql
CREATE DATABASE IF NOT EXISTS monitoring_db;
```

### Step 2: Configure `src/main/resources/application.properties`
Update the MySQL username and password if different:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/monitoring_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### Step 3: Build & Run Tests
```bash
cd backend
mvn clean test
```

### Step 4: Start the Application
```bash
mvn spring-boot:run
```
The server will start on port `8080`. Initial seed data is automatically loaded by `DataInitializer.java`.

---

## 5. Frequently Asked Interview Questions & Answers

### Q1: Why did you use Spring Data JPA instead of raw JDBC?
> *"Spring Data JPA reduces boilerplate JDBC code like connection management, statement creation, and result-set mapping. By defining simple repository interfaces extending `JpaRepository`, Spring automatically derives optimized SQL queries from method names like `countByStatus()` or `findByStatusOrderByCreatedAtDesc()`, which allows faster development and cleaner unit testing."*

### Q2: How does your health check simulation work?
> *"In Spring Boot, we enable scheduling using `@EnableScheduling` and annotate a service method with `@Scheduled(fixedRate = 30000)`. In a production environment, this would execute actual HTTP `GET /actuator/health` or TCP socket pings to target microservices. For this project, it updates the `last_checked` timestamp and latency jitter, and triggers an automated alert and incident ticket if a service reports `DOWN`."*

### Q3: Why did you separate DTOs from Entities?
> *"Entities map directly to our database schema and lifecycle. DTOs (Data Transfer Objects) define the exact contract exposed to the REST client. Using DTOs allows us to enforce Jakarta validation annotations (`@NotBlank`, `@NotNull`, `@Size`) on client inputs without coupling database constraints, and prevents over-posting or exposing internal entity fields."*

### Q4: How is error handling structured?
> *"We use a centralized `@RestControllerAdvice` class (`GlobalExceptionHandler`). When a client requests a missing ID, a custom `ResourceNotFoundException` is thrown and mapped to HTTP `404 Not Found`. When client input fails validation, `MethodArgumentNotValidException` is intercepted and formatted into a clean JSON response containing specific field errors with HTTP `400 Bad Request`."*
