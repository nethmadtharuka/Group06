package com.eventcraft.EventCraft.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    private String id;

    private String token;
    private String email;
    private LocalDateTime expiryDate;
    private boolean used;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}