package com.eventcraft.EventCraft.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @JsonProperty(value = "usernameOrEmail", access = JsonProperty.Access.WRITE_ONLY)
    private String usernameOrEmail;
    
    @JsonProperty(value = "username", access = JsonProperty.Access.WRITE_ONLY)
    private String username;
    
    @JsonProperty(value = "email", access = JsonProperty.Access.WRITE_ONLY) 
    private String email;
    
    private String password;
    
    // Helper method to get the login identifier
    public String getLoginIdentifier() {
        if (usernameOrEmail != null && !usernameOrEmail.isEmpty()) {
            return usernameOrEmail;
        }
        if (username != null && !username.isEmpty()) {
            return username;
        }
        if (email != null && !email.isEmpty()) {
            return email;
        }
        return null;
    }
}