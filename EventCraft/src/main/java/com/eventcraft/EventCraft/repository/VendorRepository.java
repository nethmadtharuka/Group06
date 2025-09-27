package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends MongoRepository<Vendor, String> {

    Optional<Vendor> findByUser_Id(String userId);

    boolean existsByUser_Id(String userId);
}
