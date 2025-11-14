package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.GoogleGeminiRequestDTO;
import com.eventcraft.EventCraft.dto.GoogleGeminiResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GoogleGeminiService {
       @Value("${google.api.key:}")
       private String apiKey;

    private final RestTemplate restTemplate;

    @Autowired
    public GoogleGeminiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public GoogleGeminiResponseDTO generateResponse(GoogleGeminiRequestDTO requestDTO) {
        // Use API key from request if provided, otherwise use the configured one
        String keyToUse = (requestDTO.getApiKey() != null && !requestDTO.getApiKey().isEmpty()) 
            ? requestDTO.getApiKey() 
            : apiKey;
            
        if (keyToUse == null || keyToUse.isEmpty()) {
            GoogleGeminiResponseDTO errorResponse = new GoogleGeminiResponseDTO();
            errorResponse.setGeneratedResponse("Error: Google API key not configured. Please provide an API key.");
            return errorResponse;
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

        // Prepare headers for API key
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("X-goog-api-key", keyToUse);

        // Prepare the body based on the request DTO
        String body = "{ \"contents\": [ { \"parts\": [ { \"text\": \"" + requestDTO.getInputText() + "\" } ] } ] }";

        // Create HTTP entity with body and headers
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        // Make the API call and handle the response
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        // Create and return the response DTO
        GoogleGeminiResponseDTO responseDTO = new GoogleGeminiResponseDTO();
        responseDTO.setGeneratedResponse(response.getBody());

        return responseDTO;
    }
}
