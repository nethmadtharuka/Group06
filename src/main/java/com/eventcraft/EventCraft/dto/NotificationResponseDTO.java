package com.eventcraft.EventCraft.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDTO {
    
    private List<NotificationDTO> notifications;
    private Long unreadCount;
    private Boolean success;
    private String message;
}

