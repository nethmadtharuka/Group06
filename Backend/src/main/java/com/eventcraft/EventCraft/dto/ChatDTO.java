package com.eventcraft.EventCraft.dto;

import lombok.Data;

@Data
public class ChatDTO {
    private String vendorId; // First vendor (required for vendor-to-user or vendor1 in vendor-to-vendor)
    
    private String userId; // User ID (required for vendor-to-user chats)
    
    private String vendor2Id; // Second vendor ID (required for vendor-to-vendor chats)
}

