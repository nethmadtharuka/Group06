package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.VendorPackageDTO;
import com.eventcraft.EventCraft.entity.VendorPackage;
import com.eventcraft.EventCraft.service.VendorPackageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendor-packages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorPackageController {

    private final VendorPackageService vendorPackageService;

    @PostMapping("/vendor/{vendorId}")
    public ResponseEntity<?> createPackage(
            @PathVariable String vendorId,
            @Valid @RequestBody VendorPackageDTO packageDTO) {
        try {
            VendorPackage vendorPackage = vendorPackageService.createPackage(vendorId, packageDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(vendorPackage);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{packageId}/vendor/{vendorId}")
    public ResponseEntity<?> updatePackage(
            @PathVariable String packageId,
            @PathVariable String vendorId,
            @Valid @RequestBody VendorPackageDTO packageDTO) {
        try {
            VendorPackage vendorPackage = vendorPackageService.updatePackage(packageId, vendorId, packageDTO);
            return ResponseEntity.ok(vendorPackage);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{packageId}/vendor/{vendorId}")
    public ResponseEntity<?> deletePackage(
            @PathVariable String packageId,
            @PathVariable String vendorId) {
        try {
            vendorPackageService.deletePackage(packageId, vendorId);
            return ResponseEntity.ok("Package deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<VendorPackage>> getPackagesByVendor(@PathVariable String vendorId) {
        List<VendorPackage> packages = vendorPackageService.getPackagesByVendor(vendorId);
        return ResponseEntity.ok(packages);
    }

    @GetMapping("/vendor/{vendorId}/active")
    public ResponseEntity<List<VendorPackage>> getActivePackagesByVendor(@PathVariable String vendorId) {
        List<VendorPackage> packages = vendorPackageService.getActivePackagesByVendor(vendorId);
        return ResponseEntity.ok(packages);
    }

    @GetMapping("/{packageId}")
    public ResponseEntity<VendorPackage> getPackageById(@PathVariable String packageId) {
        Optional<VendorPackage> vendorPackage = vendorPackageService.getPackageById(packageId);
        return vendorPackage.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

