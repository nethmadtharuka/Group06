package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.NotificationDTO;
import com.eventcraft.EventCraft.dto.NotificationRequestDTO;
import com.eventcraft.EventCraft.dto.NotificationResponseDTO;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.service.NotificationService;
import com.eventcraft.EventCraft.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<NotificationResponseDTO> getUserNotifications(@RequestParam String userId) {
        NotificationResponseDTO response = notificationService.getUserNotificationsResponse(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@RequestParam String userId) {
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@RequestParam String userId) {
        Long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationRequestDTO request) {
        User user = userService.getUserById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
        NotificationDTO notification = notificationService.createNotificationFromRequest(request, user, null);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable String notificationId) {
        NotificationDTO notification = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(@RequestParam String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
}
