package com.eventcraft.EventCraft.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "event_vendors", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"event_id", "vendor_id"})
})
public class EventVendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    private String assignedService;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status { PENDING, CONFIRMED, CANCELLED }

    // getters and setters
}
