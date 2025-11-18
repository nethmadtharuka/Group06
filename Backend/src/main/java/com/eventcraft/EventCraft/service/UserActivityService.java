package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.*;
import com.eventcraft.EventCraft.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final EventRepository eventRepository;
    private final ContractRepository contractRepository;
    private final MessageRepository messageRepository;
    private final ReviewRepository reviewRepository;

    /**
     * Get recent activities for a user.
     * Aggregates activities from events, contracts, payments, messages, and reviews.
     */
    public List<Map<String, Object>> getUserActivities(String userId, int limit) {
        List<ActivityItem> activities = new ArrayList<>();

        // Get user's events
        List<Event> userEvents = eventRepository.findByUserId(userId);
        for (Event event : userEvents) {
            if (event.getCreatedAt() != null) {
                activities.add(new ActivityItem(
                    "EVENT_CREATED",
                    "Created event \"" + event.getName() + "\"",
                    event.getCreatedAt(),
                    event.getId(),
                    "event"
                ));
            }
        }

        // Get contracts for user (using direct user reference)
        List<Contract> userContracts = contractRepository.findByUser_Id(userId);
        for (Contract contract : userContracts) {
            if (contract.getCreatedAt() != null) {
                String eventName = contract.getEvent() != null && contract.getEvent().getName() != null
                    ? contract.getEvent().getName()
                    : "event";
                activities.add(new ActivityItem(
                    "CONTRACT_CREATED",
                    "Created contract for \"" + eventName + "\"",
                    contract.getCreatedAt(),
                    contract.getId(),
                    "contract"
                ));
            }
            
            if (contract.getSigned() != null && contract.getSigned() && contract.getSignedAt() != null) {
                String eventName = contract.getEvent() != null && contract.getEvent().getName() != null
                    ? contract.getEvent().getName()
                    : "event";
                activities.add(new ActivityItem(
                    "CONTRACT_SIGNED",
                    "Signed contract for \"" + eventName + "\"",
                    contract.getSignedAt(),
                    contract.getId(),
                    "contract"
                ));
            }
        }

        // Get payments for user's contracts (using direct user reference)
        for (Contract contract : userContracts) {
            if (contract.getPayments() != null) {
                for (Payment payment : contract.getPayments()) {
                    if (payment.getPaymentStatus() == Payment.PaymentStatus.COMPLETED &&
                        payment.getPaymentDate() != null) {
                        activities.add(new ActivityItem(
                            "PAYMENT_COMPLETED",
                            "Completed payment of Rs. " + (payment.getAmount() != null ? String.format("%.2f", payment.getAmount()) : "0.00"),
                            payment.getPaymentDate(),
                            payment.getId(),
                            "payment"
                        ));
                    }
                }
            }
        }

        // Get messages sent by user
        List<Message> allMessages = messageRepository.findAll();
        for (Message message : allMessages) {
            if (message.getSenderId() != null &&
                message.getSenderId().equals(userId) &&
                message.getSenderType() == Message.SenderType.USER &&
                message.getCreatedAt() != null) {
                
                // Only include if it's a recent message (within last 30 days) to avoid spam
                if (message.getCreatedAt().isAfter(LocalDateTime.now().minus(30, ChronoUnit.DAYS))) {
                    activities.add(new ActivityItem(
                        "MESSAGE_SENT",
                        "Sent a message",
                        message.getCreatedAt(),
                        message.getId(),
                        "message"
                    ));
                }
            }
        }

        // Get reviews by user
        List<Review> userReviews = reviewRepository.findByUser_Id(userId);
        for (Review review : userReviews) {
            if (review.getCreatedAt() != null) {
                String vendorName = review.getVendor() != null && review.getVendor().getCompanyName() != null
                    ? review.getVendor().getCompanyName()
                    : "vendor";
                activities.add(new ActivityItem(
                    "REVIEW_CREATED",
                    "Reviewed \"" + vendorName + "\"",
                    review.getCreatedAt(),
                    review.getId(),
                    "review"
                ));
            }
        }

        // Sort by timestamp (most recent first) and limit
        activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        
        return activities.stream()
                .limit(limit > 0 ? limit : 20)
                .map(this::activityToMap)
                .collect(Collectors.toList());
    }

    private Map<String, Object> activityToMap(ActivityItem activity) {
        Map<String, Object> map = new HashMap<>();
        map.put("type", activity.getType());
        map.put("text", activity.getText());
        map.put("timestamp", activity.getTimestamp());
        map.put("entityId", activity.getEntityId());
        map.put("entityType", activity.getEntityType());
        map.put("timeAgo", formatTimeAgo(activity.getTimestamp()));
        return map;
    }

    private String formatTimeAgo(LocalDateTime timestamp) {
        if (timestamp == null) return "Unknown";
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(timestamp, now);
        long hours = ChronoUnit.HOURS.between(timestamp, now);
        long days = ChronoUnit.DAYS.between(timestamp, now);

        if (minutes < 1) {
            return "Just now";
        } else if (minutes < 60) {
            return minutes + (minutes == 1 ? " minute ago" : " minutes ago");
        } else if (hours < 24) {
            return hours + (hours == 1 ? " hour ago" : " hours ago");
        } else if (days < 7) {
            return days + (days == 1 ? " day ago" : " days ago");
        } else {
            return timestamp.toLocalDate().toString();
        }
    }

    // Helper class to hold activity data
    private static class ActivityItem {
        private final String type;
        private final String text;
        private final LocalDateTime timestamp;
        private final String entityId;
        private final String entityType;

        public ActivityItem(String type, String text, LocalDateTime timestamp, String entityId, String entityType) {
            this.type = type;
            this.text = text;
            this.timestamp = timestamp;
            this.entityId = entityId;
            this.entityType = entityType;
        }

        public String getType() { return type; }
        public String getText() { return text; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public String getEntityId() { return entityId; }
        public String getEntityType() { return entityType; }
    }
}

