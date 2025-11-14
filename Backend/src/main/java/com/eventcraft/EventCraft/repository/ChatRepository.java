package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    Optional<Chat> findByVendor_IdAndUser_Id(String vendorId, String userId);
    List<Chat> findByVendor_Id(String vendorId);
    List<Chat> findByUser_Id(String userId);
    boolean existsByVendor_IdAndUser_Id(String vendorId, String userId);
}

