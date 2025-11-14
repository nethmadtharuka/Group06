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
@Document(collection = "chatbot_conversations")
public class ChatbotConversation {

    @Id
    private String id;  // MongoDB uses String ObjectId

    // References to other documents
    @DBRef
    private User user;

    @DBRef
    private Event event;

    private String message;
    private String response;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
