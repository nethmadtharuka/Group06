package com.eventcraft.EventCraft.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleGeminiRequestDTO {

    private String apiKey; // optional; falls back to application property

    @NotBlank(message = "Input text cannot be blank")
    private String inputText;

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getInputText() {
        return inputText;
    }

    public void setInputText(String inputText) {
        this.inputText = inputText;
    }
}
