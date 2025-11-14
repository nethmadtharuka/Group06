package com.eventcraft.EventCraft.dto;

import lombok.Data;

@Data
public class VendorRegDTO {
    private String companyName;
    private String serviceType;
    private String address;
    private String mainPhotoURL;
    private String detailPhotoURL;
    private String details; // Detailed description about the vendor
}
