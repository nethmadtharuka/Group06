package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.GoogleGeminiRequestDTO;
import com.eventcraft.EventCraft.dto.GoogleGeminiResponseDTO;
import com.eventcraft.EventCraft.service.GoogleGeminiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

<<<<<<< HEAD
/**
 * REST controller for Google Gemini API integration
 * Handles AI-generated responses using Google Gemini service
 */
=======
>>>>>>> 42ef6a0c448ed3252c41770b1af0e6e95107e0f9
@RestController
@RequestMapping("/api/gemini")
public class GoogleGeminiController {

    private final GoogleGeminiService googleGeminiService;

    @Autowired
    public GoogleGeminiController(GoogleGeminiService googleGeminiService) {
        this.googleGeminiService = googleGeminiService;
    }

<<<<<<< HEAD
    /**
     * Generates AI response using Google Gemini API
     * @param requestDTO Request containing prompt and parameters
     * @return Response with generated content
     */
=======
>>>>>>> 42ef6a0c448ed3252c41770b1af0e6e95107e0f9
    @PostMapping("/generate")
    public GoogleGeminiResponseDTO generateResponse(@Valid @RequestBody GoogleGeminiRequestDTO requestDTO) {
        return googleGeminiService.generateResponse(requestDTO);
    }
}
