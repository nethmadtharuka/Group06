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
                .mainPhotoURL(request.getMainPhotoURL())
                .detailPhotoURL(request.getDetailPhotoURL())
                .details(request.getDetails())
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

    public Optional<Vendor> getVendorById(String vendorId) {
        return vendorRepository.findById(vendorId);
    }

    public Optional<Vendor> getVendorByUserId(String userId) {
        return vendorRepository.findByUser_Id(userId);
    }

    public Vendor updateVendor(String vendorId, String userId, VendorRegDTO request) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));

        // Verify that the vendor belongs to the user
        if (!vendor.getUser().getId().equals(userId)) {
            throw new RuntimeException("User is not authorized to update this vendor");
        }

        // Update vendor fields
        if (request.getCompanyName() != null) {
            vendor.setCompanyName(request.getCompanyName());
        }
        if (request.getServiceType() != null) {
            vendor.setServiceType(request.getServiceType());
        }
        if (request.getAddress() != null) {
            vendor.setAddress(request.getAddress());
        }
        if (request.getMainPhotoURL() != null) {
            vendor.setMainPhotoURL(request.getMainPhotoURL());
        }
        if (request.getDetailPhotoURL() != null) {
            vendor.setDetailPhotoURL(request.getDetailPhotoURL());
        }
        if (request.getDetails() != null) {
            vendor.setDetails(request.getDetails());
        }
        vendor.setUpdatedAt(LocalDateTime.now());

        return vendorRepository.save(vendor);
    }

    /**
     * Get featured vendors sorted by rating (highest first).
     * Returns only approved vendors with at least a minimum rating.
     */
    public List<Vendor> getFeaturedVendorsByRating(int limit) {
        return vendorRepository.findAll().stream()
                .filter(v -> v.getApprovalStatus() == Vendor.ApprovalStatus.APPROVED)
                .filter(v -> v.getRating() != null && v.getRating() > 0)
                .sorted((a, b) -> {
                    // Sort by rating descending, then by company name ascending
                    int ratingCompare = Double.compare(
                        b.getRating() != null ? b.getRating() : 0.0,
                        a.getRating() != null ? a.getRating() : 0.0
                    );
                    if (ratingCompare != 0) {
                        return ratingCompare;
                    }
                    // If ratings are equal, sort alphabetically by company name
                    String nameA = a.getCompanyName() != null ? a.getCompanyName() : "";
                    String nameB = b.getCompanyName() != null ? b.getCompanyName() : "";
                    return nameA.compareToIgnoreCase(nameB);
                })
                .limit(limit > 0 ? limit : 10)
                .toList();
    }
}
