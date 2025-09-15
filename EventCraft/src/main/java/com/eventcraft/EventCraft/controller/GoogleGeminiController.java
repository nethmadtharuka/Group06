package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.GoogleGeminiRequestDTO;
import com.eventcraft.EventCraft.dto.GoogleGeminiResponseDTO;
import com.eventcraft.EventCraft.service.GoogleGeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gemini")
public class GoogleGeminiController {

    private final GoogleGeminiService googleGeminiService;

    @Autowired
    public GoogleGeminiController(GoogleGeminiService googleGeminiService) {
        this.googleGeminiService = googleGeminiService;
    }

    @PostMapping("/generate")
    public GoogleGeminiResponseDTO generateResponse(@Valid @RequestBody GoogleGeminiRequestDTO requestDTO) {
        return googleGeminiService.generateResponse(requestDTO);
    }
}
