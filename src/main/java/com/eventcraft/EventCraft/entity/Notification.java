package com.eventcraft.EventCraft.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id; // MongoDB ObjectId as String

    @DBRef
    private User user; // User who will receive the notification

    private String title;
    private String message;
    private String type; // e.g., "payment_success", "contract_signed", etc.

    @Builder.Default
    private Boolean isRead = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @DBRef
    private Contract contract; // Optional reference to related contract
}

