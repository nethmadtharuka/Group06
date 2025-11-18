package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByVendor_Id(String vendorId);
    List<Review> findByUser_Id(String userId);
    Optional<Review> findByVendor_IdAndUser_Id(String vendorId, String userId);
    boolean existsByVendor_IdAndUser_Id(String vendorId, String userId);
}

