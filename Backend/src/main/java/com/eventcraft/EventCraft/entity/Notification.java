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
    private String id;

    @DBRef
    private User user; // User who receives the notification

    private NotificationType type; // EVENT, CONTRACT, MESSAGE, PAYMENT, SYSTEM

    private String title;

    private String description;

    private String message; // Alternative to description

    private String actionUrl; // URL to navigate when clicked

    @Builder.Default
    private Boolean read = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime readAt;

    public enum NotificationType {
        EVENT,
        CONTRACT,
        MESSAGE,
        PAYMENT,
        SYSTEM
    }
}

