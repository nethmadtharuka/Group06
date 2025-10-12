package com.eventcraft.EventCraft.dto;

import java.time.LocalDate;
import java.util.List;

public class DateSelectionDTO {
    
    private String eventId;
    private LocalDate selectedDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String eventName;
    private String eventDescription;
    private String location;
    private Double budget;
    private String userId;
    
    // For calendar availability checking
    private List<LocalDate> availableDates;
    private List<LocalDate> unavailableDates;
    private String timeSlot; // e.g., "MORNING", "AFTERNOON", "EVENING"
    
    // Response fields
    private boolean isDateAvailable;
    private String message;
    private String status; // "SUCCESS", "ERROR", "WARNING"
    
    // Constructors
    public DateSelectionDTO() {}
    
    public DateSelectionDTO(String eventId, LocalDate selectedDate, LocalDate startDate, LocalDate endDate,
                            String eventName, String eventDescription, String location, Double budget,
                            String userId, List<LocalDate> availableDates, List<LocalDate> unavailableDates,
                            String timeSlot, boolean isDateAvailable, String message, String status) {
        this.eventId = eventId;
        this.selectedDate = selectedDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.eventName = eventName;
        this.eventDescription = eventDescription;
        this.location = location;
        this.budget = budget;
        this.userId = userId;
        this.availableDates = availableDates;
        this.unavailableDates = unavailableDates;
        this.timeSlot = timeSlot;
        this.isDateAvailable = isDateAvailable;
        this.message = message;
        this.status = status;
    }
    
    // Getters and Setters
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    
    public LocalDate getSelectedDate() { return selectedDate; }
    public void setSelectedDate(LocalDate selectedDate) { this.selectedDate = selectedDate; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }
    
    public String getEventDescription() { return eventDescription; }
    public void setEventDescription(String eventDescription) { this.eventDescription = eventDescription; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public List<LocalDate> getAvailableDates() { return availableDates; }
    public void setAvailableDates(List<LocalDate> availableDates) { this.availableDates = availableDates; }
    
    public List<LocalDate> getUnavailableDates() { return unavailableDates; }
    public void setUnavailableDates(List<LocalDate> unavailableDates) { this.unavailableDates = unavailableDates; }
    
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    
    public boolean getIsDateAvailable() { return isDateAvailable; }
    public void setIsDateAvailable(boolean isDateAvailable) { this.isDateAvailable = isDateAvailable; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    // Builder pattern
    public static DateSelectionDTOBuilder builder() {
        return new DateSelectionDTOBuilder();
    }
    
    public static class DateSelectionDTOBuilder {
        private String eventId;
        private LocalDate selectedDate;
        private LocalDate startDate;
        private LocalDate endDate;
        private String eventName;
        private String eventDescription;
        private String location;
        private Double budget;
        private String userId;
        private List<LocalDate> availableDates;
        private List<LocalDate> unavailableDates;
        private String timeSlot;
        private boolean isDateAvailable;
        private String message;
        private String status;
        
        public DateSelectionDTOBuilder eventId(String eventId) { this.eventId = eventId; return this; }
        public DateSelectionDTOBuilder selectedDate(LocalDate selectedDate) { this.selectedDate = selectedDate; return this; }
        public DateSelectionDTOBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public DateSelectionDTOBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public DateSelectionDTOBuilder eventName(String eventName) { this.eventName = eventName; return this; }
        public DateSelectionDTOBuilder eventDescription(String eventDescription) { this.eventDescription = eventDescription; return this; }
        public DateSelectionDTOBuilder location(String location) { this.location = location; return this; }
        public DateSelectionDTOBuilder budget(Double budget) { this.budget = budget; return this; }
        public DateSelectionDTOBuilder userId(String userId) { this.userId = userId; return this; }
        public DateSelectionDTOBuilder availableDates(List<LocalDate> availableDates) { this.availableDates = availableDates; return this; }
        public DateSelectionDTOBuilder unavailableDates(List<LocalDate> unavailableDates) { this.unavailableDates = unavailableDates; return this; }
        public DateSelectionDTOBuilder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public DateSelectionDTOBuilder isDateAvailable(boolean isDateAvailable) { this.isDateAvailable = isDateAvailable; return this; }
        public DateSelectionDTOBuilder message(String message) { this.message = message; return this; }
        public DateSelectionDTOBuilder status(String status) { this.status = status; return this; }
        
        public DateSelectionDTO build() {
            return new DateSelectionDTO(eventId, selectedDate, startDate, endDate, eventName, eventDescription, 
                                      location, budget, userId, availableDates, unavailableDates, timeSlot, 
                                      isDateAvailable, message, status);
        }
    }
}
