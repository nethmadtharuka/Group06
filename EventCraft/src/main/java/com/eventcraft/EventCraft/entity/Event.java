package com.eventcraft.EventCraft.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "events")
public class Event {

    @Id
    private String id; // MongoDB uses String/ObjectId instead of Integer

    @DBRef
    private User user;

    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private Double budget;

    @Builder.Default
    private Status status = Status.PENDING;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @DBRef
    private List<ChatbotConversation> conversations;

    @DBRef
    private List<Contract> contracts;

    @DBRef
    private List<EventVendor> vendors;

    public enum Status {
        PENDING, CONFIRMED, CANCELLED
    }
}
