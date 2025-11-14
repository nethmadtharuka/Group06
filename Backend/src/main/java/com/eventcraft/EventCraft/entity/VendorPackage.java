package com.eventcraft.EventCraft.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "vendor_packages")
public class VendorPackage {

    @Id
    private String id;

    @DBRef
    private Vendor vendor;

    private String packageName;
    private String description;
    private Double price;
    private List<String> features; // List of features included in the package
    private String duration; // e.g., "2 hours", "Full day", "Half day"
    private Boolean isActive;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}

