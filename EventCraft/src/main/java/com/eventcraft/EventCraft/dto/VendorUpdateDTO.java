package com.eventcraft.EventCraft.dto;

import lombok.Data;

@Data
public class VendorUpdateDTO {
    private String companyName;
    private String serviceType;
    private String address;
    private String imageUrl;
}
