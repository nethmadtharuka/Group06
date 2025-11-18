package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUser_IdOrderByCreatedAtDesc(String userId);
    List<Notification> findByUser_IdAndReadFalseOrderByCreatedAtDesc(String userId);
    long countByUser_IdAndReadFalse(String userId);
    List<Notification> findByUser_IdAndTypeOrderByCreatedAtDesc(String userId, Notification.NotificationType type);
}

