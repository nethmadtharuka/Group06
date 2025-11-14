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
@Document(collection = "vendors")
public class Vendor {

    @Id
    private String id; // MongoDB ObjectId as String

    @DBRef
    private User user;

    private String companyName;
    private String serviceType;
    private String address;
    private String mainPhotoURL;
    private String detailPhotoURL;
    private String details; // Detailed description about the vendor
    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum ApprovalStatus {
        PENDING, APPROVED, REJECTED
    }

    @DBRef
    private List<Contract> contracts;

    @DBRef
    private List<EventVendor> assignedEvents;
}
