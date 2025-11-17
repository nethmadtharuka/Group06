package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.Notification;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.repository.NotificationRepository;
import com.eventcraft.EventCraft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Create a notification for a user
     */
    public Notification createNotification(String userId, Notification.NotificationType type, 
                                          String title, String description, String actionUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .description(description)
                .message(description) // Set message as well for compatibility
                .actionUrl(actionUrl)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Get all notifications for a user
     */
    public List<Notification> getNotificationsByUser(String userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotificationsByUser(String userId) {
        return notificationRepository.findByUser_IdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    /**
     * Get unread count for a user
     */
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUser_IdAndReadFalse(userId);
    }

    /**
     * Mark a notification as read
     */
    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUser_IdAndReadFalseOrderByCreatedAtDesc(userId);
        LocalDateTime now = LocalDateTime.now();
        
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notification.setReadAt(now);
        }
        
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Delete a notification
     */
    public void deleteNotification(String notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new RuntimeException("Notification not found with id: " + notificationId);
        }
        notificationRepository.deleteById(notificationId);
    }

    /**
     * Get notifications by type for a user
     */
    public List<Notification> getNotificationsByType(String userId, Notification.NotificationType type) {
        return notificationRepository.findByUser_IdAndTypeOrderByCreatedAtDesc(userId, type);
    }

    /**
     * Create notification for event-related actions
     */
    public Notification createEventNotification(String userId, String eventName, String action, String eventId) {
        String title = "Event " + action;
        String description = String.format("Your event \"%s\" has been %s", eventName, action.toLowerCase());
        String actionUrl = "/event/" + eventId;
        return createNotification(userId, Notification.NotificationType.EVENT, title, description, actionUrl);
    }

    /**
     * Create notification for contract-related actions
     */
    public Notification createContractNotification(String userId, String vendorName, String action, String contractId) {
        String title = "Contract " + action;
        String description = String.format("%s %s you a contract for review", vendorName, action.toLowerCase());
        String actionUrl = "/contract/review?contractId=" + contractId;
        return createNotification(userId, Notification.NotificationType.CONTRACT, title, description, actionUrl);
    }

    /**
     * Create notification for message-related actions
     */
    public Notification createMessageNotification(String userId, String senderName, String chatId) {
        String title = "New Message";
        String description = String.format("%s sent you a message", senderName);
        String actionUrl = "/messages?chatId=" + chatId;
        return createNotification(userId, Notification.NotificationType.MESSAGE, title, description, actionUrl);
    }

    /**
     * Create notification for payment-related actions
     */
    public Notification createPaymentNotification(String userId, double amount, String action, String contractId) {
        String title = "Payment " + action;
        String description = String.format("Payment of Rs. %.2f has been %s successfully", amount, action.toLowerCase());
        String actionUrl = "/contract/review?contractId=" + contractId;
        return createNotification(userId, Notification.NotificationType.PAYMENT, title, description, actionUrl);
    }
}

