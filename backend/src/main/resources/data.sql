-- Sample Seed Data for IT Monitoring Dashboard

-- Services
INSERT INTO services (name, description, status, response_time, last_checked) VALUES
('Payment Gateway API', 'Handles customer checkout, stripe/paypal card payments', 'UP', 115, NOW()),
('User Authentication Service', 'JWT session validation and OAuth single sign-on', 'UP', 65, NOW()),
('Notification Engine', 'Sends transactional SMS, Push, and transactional email', 'DOWN', 0, NOW()),
('Order Management Service', 'Processes orders, inventory holds, and fulfillment', 'DEGRADED', 420, NOW()),
('Core Database Cluster', 'Main transactional MySQL read/write cluster', 'UP', 18, NOW());

-- Scheduled Jobs
INSERT INTO jobs (name, description, schedule, last_run, status) VALUES
('Database Backup', 'Automated snapshot dump to S3 cold storage', 'Daily 02:00 AM', NOW() - INTERVAL 7 HOUR, 'SUCCESS'),
('Customer Billing Batch', 'Nightly subscription renewal and invoice generation', 'Daily 04:00 AM', NOW() - INTERVAL 5 HOUR, 'FAILED'),
('Inventory Catalog Sync', 'Hourly ERP product stock synchronization', 'Every Hour', NOW() - INTERVAL 25 MINUTE, 'SUCCESS'),
('Audit Log Archival', 'Rotates and zips compliance logs to archival storage', 'Weekly Sunday', NOW() - INTERVAL 2 DAY, 'SUCCESS');

-- Incidents
INSERT INTO incidents (title, description, severity, status, service_name, created_at, updated_at) VALUES
('Notification Engine Connection Timeout', 'Notification Engine has stopped responding to health checks. Customers are not receiving OTP SMS.', 'CRITICAL', 'OPEN', 'Notification Engine', NOW() - INTERVAL 45 MINUTE, NOW() - INTERVAL 45 MINUTE),
('Billing Batch partial transaction failure', 'Nightly billing batch crashed on chunk #42 due to network socket timeout.', 'HIGH', 'IN_PROGRESS', 'Customer Billing Batch', NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR),
('Order Service latency spike', 'Average p95 response time elevated above 400ms during afternoon rush.', 'MEDIUM', 'RESOLVED', 'Order Management Service', NOW() - INTERVAL 6 HOUR, NOW() - INTERVAL 3 HOUR);

-- Alerts
INSERT INTO alerts (message, severity, type, acknowledged, created_at) VALUES
('Notification Engine is DOWN - HTTP 503 Service Unavailable', 'CRITICAL', 'SERVICE', FALSE, NOW() - INTERVAL 45 MINUTE),
('Customer Billing Batch job run FAILED with exit code 1', 'HIGH', 'JOB', FALSE, NOW() - INTERVAL 2 HOUR),
('Order Management Service response time degraded (420ms > 300ms threshold)', 'MEDIUM', 'SERVICE', TRUE, NOW() - INTERVAL 6 HOUR);
