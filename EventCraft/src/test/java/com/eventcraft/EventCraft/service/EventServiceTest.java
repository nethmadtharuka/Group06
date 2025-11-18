package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.repository.EventRepository;
import com.eventcraft.EventCraft.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for EventService
 * Tests all business logic for event management
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("EventService Unit Tests")
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private User testUser;
    private Event testEvent;

    @BeforeEach
    void setUp() {
        testUser = TestDataBuilder.buildTestUser();
        testUser.setId("test-user-id");
        testEvent = TestDataBuilder.buildTestEvent(testUser);
        testEvent.setId("test-event-id");
    }

    @Test
    @DisplayName("Should get all events")
    void testGetAllEvents() {
        List<Event> events = Arrays.asList(testEvent);
        when(eventRepository.findAll()).thenReturn(events);

        List<Event> result = eventService.getAllEvents();

        assertThat(result).hasSize(1);
        assertEquals("Test Event", result.get(0).getName());
        verify(eventRepository).findAll();
    }

    @Test
    @DisplayName("Should get event by ID")
    void testGetEventById() {
        when(eventRepository.findById("test-event-id")).thenReturn(Optional.of(testEvent));
        when(eventRepository.findById("nonexistent")).thenReturn(Optional.empty());

        Optional<Event> found = eventService.getEventById("test-event-id");
        Optional<Event> notFound = eventService.getEventById("nonexistent");

        assertTrue(found.isPresent());
        assertEquals("Test Event", found.get().getName());
        assertFalse(notFound.isPresent());
        verify(eventRepository, times(2)).findById(anyString());
    }

    @Test
    @DisplayName("Should create event")
    void testCreateEvent() {
        Event newEvent = TestDataBuilder.buildTestEvent(testUser);
        Event savedEvent = TestDataBuilder.buildTestEvent(testUser);
        savedEvent.setId("new-event-id");

        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);

        Event result = eventService.createEvent(newEvent);

        assertNotNull(result);
        assertEquals("new-event-id", result.getId());
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    @DisplayName("Should delete event")
    void testDeleteEvent() {
        doNothing().when(eventRepository).deleteById("test-event-id");

        eventService.deleteEvent("test-event-id");

        verify(eventRepository).deleteById("test-event-id");
    }

    @Test
    @DisplayName("Should get events by user ID")
    void testGetEventsByUserId() {
        List<Event> events = Arrays.asList(testEvent);
        when(eventRepository.findByUserId("test-user-id")).thenReturn(events);

        List<Event> result = eventService.getEventsByUserId("test-user-id");

        assertThat(result).hasSize(1);
        assertEquals("test-user-id", result.get(0).getUser().getId());
        verify(eventRepository).findByUserId("test-user-id");
    }

    @Test
    @DisplayName("Should get upcoming events by user ID")
    void testGetUpcomingEventsByUserId() {
        Event upcomingEvent1 = TestDataBuilder.buildTestEvent(testUser);
        upcomingEvent1.setStartDate(LocalDate.now().plusDays(5));
        Event upcomingEvent2 = TestDataBuilder.buildTestEvent(testUser);
        upcomingEvent2.setStartDate(LocalDate.now().plusDays(10));
        Event pastEvent = TestDataBuilder.buildTestEvent(testUser);
        pastEvent.setStartDate(LocalDate.now().minusDays(5));

        List<Event> allUpcoming = Arrays.asList(upcomingEvent1, upcomingEvent2);
        when(eventRepository.findByUserIdAndStartDateGreaterThanEqualOrderByStartDateAsc(
                anyString(), any(LocalDate.class))).thenReturn(allUpcoming);

        List<Event> result = eventService.getUpcomingEventsByUserId("test-user-id", 10);

        assertThat(result).hasSize(2);
        verify(eventRepository).findByUserIdAndStartDateGreaterThanEqualOrderByStartDateAsc(
                eq("test-user-id"), any(LocalDate.class));
    }

    @Test
    @DisplayName("Should limit upcoming events")
    void testGetUpcomingEventsWithLimit() {
        List<Event> events = Arrays.asList(
                TestDataBuilder.buildTestEvent(testUser),
                TestDataBuilder.buildTestEvent(testUser),
                TestDataBuilder.buildTestEvent(testUser)
        );
        when(eventRepository.findByUserIdAndStartDateGreaterThanEqualOrderByStartDateAsc(
                anyString(), any(LocalDate.class))).thenReturn(events);

        List<Event> result = eventService.getUpcomingEventsByUserId("test-user-id", 2);

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("Should get events by date range")
    void testGetEventsByDateRange() {
        LocalDate startDate = LocalDate.now().plusDays(1);
        LocalDate endDate = LocalDate.now().plusDays(30);
        List<Event> events = Arrays.asList(testEvent);

        when(eventRepository.findByUserIdAndStartDateBetweenOrderByStartDateAsc(
                eq("test-user-id"), eq(startDate), eq(endDate))).thenReturn(events);

        List<Event> result = eventService.getEventsByUserIdAndDateRange("test-user-id", startDate, endDate);

        assertThat(result).hasSize(1);
        verify(eventRepository).findByUserIdAndStartDateBetweenOrderByStartDateAsc(
                "test-user-id", startDate, endDate);
    }

    @Test
    @DisplayName("Should update event date")
    void testUpdateEventDate() {
        LocalDate newStartDate = LocalDate.now().plusDays(10);
        LocalDate newEndDate = LocalDate.now().plusDays(12);
        Event updatedEvent = TestDataBuilder.buildTestEvent(testUser);
        updatedEvent.setId("test-event-id");
        updatedEvent.setStartDate(newStartDate);
        updatedEvent.setEndDate(newEndDate);

        when(eventRepository.findById("test-event-id")).thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(updatedEvent);

        Event result = eventService.updateEventDate("test-event-id", newStartDate, newEndDate);

        assertNotNull(result);
        assertEquals(newStartDate, result.getStartDate());
        assertEquals(newEndDate, result.getEndDate());
        verify(eventRepository).findById("test-event-id");
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    @DisplayName("Should set end date to start date when end date is null")
    void testUpdateEventDateWithNullEndDate() {
        LocalDate newStartDate = LocalDate.now().plusDays(10);
        Event updatedEvent = TestDataBuilder.buildTestEvent(testUser);
        updatedEvent.setId("test-event-id");
        updatedEvent.setStartDate(newStartDate);
        updatedEvent.setEndDate(newStartDate);

        when(eventRepository.findById("test-event-id")).thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(updatedEvent);

        Event result = eventService.updateEventDate("test-event-id", newStartDate, null);

        assertNotNull(result);
        assertEquals(newStartDate, result.getStartDate());
        assertEquals(newStartDate, result.getEndDate());
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent event")
    void testUpdateEventDateNotFound() {
        when(eventRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            eventService.updateEventDate("nonexistent", LocalDate.now(), null);
        });

        verify(eventRepository).findById("nonexistent");
        verify(eventRepository, never()).save(any(Event.class));
    }
}

