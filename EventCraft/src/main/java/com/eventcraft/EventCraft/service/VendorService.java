package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.VendorRegDTO;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

    public java.util.Optional<Vendor> getVendorById(String id) {
        return vendorRepository.findById(id);
    }

    public Vendor updateVendor(String id, Vendor updatedVendor) {
        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));
        
        // Update fields
        if (updatedVendor.getCompanyName() != null) {
            existingVendor.setCompanyName(updatedVendor.getCompanyName());
        }
        if (updatedVendor.getServiceType() != null) {
            existingVendor.setServiceType(updatedVendor.getServiceType());
        }
        if (updatedVendor.getAddress() != null) {
            existingVendor.setAddress(updatedVendor.getAddress());
        }
        if (updatedVendor.getRating() != null) {
            existingVendor.setRating(updatedVendor.getRating());
        }
        
        existingVendor.setUpdatedAt(LocalDateTime.now());
        return vendorRepository.save(existingVendor);
    }

    public void deleteVendor(String id) {
        vendorRepository.deleteById(id);
    }
}
