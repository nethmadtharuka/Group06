package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(String id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
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

    public Event updateEvent(String id, Event event) {
        event.setId(id);
        return eventRepository.save(event);
    }
}
