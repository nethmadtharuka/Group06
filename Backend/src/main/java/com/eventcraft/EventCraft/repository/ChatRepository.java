package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    Optional<Chat> findByVendor_IdAndUser_Id(String vendorId, String userId);
    Optional<Chat> findByVendor_IdAndVendor2_Id(String vendorId, String vendor2Id);
    Optional<Chat> findByVendor2_IdAndVendor_Id(String vendor2Id, String vendorId);
    List<Chat> findByVendor_Id(String vendorId);
    List<Chat> findByVendor2_Id(String vendorId);
    List<Chat> findByUser_Id(String userId);
    Optional<Chat> findByUser_IdAndIsSystemChatTrue(String userId);
    Optional<Chat> findByVendor_IdAndIsSystemChatTrue(String vendorId);
    boolean existsByVendor_IdAndUser_Id(String vendorId, String userId);
    boolean existsByVendor_IdAndVendor2_Id(String vendorId, String vendor2Id);
    boolean existsByVendor2_IdAndVendor_Id(String vendor2Id, String vendorId);
}

