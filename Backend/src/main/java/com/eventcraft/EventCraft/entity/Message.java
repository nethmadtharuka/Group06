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
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    @DBRef
    private Chat chat;

    private String senderId; // ID of the sender (vendorId or userId)
    private SenderType senderType; // VENDOR or USER

    private String content; // Message text content

    @Builder.Default
    private MessageStatus status = MessageStatus.SENT;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum SenderType {
        VENDOR, USER
    }

    public enum MessageStatus {
        SENT, DELIVERED, SEEN
    }
}

