package com.eventcraft.EventCraft.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractRequest {

    @NotBlank(message = "Vendor ID is required")
    private String vendorId;

    @NotBlank(message = "Contract text is required")
    @Size(max = 5000, message = "Contract text must not exceed 5000 characters")
    private String contractText;

    private String eventId; // Optional - for event-specific contracts
}
