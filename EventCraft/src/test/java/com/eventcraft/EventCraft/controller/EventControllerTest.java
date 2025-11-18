package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.service.EventService;
import com.eventcraft.EventCraft.util.TestDataBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(EventController.class)
@DisplayName("EventController API Tests")
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void testGetAllEvents() throws Exception {
        when(eventService.getAllEvents()).thenReturn(Arrays.asList(testEvent));

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Event"))
                .andExpect(jsonPath("$[0].id").value("test-event-id"));

        verify(eventService).getAllEvents();
    }

    @Test
    @DisplayName("Should get event by ID")
    void testGetEventById() throws Exception {
        when(eventService.getEventById("test-event-id")).thenReturn(Optional.of(testEvent));

        mockMvc.perform(get("/api/events/test-event-id"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Event"))
                .andExpect(jsonPath("$.id").value("test-event-id"));

        verify(eventService).getEventById("test-event-id");
    }

    @Test
    @DisplayName("Should create event")
    void testCreateEvent() throws Exception {
        Event newEvent = TestDataBuilder.buildTestEvent(testUser);
        Event savedEvent = TestDataBuilder.buildTestEvent(testUser);
        savedEvent.setId("new-event-id");

        when(eventService.createEvent(any(Event.class))).thenReturn(savedEvent);

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("new-event-id"))
                .andExpect(jsonPath("$.name").value("Test Event"));

        verify(eventService).createEvent(any(Event.class));
    }

    @Test
    @DisplayName("Should delete event")
    void testDeleteEvent() throws Exception {
        doNothing().when(eventService).deleteEvent("test-event-id");

        mockMvc.perform(delete("/api/events/test-event-id"))
                .andExpect(status().isOk());

        verify(eventService).deleteEvent("test-event-id");
    }

    @Test
    @DisplayName("Should get events by user ID")
    void testGetEventsByUser() throws Exception {
        List<Event> events = Arrays.asList(testEvent);
        when(eventService.getEventsByUserId("test-user-id")).thenReturn(events);

        mockMvc.perform(get("/api/events/user/test-user-id"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("test-event-id"));

        verify(eventService).getEventsByUserId("test-user-id");
    }

    @Test
    @DisplayName("Should get upcoming events by user ID")
    void testGetUpcomingEventsByUser() throws Exception {
        List<Event> events = Arrays.asList(testEvent);
        when(eventService.getUpcomingEventsByUserId("test-user-id", 10)).thenReturn(events);

        mockMvc.perform(get("/api/events/user/test-user-id/upcoming")
                        .param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("test-event-id"));

        verify(eventService).getUpcomingEventsByUserId("test-user-id", 10);
    }

    @Test
    @DisplayName("Should get events by date range")
    void testGetEventsByDateRange() throws Exception {
        LocalDate startDate = LocalDate.now().plusDays(1);
        LocalDate endDate = LocalDate.now().plusDays(30);
        List<Event> events = Arrays.asList(testEvent);

        when(eventService.getEventsByUserIdAndDateRange("test-user-id", startDate, endDate))
                .thenReturn(events);

        mockMvc.perform(get("/api/events/user/test-user-id/date-range")
                        .param("startDate", startDate.toString())
                        .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("test-event-id"));

        verify(eventService).getEventsByUserIdAndDateRange("test-user-id", startDate, endDate);
    }

    @Test
    @DisplayName("Should update event date")
    void testUpdateEventDate() throws Exception {
        LocalDate newStartDate = LocalDate.now().plusDays(10);
        Event updatedEvent = TestDataBuilder.buildTestEvent(testUser);
        updatedEvent.setId("test-event-id");
        updatedEvent.setStartDate(newStartDate);

        when(eventService.updateEventDate("test-event-id", newStartDate, null))
                .thenReturn(updatedEvent);

        mockMvc.perform(put("/api/events/test-event-id/date")
                        .param("startDate", newStartDate.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.startDate").value(newStartDate.toString()));

        verify(eventService).updateEventDate("test-event-id", newStartDate, null);
    }
}

