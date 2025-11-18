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
@Document(collection = "chats")
public class Chat {

    @Id
    private String id;

    @DBRef
    private Vendor vendor;

    @DBRef
    private User user; // Customer/User

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    private LocalDateTime lastMessageAt; // Timestamp of the last message
    private String lastMessage; // Preview of the last message
}

