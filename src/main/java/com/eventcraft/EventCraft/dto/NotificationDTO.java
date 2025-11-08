package com.eventcraft.EventCraft.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    
    private String id;
    private String userId;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private String contractId; // Optional reference to related contract
}

