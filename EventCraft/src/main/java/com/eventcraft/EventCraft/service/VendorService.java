package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.VendorRegDTO;
import com.eventcraft.EventCraft.dto.VendorUpdateDTO;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    public Vendor registerVendor(String userId, VendorRegDTO request) {
        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Prevent duplicate vendor registration
        if (vendorRepository.existsByUser_Id(userId)) {
            throw new RuntimeException("User is already registered as a Vendor");
        }

        // Create Vendor
        Vendor vendor = Vendor.builder()
                .user(user)
                .companyName(request.getCompanyName())
                .serviceType(request.getServiceType())
                .address(request.getAddress())
                .imageUrl(request.getImageUrl())
                .rating(0.0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Update user role
        user.setRole(User.Role.VENDOR);
        userRepository.save(user);

        return vendorRepository.save(vendor);
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor updateVendor(String userId, VendorUpdateDTO request) {
        Vendor vendor = vendorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Vendor not found for userId: " + userId));

        if (request.getCompanyName() != null && !request.getCompanyName().isEmpty()) {
            vendor.setCompanyName(request.getCompanyName());
        }
        if (request.getServiceType() != null && !request.getServiceType().isEmpty()) {
            vendor.setServiceType(request.getServiceType());
        }
        if (request.getAddress() != null && !request.getAddress().isEmpty()) {
            vendor.setAddress(request.getAddress());
        }
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            vendor.setImageUrl(request.getImageUrl());
        }

        vendor.setUpdatedAt(LocalDateTime.now());

        return vendorRepository.save(vendor);
    }

    public Vendor getVendorByUserId(String userId) {
        return vendorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Vendor not found for userId: " + userId));
    }

    public Optional<Vendor> getVendorById(String id) {
        return vendorRepository.findById(id);
    }

    public void deleteVendor(String id) {
        vendorRepository.deleteById(id);
    }

    public Vendor updateVendorById(String id, Vendor vendor) {
        vendor.setId(id);
        vendor.setUpdatedAt(LocalDateTime.now());
        return vendorRepository.save(vendor);
    }

}
