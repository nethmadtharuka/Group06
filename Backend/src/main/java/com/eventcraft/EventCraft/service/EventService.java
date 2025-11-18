package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.entity.VendorPackage;
import com.eventcraft.EventCraft.repository.EventRepository;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import com.eventcraft.EventCraft.repository.VendorPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final VendorPackageRepository vendorPackageRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(String id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        // If event has a user reference, ensure it's properly set
        if (event.getUser() == null && event.getId() != null) {
            // Try to find user by ID if provided in a different way
            // This is a fallback - the controller should set the user
        }
        return eventRepository.save(event);
    }

    public Event createEventForUser(String userId, Event event) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            event.setUser(userOpt.get());
            return eventRepository.save(event);
        }
        throw new RuntimeException("User not found with id: " + userId);
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }

    // Calendar-related methods
    public List<Event> getEventsByUserId(String userId) {
        return eventRepository.findByUserId(userId);
    }

    public List<Event> getUpcomingEventsByUserId(String userId, int limit) {
        LocalDate today = LocalDate.now();
        List<Event> upcomingEvents = eventRepository.findByUserIdAndStartDateGreaterThanEqualOrderByStartDateAsc(userId, today);
        return upcomingEvents.stream().limit(limit).toList();
    }

    public List<Event> getEventsByUserIdAndDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        return eventRepository.findByUserIdAndStartDateBetweenOrderByStartDateAsc(userId, startDate, endDate);
    }

    public Event updateEventDate(String eventId, LocalDate startDate, LocalDate endDate) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            event.setStartDate(startDate);
            if (endDate != null) {
                event.setEndDate(endDate);
            } else {
                event.setEndDate(startDate);
            }
            return eventRepository.save(event);
        }
        throw new RuntimeException("Event not found with id: " + eventId);
    }

    /**
     * Get featured vendors for an event based on budget matching.
     * Returns vendors whose packages best match the event budget.
     */
    public List<Map<String, Object>> getFeaturedVendorsForEvent(String eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            throw new RuntimeException("Event not found with id: " + eventId);
        }

        Event event = eventOpt.get();
        Double eventBudget = event.getBudget();

        // If no budget is set, return all approved vendors
        if (eventBudget == null || eventBudget <= 0) {
            return vendorRepository.findAll().stream()
                    .filter(v -> v.getApprovalStatus() == Vendor.ApprovalStatus.APPROVED)
                    .map(v -> {
                        Map<String, Object> vendorMap = new HashMap<>();
                        vendorMap.put("vendor", v);
                        vendorMap.put("matchScore", 0.0);
                        vendorMap.put("bestPackage", null);
                        return vendorMap;
                    })
                    .collect(Collectors.toList());
        }

        // Get all approved vendors
        List<Vendor> approvedVendors = vendorRepository.findAll().stream()
                .filter(v -> v.getApprovalStatus() == Vendor.ApprovalStatus.APPROVED)
                .collect(Collectors.toList());

        // Calculate match scores for each vendor
        List<Map<String, Object>> vendorMatches = new ArrayList<>();
        for (Vendor vendor : approvedVendors) {
            List<VendorPackage> packages = vendorPackageRepository.findByVendor_IdAndIsActiveTrue(vendor.getId());
            
            if (packages.isEmpty()) {
                continue; // Skip vendors with no active packages
            }

            // Find the best matching package (closest to budget without exceeding too much)
            VendorPackage bestPackage = null;
            double bestScore = Double.NEGATIVE_INFINITY;

            for (VendorPackage pkg : packages) {
                if (pkg.getPrice() == null) continue;

                double price = pkg.getPrice();
                double score = calculateBudgetMatchScore(price, eventBudget);
                
                if (score > bestScore) {
                    bestScore = score;
                    bestPackage = pkg;
                }
            }

            // Only include vendors with at least one package
            if (bestPackage != null && bestScore > Double.NEGATIVE_INFINITY) {
                Map<String, Object> vendorMatch = new HashMap<>();
                vendorMatch.put("vendor", vendor);
                vendorMatch.put("matchScore", bestScore);
                vendorMatch.put("bestPackage", bestPackage);
                vendorMatches.add(vendorMatch);
            }
        }

        // Sort by match score (highest first) and return top matches
        return vendorMatches.stream()
                .sorted((a, b) -> Double.compare(
                    (Double) b.get("matchScore"),
                    (Double) a.get("matchScore")
                ))
                .limit(20) // Return top 20 matches
                .collect(Collectors.toList());
    }

    /**
     * Calculate a match score for a package price against event budget.
     * Higher score = better match.
     * - Perfect match (within 5%): score = 100
     * - Within budget (5-20% below): score = 80-99
     * - Slightly over budget (0-20% over): score = 60-79
     * - Way over budget (>20%): score = 0-59
     */
    private double calculateBudgetMatchScore(double packagePrice, double eventBudget) {
        if (packagePrice <= 0 || eventBudget <= 0) {
            return 0.0;
        }

        double ratio = packagePrice / eventBudget;
        double percentageDiff = Math.abs(ratio - 1.0) * 100;

        if (ratio <= 1.0) {
            // Package is within or under budget
            if (percentageDiff <= 5) {
                // Perfect match (within 5%)
                return 100.0;
            } else if (percentageDiff <= 20) {
                // Good match (5-20% under)
                return 100.0 - (percentageDiff - 5) * 1.0; // 100 down to 80
            } else {
                // Too far under budget (might be low quality)
                return Math.max(50.0, 80.0 - (percentageDiff - 20) * 0.5);
            }
        } else {
            // Package exceeds budget
            if (percentageDiff <= 20) {
                // Slightly over (0-20% over)
                return 80.0 - percentageDiff * 1.0; // 80 down to 60
            } else {
                // Way over budget
                return Math.max(0.0, 60.0 - (percentageDiff - 20) * 1.0);
            }
        }
    }
}
