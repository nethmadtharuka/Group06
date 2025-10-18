package com.eventcraft.EventCraft.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String fullName;
    private String phone;
    private String bio;
    private String address;
    private String dateOfBirth;
    private String email;
}