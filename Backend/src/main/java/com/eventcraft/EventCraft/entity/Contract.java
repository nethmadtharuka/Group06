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
@Document(collection = "contracts")
public class Contract {

    @Id
    private String id;  // MongoDB uses String/ObjectId instead of Integer

    @DBRef
    private User user;  // User who created/owns the contract

    @DBRef
    private Event event;

    @DBRef
    private Vendor vendor;

    private String contractText;
    
    // Contract details
    private String clientName;
    private String companyName;
    private String contactEmail;
    private String phoneNumber;
    private String address;
    private Double totalFee;
    private Double depositAmount;
    private LocalDateTime paymentDeadline;
    private String venue;

    @Builder.Default
    private Boolean signed = false;
    private LocalDateTime signedAt;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @DBRef
    private List<Payment> payments;
}
