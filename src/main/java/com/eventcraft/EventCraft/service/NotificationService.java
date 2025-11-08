package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.NotificationDTO;
import com.eventcraft.EventCraft.dto.NotificationRequestDTO;
import com.eventcraft.EventCraft.dto.NotificationResponseDTO;
import com.eventcraft.EventCraft.entity.Notification;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Contract;
import com.eventcraft.EventCraft.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification createNotification(User user, String title, String message, String type, Contract contract) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .contract(contract)
                .build();
        
        return notificationRepository.save(notification);
    }

    public NotificationDTO createNotificationFromRequest(NotificationRequestDTO request, User user, Contract contract) {
        Notification notification = Notification.builder()
                .user(user)
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .contract(contract)
                .build();
        
        Notification savedNotification = notificationRepository.save(notification);
        return convertToDTO(savedNotification);
    }

    public List<NotificationDTO> getUserNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public NotificationResponseDTO getUserNotificationsResponse(String userId) {
        List<NotificationDTO> notifications = getUserNotifications(userId);
        Long unreadCount = getUnreadCount(userId);
        
        return NotificationResponseDTO.builder()
                .notifications(notifications)
                .unreadCount(unreadCount)
                .success(true)
                .message("Notifications retrieved successfully")
                .build();
    }

    public NotificationDTO markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        Notification savedNotification = notificationRepository.save(notification);
        return convertToDTO(savedNotification);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    private NotificationDTO convertToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .userId(notification.getUser() != null ? notification.getUser().getId() : null)
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .contractId(notification.getContract() != null ? notification.getContract().getId() : null)
                .build();
    }
}
