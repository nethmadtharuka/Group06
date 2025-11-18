package com.eventcraft.EventCraft.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class MessageDTO {
    @NotNull(message = "Chat ID is required")
    private String chatId;

    @NotBlank(message = "Message content is required")
    private String content;

    @NotNull(message = "Sender ID is required")
    private String senderId;

    @NotNull(message = "Sender type is required")
    private String senderType; // "VENDOR" or "USER"
}

