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
@Document(collection = "users")
public class User {

    @Id
    private String id; // MongoDB ObjectId as String

    private String username;
    private String email;
    private String password;

    private String fullName;
    private String phone;

    @Builder.Default
    private Role role = Role.CUSTOMER;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @DBRef
    private List<Event> events;

    @DBRef
    private List<ChatbotConversation> conversations;

    public enum Role {
        ADMIN, VENDOR, CUSTOMER
    }
}
