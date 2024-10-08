package com.project.esgdashboardbackend.exception;

public class CompanyNotFoundException extends RuntimeException {
    public CompanyNotFoundException(String company) {
        super("Company " + company + " not found.");
    }
}
