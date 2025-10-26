package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends MongoRepository<Vendor, String> {
    boolean existsByUser_Id(String userId);
    Optional<Vendor> findByUser_Id(String userId);
}
