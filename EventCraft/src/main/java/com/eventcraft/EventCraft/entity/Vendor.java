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
    private Double rating = 0.0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @DBRef
    private List<Contract> contracts;

    @DBRef
    private List<EventVendor> assignedEvents;
}
