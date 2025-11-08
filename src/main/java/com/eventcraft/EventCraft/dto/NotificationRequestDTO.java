package com.eventcraft.EventCraft.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequestDTO {
    
    private String userId;
    private String title;
    private String message;
    private String type;
    private String contractId; // Optional reference to related contract
}

