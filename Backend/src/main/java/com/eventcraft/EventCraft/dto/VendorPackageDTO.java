package com.eventcraft.EventCraft.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

@Data
public class VendorPackageDTO {
    @NotBlank(message = "Package name is required")
    private String packageName;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    private List<String> features;

    private String duration;

    private Boolean isActive = true;
}

