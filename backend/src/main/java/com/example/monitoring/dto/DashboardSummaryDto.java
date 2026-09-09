package com.example.monitoring.dto;

public class DashboardSummaryDto {

    private long servicesUp;
    private long servicesDown;
    private long openIncidents;
    private long failedJobs;

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(long servicesUp, long servicesDown, long openIncidents, long failedJobs) {
        this.servicesUp = servicesUp;
        this.servicesDown = servicesDown;
        this.openIncidents = openIncidents;
        this.failedJobs = failedJobs;
    }

    public long getServicesUp() {
        return servicesUp;
    }

    public void setServicesUp(long servicesUp) {
        this.servicesUp = servicesUp;
    }

    public long getServicesDown() {
        return servicesDown;
    }

    public void setServicesDown(long servicesDown) {
        this.servicesDown = servicesDown;
    }

    public long getOpenIncidents() {
        return openIncidents;
    }

    public void setOpenIncidents(long openIncidents) {
        this.openIncidents = openIncidents;
    }

    public long getFailedJobs() {
        return failedJobs;
    }

    public void setFailedJobs(long failedJobs) {
        this.failedJobs = failedJobs;
    }
}
