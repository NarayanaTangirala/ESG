package com.project.esgdashboardbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class ESGApiService {

    @Value("${api.rapidapi.key}")
    private String apiKey;

    private final String apiUrl = "https://gaialens-esg-scores.p.rapidapi.com/scores?companyname=";

    public JsonNode fetchESGDataFromAPI(String companyName) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        headers.set("x-rapidapi-key", apiKey);
        headers.set("x-rapidapi-host", "gaialens-esg-scores.p.rapidapi.com");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(apiUrl + companyName, HttpMethod.GET, entity, String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody()).get(0);
            return rootNode;
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Error fetching ESG data from API: " + e.getStatusCode() + ": " + e.getResponseBodyAsString());
        }
    }
}
