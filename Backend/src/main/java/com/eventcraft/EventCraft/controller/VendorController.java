package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.VendorRegDTO;
import com.eventcraft.EventCraft.entity.Review;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.entity.VendorPackage;
import com.eventcraft.EventCraft.service.ReviewService;
import com.eventcraft.EventCraft.service.VendorPackageService;
import com.eventcraft.EventCraft.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;
    private final ReviewService reviewService;
    private final VendorPackageService vendorPackageService;

    @PostMapping("/register/{userId}")
    public ResponseEntity<?> registerVendor(
            @PathVariable String userId,
            @RequestBody VendorRegDTO request) {
        try {
            Vendor vendor = vendorService.registerVendor(userId, request);
            return ResponseEntity.ok(vendor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/{vendorId}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable String vendorId) {
        Optional<Vendor> vendor = vendorService.getVendorById(vendorId);
        return vendor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Vendor> getVendorByUserId(@PathVariable String userId) {
        Optional<Vendor> vendor = vendorService.getVendorByUserId(userId);
        return vendor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{vendorId}/details")
    public ResponseEntity<Map<String, Object>> getVendorDetails(@PathVariable String vendorId) {
        Optional<Vendor> vendorOpt = vendorService.getVendorById(vendorId);
        if (vendorOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Vendor vendor = vendorOpt.get();
        List<Review> reviews = reviewService.getReviewsByVendor(vendorId);
        List<VendorPackage> packages = vendorPackageService.getPackagesByVendor(vendorId);

        Map<String, Object> response = new HashMap<>();
        response.put("vendor", vendor);
        response.put("reviews", reviews);
        response.put("packages", packages);
        response.put("reviewCount", reviews.size());
        response.put("packageCount", packages.size());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{vendorId}/user/{userId}")
    public ResponseEntity<?> updateVendor(
            @PathVariable String vendorId,
            @PathVariable String userId,
            @RequestBody VendorRegDTO request) {
        try {
            Vendor vendor = vendorService.updateVendor(vendorId, userId, request);
            return ResponseEntity.ok(vendor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Vendor>> getFeaturedVendors(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(vendorService.getFeaturedVendorsByRating(limit));
    }
}
