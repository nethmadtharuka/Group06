package com.eventcraft.EventCraft.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class ChatDTO {
    @NotNull(message = "Vendor ID is required")
    private String vendorId;

    @NotNull(message = "User ID is required")
    private String userId;
}

