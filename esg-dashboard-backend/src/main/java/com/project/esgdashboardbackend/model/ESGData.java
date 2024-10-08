package com.project.esgdashboardbackend.model;

import jakarta.persistence.*;

@Entity
public class ESGData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;

    private double overallScore;
    private double environmentalScore;
    private double socialScore;
    private double governanceScore;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(double overallScore) {
        this.overallScore = overallScore;
    }

    public double getEnvironmentalScore() {
        return environmentalScore;
    }

    public void setEnvironmentalScore(double environmentalScore) {
        this.environmentalScore = environmentalScore;
    }

    public double getSocialScore() {
        return socialScore;
    }

    public void setSocialScore(double socialScore) {
        this.socialScore = socialScore;
    }

    public double getGovernanceScore() {
        return governanceScore;
    }

    public void setGovernanceScore(double governanceScore) {
        this.governanceScore = governanceScore;
    }
}
