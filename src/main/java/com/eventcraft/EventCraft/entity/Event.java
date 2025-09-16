package com.eventcraft.EventCraft.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private Double budget;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "event")
    private List<ChatbotConversation> conversations;

    @OneToMany(mappedBy = "event")
    private List<Contract> contracts;

    @OneToMany(mappedBy = "event")
    private List<EventVendor> vendors;

    public enum Status {
        PENDING, CONFIRMED, CANCELLED
    }
}
