package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.CalendarAvailabilityDTO;
import com.eventcraft.EventCraft.dto.DateSelectionDTO;
import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final EventRepository eventRepository;

    /**
     * Check if a specific date is available for a user
     */
    public DateSelectionDTO checkDateAvailability(DateSelectionDTO dateSelection) {
        String userId = dateSelection.getUserId();
        LocalDate selectedDate = dateSelection.getSelectedDate();
        
        // Get all events for the user
        List<Event> userEvents = eventRepository.findByUserId(userId);
        
        // Check for conflicts
        List<Event> conflictingEvents = userEvents.stream()
                .filter(event -> isDateInRange(selectedDate, event.getStartDate(), event.getEndDate()))
                .collect(Collectors.toList());
        
        DateSelectionDTO response = DateSelectionDTO.builder()
                .eventId(dateSelection.getEventId())
                .selectedDate(selectedDate)
                .userId(userId)
                .build();
        
        if (conflictingEvents.isEmpty()) {
            response.setIsDateAvailable(true);
            response.setMessage("Date is available for your event");
            response.setStatus("SUCCESS");
        } else {
            response.setIsDateAvailable(false);
            response.setMessage("Date conflicts with existing event: " + 
                    conflictingEvents.get(0).getName());
            response.setStatus("ERROR");
        }
        
        return response;
    }

    /**
     * Get available dates for a user within a date range
     */
    public CalendarAvailabilityDTO getAvailableDates(String userId, LocalDate startDate, LocalDate endDate) {
        List<Event> userEvents = eventRepository.findByUserId(userId);
        
        List<LocalDate> availableDates = new ArrayList<>();
        List<LocalDate> unavailableDates = new ArrayList<>();
        List<CalendarAvailabilityDTO.EventDateConflict> conflicts = new ArrayList<>();
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            boolean isAvailable = true;
            
            for (Event event : userEvents) {
                if (isDateInRange(currentDate, event.getStartDate(), event.getEndDate())) {
                    isAvailable = false;
                    unavailableDates.add(currentDate);
                    
                    // Add conflict information
                    conflicts.add(CalendarAvailabilityDTO.EventDateConflict.builder()
                            .eventId(event.getId())
                            .eventName(event.getName())
                            .conflictDate(currentDate)
                            .conflictType("OVERLAP")
                            .build());
                    break;
                }
            }
            
            if (isAvailable) {
                availableDates.add(currentDate);
            }
            
            currentDate = currentDate.plusDays(1);
        }
        
        return CalendarAvailabilityDTO.builder()
                .userId(userId)
                .startDate(startDate)
                .endDate(endDate)
                .availableDates(availableDates)
                .unavailableDates(unavailableDates)
                .conflicts(conflicts)
                .message("Calendar availability retrieved successfully")
                .success(true)
                .build();
    }

    /**
     * Validate date selection and provide recommendations
     */
    public DateSelectionDTO validateDateSelection(DateSelectionDTO dateSelection) {
        LocalDate selectedDate = dateSelection.getSelectedDate();
        LocalDate today = LocalDate.now();
        
        // Check if date is in the past
        if (selectedDate.isBefore(today)) {
            return DateSelectionDTO.builder()
                    .eventId(dateSelection.getEventId())
                    .selectedDate(selectedDate)
                    .userId(dateSelection.getUserId())
                    .isDateAvailable(false)
                    .message("Cannot select a date in the past")
                    .status("ERROR")
                    .build();
        }
        
        // Check if date is too far in the future (more than 2 years)
        if (ChronoUnit.DAYS.between(today, selectedDate) > 730) {
            return DateSelectionDTO.builder()
                    .eventId(dateSelection.getEventId())
                    .selectedDate(selectedDate)
                    .userId(dateSelection.getUserId())
                    .isDateAvailable(false)
                    .message("Date is too far in the future (maximum 2 years)")
                    .status("ERROR")
                    .build();
        }
        
        // Check for availability
        return checkDateAvailability(dateSelection);
    }

    /**
     * Get suggested dates based on user preferences
     */
    public List<LocalDate> getSuggestedDates(String userId, LocalDate preferredDate, int numberOfSuggestions) {
        List<LocalDate> suggestions = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        // Start from preferred date and look for available dates
        LocalDate searchDate = preferredDate;
        int daysToSearch = 30; // Search within 30 days
        
        for (int i = 0; i < daysToSearch && suggestions.size() < numberOfSuggestions; i++) {
            DateSelectionDTO dateCheck = DateSelectionDTO.builder()
                    .userId(userId)
                    .selectedDate(searchDate)
                    .build();
            
            DateSelectionDTO result = checkDateAvailability(dateCheck);
            if (result.getIsDateAvailable()) {
                suggestions.add(searchDate);
            }
            
            // Try dates before and after the preferred date
            if (i % 2 == 0) {
                searchDate = preferredDate.plusDays((i / 2) + 1);
            } else {
                searchDate = preferredDate.minusDays((i / 2) + 1);
            }
            
            // Make sure we don't go into the past
            if (searchDate.isBefore(today)) {
                searchDate = today.plusDays(1);
            }
        }
        
        return suggestions;
    }

    /**
     * Helper method to check if a date falls within a date range
     */
    private boolean isDateInRange(LocalDate date, LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return false;
        }
        return !date.isBefore(startDate) && !date.isAfter(endDate);
    }

    /**
     * Get upcoming events for a user (for calendar display)
     */
    public List<Event> getUpcomingEvents(String userId, int limit) {
        LocalDate today = LocalDate.now();
        return eventRepository.findByUserIdAndStartDateGreaterThanEqualOrderByStartDateAsc(userId, today)
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
    }
}

