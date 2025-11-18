package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepository extends MongoRepository<Vendor, String> {
    boolean existsByUser_Id(String userId);
    java.util.Optional<Vendor> findByUser_Id(String userId);
    java.util.List<Vendor> findByCompanyName(String companyName);
}
