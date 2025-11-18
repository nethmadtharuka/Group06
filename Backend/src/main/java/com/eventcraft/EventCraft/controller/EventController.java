package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Optional<Event> getEventById(@PathVariable String id) {
        return eventService.getEventById(id);
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @PostMapping("/user/{userId}")
    public Event createEventForUser(@PathVariable String userId, @RequestBody Event event) {
        return eventService.createEventForUser(userId, event);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
    }

    // Calendar-related endpoints
    @GetMapping("/user/{userId}")
    public List<Event> getEventsByUser(@PathVariable String userId) {
        return eventService.getEventsByUserId(userId);
    }

    @GetMapping("/user/{userId}/upcoming")
    public List<Event> getUpcomingEventsByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        return eventService.getUpcomingEventsByUserId(userId, limit);
    }

    @GetMapping("/user/{userId}/date-range")
    public List<Event> getEventsByDateRange(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return eventService.getEventsByUserIdAndDateRange(userId, startDate, endDate);
    }

    @PutMapping("/{id}/date")
    public Event updateEventDate(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return eventService.updateEventDate(id, startDate, endDate);
    }

    @GetMapping("/{eventId}/featured-vendors")
    public List<Map<String, Object>> getFeaturedVendorsForEvent(@PathVariable String eventId) {
        return eventService.getFeaturedVendorsForEvent(eventId);
    }
}
