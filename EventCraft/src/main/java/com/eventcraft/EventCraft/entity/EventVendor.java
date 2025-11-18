package com.eventcraft.EventCraft.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "event_vendors")
public class EventVendor {

    @Id
    private String id; // MongoDB ObjectId as String

    @DBRef
    private Event event;

    @DBRef
    private Vendor vendor;

    private String assignedService;

    @Builder.Default
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, CONFIRMED, CANCELLED
    }

}
