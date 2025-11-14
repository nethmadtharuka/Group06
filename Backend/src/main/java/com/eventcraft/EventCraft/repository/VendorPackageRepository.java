package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.VendorPackage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorPackageRepository extends MongoRepository<VendorPackage, String> {
    List<VendorPackage> findByVendor_Id(String vendorId);
    List<VendorPackage> findByVendor_IdAndIsActiveTrue(String vendorId);
}

