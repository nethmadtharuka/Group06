package com.eventcraft.EventCraft.dto;

import java.time.LocalDate;
import java.util.List;

public class CalendarAvailabilityDTO {
    
    private String userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<LocalDate> availableDates;
    private List<LocalDate> unavailableDates;
    private List<EventDateConflict> conflicts;
    private String message;
    private boolean success;
    
    // Constructors
    public CalendarAvailabilityDTO() {}
    
    public CalendarAvailabilityDTO(String userId, LocalDate startDate, LocalDate endDate,
                                   List<LocalDate> availableDates, List<LocalDate> unavailableDates,
                                   List<EventDateConflict> conflicts, String message, boolean success) {
        this.userId = userId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.availableDates = availableDates;
        this.unavailableDates = unavailableDates;
        this.conflicts = conflicts;
        this.message = message;
        this.success = success;
    }
    
    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public List<LocalDate> getAvailableDates() { return availableDates; }
    public void setAvailableDates(List<LocalDate> availableDates) { this.availableDates = availableDates; }
    
    public List<LocalDate> getUnavailableDates() { return unavailableDates; }
    public void setUnavailableDates(List<LocalDate> unavailableDates) { this.unavailableDates = unavailableDates; }
    
    public List<EventDateConflict> getConflicts() { return conflicts; }
    public void setConflicts(List<EventDateConflict> conflicts) { this.conflicts = conflicts; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    // Builder pattern
    public static CalendarAvailabilityDTOBuilder builder() {
        return new CalendarAvailabilityDTOBuilder();
    }
    
    public static class CalendarAvailabilityDTOBuilder {
        private String userId;
        private LocalDate startDate;
        private LocalDate endDate;
        private List<LocalDate> availableDates;
        private List<LocalDate> unavailableDates;
        private List<EventDateConflict> conflicts;
        private String message;
        private boolean success;
        
        public CalendarAvailabilityDTOBuilder userId(String userId) { this.userId = userId; return this; }
        public CalendarAvailabilityDTOBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public CalendarAvailabilityDTOBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public CalendarAvailabilityDTOBuilder availableDates(List<LocalDate> availableDates) { this.availableDates = availableDates; return this; }
        public CalendarAvailabilityDTOBuilder unavailableDates(List<LocalDate> unavailableDates) { this.unavailableDates = unavailableDates; return this; }
        public CalendarAvailabilityDTOBuilder conflicts(List<EventDateConflict> conflicts) { this.conflicts = conflicts; return this; }
        public CalendarAvailabilityDTOBuilder message(String message) { this.message = message; return this; }
        public CalendarAvailabilityDTOBuilder success(boolean success) { this.success = success; return this; }
        
        public CalendarAvailabilityDTO build() {
            return new CalendarAvailabilityDTO(userId, startDate, endDate, availableDates, unavailableDates, 
                                             conflicts, message, success);
        }
    }
    
    public static class EventDateConflict {
        private String eventId;
        private String eventName;
        private LocalDate conflictDate;
        private String conflictType; // "OVERLAP", "SAME_DATE", "TOO_CLOSE"
        
        // Constructors
        public EventDateConflict() {}
        
        public EventDateConflict(String eventId, String eventName, LocalDate conflictDate, String conflictType) {
            this.eventId = eventId;
            this.eventName = eventName;
            this.conflictDate = conflictDate;
            this.conflictType = conflictType;
        }
        
        // Getters and Setters
        public String getEventId() { return eventId; }
        public void setEventId(String eventId) { this.eventId = eventId; }
        
        public String getEventName() { return eventName; }
        public void setEventName(String eventName) { this.eventName = eventName; }
        
        public LocalDate getConflictDate() { return conflictDate; }
        public void setConflictDate(LocalDate conflictDate) { this.conflictDate = conflictDate; }
        
        public String getConflictType() { return conflictType; }
        public void setConflictType(String conflictType) { this.conflictType = conflictType; }
        
        // Builder pattern
        public static EventDateConflictBuilder builder() {
            return new EventDateConflictBuilder();
        }
        
        public static class EventDateConflictBuilder {
            private String eventId;
            private String eventName;
            private LocalDate conflictDate;
            private String conflictType;
            
            public EventDateConflictBuilder eventId(String eventId) { this.eventId = eventId; return this; }
            public EventDateConflictBuilder eventName(String eventName) { this.eventName = eventName; return this; }
            public EventDateConflictBuilder conflictDate(LocalDate conflictDate) { this.conflictDate = conflictDate; return this; }
            public EventDateConflictBuilder conflictType(String conflictType) { this.conflictType = conflictType; return this; }
            
            public EventDateConflict build() {
                return new EventDateConflict(eventId, eventName, conflictDate, conflictType);
            }
        }
    }
}
