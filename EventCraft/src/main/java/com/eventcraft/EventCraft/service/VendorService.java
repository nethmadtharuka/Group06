package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.VendorRegDTO;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    // Register a vendor for an existing user
    public Vendor registerVendor(String userId, VendorRegDTO request) {
        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if already a vendor
        if (user.getVendor() != null) {
            throw new RuntimeException("User is already registered as a Vendor");
        }

        // Create Vendor entity
        Vendor vendor = Vendor.builder()
                .user(user)
                .companyName(request.getCompanyName())
                .serviceType(request.getServiceType())
                .address(request.getAddress())
                .rating(0.0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Update user role to VENDOR
        user.setRole(User.Role.VENDOR);
        userRepository.save(user);

        // Save vendor
        return vendorRepository.save(vendor);
    }
}
