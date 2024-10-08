package com.project.esgdashboardbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.project.esgdashboardbackend.model.ESGData;
import com.project.esgdashboardbackend.repository.ESGDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ESGDataService {

    @Autowired
    private ESGDataRepository esgDataRepository;

    @Autowired
    private ESGApiService esgApiService;

    public ESGData getESGData(String companyName) throws Exception {
        ESGData esgData = esgDataRepository.findByCompanyName(companyName);
        if (esgData != null) {
            return esgData;
        }
        JsonNode apiData = esgApiService.fetchESGDataFromAPI(companyName);
        esgData = new ESGData();
        esgData.setCompanyName(apiData.path("companyname").asText());
        esgData.setOverallScore(apiData.path("Overall Score").asDouble());
        esgData.setEnvironmentalScore(apiData.path("Environmental Pillar Score").asDouble());
        esgData.setSocialScore(apiData.path("Social Pillar Score").asDouble());
        esgData.setGovernanceScore(apiData.path("Governance Pillar Score").asDouble());
        esgDataRepository.save(esgData);
        return esgData;
    }

    public List<String> getAllCompanyNames() {
        List<ESGData> esgDataList = esgDataRepository.findAll();
        return esgDataList.stream()
                .map(ESGData::getCompanyName)
                .collect(Collectors.toList());
    }
}
