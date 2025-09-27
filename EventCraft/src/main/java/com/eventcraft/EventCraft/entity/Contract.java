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
    private Event event;

    @DBRef
    private Vendor vendor;

    private String contractText;

    private Boolean signed = false;
    private LocalDateTime signedAt;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @DBRef
    private List<Payment> payments;
}
