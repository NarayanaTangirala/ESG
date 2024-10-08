package com.project.esgdashboardbackend.controller;

import com.project.esgdashboardbackend.model.ESGData;
import com.project.esgdashboardbackend.service.ESGDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class ESGDataController {

    @Autowired
    private ESGDataService esgDataService;

    @GetMapping("/api/esg/{companyName}")
    public ResponseEntity<?> getEsgData(@PathVariable String companyName) {
        try {
            ESGData esgData = esgDataService.getESGData(companyName);
            return ResponseEntity.ok(esgData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(404).body("Company " + companyName + " not found.");
        }
    }

    @GetMapping("/api/esg/companies")
    public ResponseEntity<?> getAllCompanies() {
        try {
            List<String> companies = esgDataService.getAllCompanyNames();
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to retrieve companies.");
        }
    }
}