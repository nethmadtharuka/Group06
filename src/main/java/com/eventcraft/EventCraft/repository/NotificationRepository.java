package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Notification;
import com.eventcraft.EventCraft.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    Long countByUserAndIsReadFalse(User user);
    
    // Additional methods for direct userId queries
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(String userId);
    
    Long countByUserIdAndIsReadFalse(String userId);
}
