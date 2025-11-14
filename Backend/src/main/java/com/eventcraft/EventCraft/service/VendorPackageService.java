package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.VendorPackageDTO;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.entity.VendorPackage;
import com.eventcraft.EventCraft.repository.VendorPackageRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VendorPackageService {

    private final VendorPackageRepository vendorPackageRepository;
    private final VendorRepository vendorRepository;

    public VendorPackage createPackage(String vendorId, VendorPackageDTO packageDTO) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));

        VendorPackage vendorPackage = VendorPackage.builder()
                .vendor(vendor)
                .packageName(packageDTO.getPackageName())
                .description(packageDTO.getDescription())
                .price(packageDTO.getPrice())
                .features(packageDTO.getFeatures())
                .duration(packageDTO.getDuration())
                .isActive(packageDTO.getIsActive() != null ? packageDTO.getIsActive() : true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return vendorPackageRepository.save(vendorPackage);
    }

    public VendorPackage updatePackage(String packageId, String vendorId, VendorPackageDTO packageDTO) {
        VendorPackage vendorPackage = vendorPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + packageId));

        // Verify that the package belongs to the vendor
        if (!vendorPackage.getVendor().getId().equals(vendorId)) {
            throw new RuntimeException("Vendor is not authorized to update this package");
        }

        vendorPackage.setPackageName(packageDTO.getPackageName());
        vendorPackage.setDescription(packageDTO.getDescription());
        vendorPackage.setPrice(packageDTO.getPrice());
        vendorPackage.setFeatures(packageDTO.getFeatures());
        vendorPackage.setDuration(packageDTO.getDuration());
        if (packageDTO.getIsActive() != null) {
            vendorPackage.setIsActive(packageDTO.getIsActive());
        }
        vendorPackage.setUpdatedAt(LocalDateTime.now());

        return vendorPackageRepository.save(vendorPackage);
    }

    public void deletePackage(String packageId, String vendorId) {
        VendorPackage vendorPackage = vendorPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + packageId));

        // Verify that the package belongs to the vendor
        if (!vendorPackage.getVendor().getId().equals(vendorId)) {
            throw new RuntimeException("Vendor is not authorized to delete this package");
        }

        vendorPackageRepository.delete(vendorPackage);
    }

    public List<VendorPackage> getPackagesByVendor(String vendorId) {
        return vendorPackageRepository.findByVendor_Id(vendorId);
    }

    public List<VendorPackage> getActivePackagesByVendor(String vendorId) {
        return vendorPackageRepository.findByVendor_IdAndIsActiveTrue(vendorId);
    }

    public Optional<VendorPackage> getPackageById(String packageId) {
        return vendorPackageRepository.findById(packageId);
    }
}

