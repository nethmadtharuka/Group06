package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.CalendarAvailabilityDTO;
import com.eventcraft.EventCraft.dto.DateSelectionDTO;
import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.service.CalendarService;
import com.eventcraft.EventCraft.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CalendarController {

    private final CalendarService calendarService;
    private final EventService eventService;

    /**
     * Check if a specific date is available for event planning
     */
    @PostMapping("/check-availability")
    public ResponseEntity<DateSelectionDTO> checkDateAvailability(@RequestBody DateSelectionDTO dateSelection) {
        try {
            DateSelectionDTO result = calendarService.checkDateAvailability(dateSelection);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            DateSelectionDTO errorResponse = DateSelectionDTO.builder()
                    .isDateAvailable(false)
                    .message("Error checking date availability: " + e.getMessage())
                    .status("ERROR")
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Validate date selection with business rules
     */
    @PostMapping("/validate-date")
    public ResponseEntity<DateSelectionDTO> validateDateSelection(@RequestBody DateSelectionDTO dateSelection) {
        try {
            DateSelectionDTO result = calendarService.validateDateSelection(dateSelection);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            DateSelectionDTO errorResponse = DateSelectionDTO.builder()
                    .isDateAvailable(false)
                    .message("Error validating date: " + e.getMessage())
                    .status("ERROR")
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get available dates within a date range
     */
    @GetMapping("/availability/{userId}")
    public ResponseEntity<CalendarAvailabilityDTO> getAvailableDates(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        try {
            CalendarAvailabilityDTO result = calendarService.getAvailableDates(userId, startDate, endDate);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            CalendarAvailabilityDTO errorResponse = CalendarAvailabilityDTO.builder()
                    .success(false)
                    .message("Error retrieving calendar availability: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get suggested dates for event planning
     */
    @GetMapping("/suggestions/{userId}")
    public ResponseEntity<List<LocalDate>> getSuggestedDates(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate preferredDate,
            @RequestParam(defaultValue = "5") int numberOfSuggestions) {
        
        try {
            List<LocalDate> suggestions = calendarService.getSuggestedDates(userId, preferredDate, numberOfSuggestions);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get upcoming events for calendar display
     */
    @GetMapping("/upcoming-events/{userId}")
    public ResponseEntity<List<Event>> getUpcomingEvents(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        
        try {
            List<Event> events = calendarService.getUpcomingEvents(userId, limit);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Create event with selected date
     */
    @PostMapping("/create-event")
    public ResponseEntity<Event> createEventWithDate(@RequestBody DateSelectionDTO dateSelection) {
        try {
            // Validate the date first
            DateSelectionDTO validation = calendarService.validateDateSelection(dateSelection);
            if (!validation.getIsDateAvailable()) {
                return ResponseEntity.badRequest().build();
            }

            // Create the event
            Event event = Event.builder()
                    .name(dateSelection.getEventName())
                    .description(dateSelection.getEventDescription())
                    .startDate(dateSelection.getSelectedDate())
                    .endDate(dateSelection.getEndDate() != null ? dateSelection.getEndDate() : dateSelection.getSelectedDate())
                    .location(dateSelection.getLocation())
                    .budget(dateSelection.getBudget())
                    .build();

            // Set user (you might need to get this from authentication context)
            // For now, we'll assume it's passed in the DTO
            if (dateSelection.getUserId() != null) {
                // You'll need to fetch the user entity and set it
                // event.setUser(userService.getUserById(dateSelection.getUserId()));
            }

            Event createdEvent = eventService.createEvent(event);
            return ResponseEntity.ok(createdEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update event date
     */
    @PutMapping("/update-event-date/{eventId}")
    public ResponseEntity<Event> updateEventDate(
            @PathVariable String eventId,
            @RequestBody DateSelectionDTO dateSelection) {
        
        try {
            // Get existing event
            var existingEvent = eventService.getEventById(eventId);
            if (existingEvent.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Event event = existingEvent.get();
            
            // Validate new date
            dateSelection.setUserId(event.getUser().getId());
            DateSelectionDTO validation = calendarService.validateDateSelection(dateSelection);
            if (!validation.getIsDateAvailable()) {
                return ResponseEntity.badRequest().build();
            }

            // Update the event
            event.setStartDate(dateSelection.getSelectedDate());
            if (dateSelection.getEndDate() != null) {
                event.setEndDate(dateSelection.getEndDate());
            }

            Event updatedEvent = eventService.createEvent(event);
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

