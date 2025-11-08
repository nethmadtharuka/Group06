package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.service.EventService;
import com.eventcraft.EventCraft.service.UserService;
import com.eventcraft.EventCraft.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final EventService eventService;
    private final VendorService vendorService;

    // ==================== Dashboard Statistics ====================
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        List<User> allUsers = userService.getAllUsers();
        long totalUsers = allUsers.size();
        long adminCount = allUsers.stream().filter(u -> u.getRole() == User.Role.ADMIN).count();
        long vendorCount = allUsers.stream().filter(u -> u.getRole() == User.Role.VENDOR).count();
        long customerCount = allUsers.stream().filter(u -> u.getRole() == User.Role.CUSTOMER).count();
        
        stats.put("totalUsers", totalUsers);
        stats.put("adminCount", adminCount);
        stats.put("vendorCount", vendorCount);
        stats.put("customerCount", customerCount);
        
        // Event statistics
        List<Event> allEvents = eventService.getAllEvents();
        stats.put("totalEvents", allEvents.size());
        
        // Vendor statistics
        List<Vendor> allVendors = vendorService.getAllVendors();
        stats.put("totalVendors", allVendors.size());
        
        return ResponseEntity.ok(stats);
    }

    // ==================== User Management ====================
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        try {
            Optional<User> existingUser = userService.getUserById(id);
            if (existingUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = existingUser.get();
            
            // Update allowed fields
            if (updatedUser.getFullName() != null) {
                user.setFullName(updatedUser.getFullName());
            }
            if (updatedUser.getEmail() != null) {
                user.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getPhone() != null) {
                user.setPhone(updatedUser.getPhone());
            }
            if (updatedUser.getRole() != null) {
                user.setRole(updatedUser.getRole());
            }
            
            user.setUpdatedAt(LocalDateTime.now());
            User savedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            Optional<User> user = userService.getUserById(id);
            if (user.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Prevent admin from deleting themselves or last admin
            if (user.get().getRole() == User.Role.ADMIN) {
                long adminCount = userService.getAllUsers().stream()
                        .filter(u -> u.getRole() == User.Role.ADMIN)
                        .count();
                if (adminCount <= 1) {
                    return ResponseEntity.badRequest()
                            .body("Cannot delete the last admin user");
                }
            }
            
            userService.deleteUser(id);
            return ResponseEntity.ok().body("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> roleData) {
        try {
            Optional<User> user = userService.getUserById(id);
            if (user.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            String roleStr = roleData.get("role");
            User.Role newRole = User.Role.valueOf(roleStr.toUpperCase());
            
            User existingUser = user.get();
            existingUser.setRole(newRole);
            existingUser.setUpdatedAt(LocalDateTime.now());
            
            User updatedUser = userService.updateUser(id, existingUser);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role specified");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user role: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String id) {
        try {
            Optional<User> user = userService.getUserById(id);
            if (user.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // This is a placeholder - you may want to add an 'active' field to User entity
            // For now, we'll just return success
            return ResponseEntity.ok().body("User status toggled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error toggling user status: " + e.getMessage());
        }
    }

    // ==================== Event Management ====================
    
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        Optional<Event> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {
        try {
            Optional<Event> event = eventService.getEventById(id);
            if (event.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            eventService.deleteEvent(id);
            return ResponseEntity.ok().body("Event deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting event: " + e.getMessage());
        }
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable String id, @RequestBody Event updatedEvent) {
        try {
            Optional<Event> existingEvent = eventService.getEventById(id);
            if (existingEvent.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Event savedEvent = eventService.updateEvent(id, updatedEvent);
            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating event: " + e.getMessage());
        }
    }

    // ==================== Vendor Management ====================
    
    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/vendors/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable String id) {
        Optional<Vendor> vendor = vendorService.getVendorById(id);
        return vendor.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/vendors/{id}")
    public ResponseEntity<?> deleteVendor(@PathVariable String id) {
        try {
            Optional<Vendor> vendor = vendorService.getVendorById(id);
            if (vendor.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            vendorService.deleteVendor(id);
            return ResponseEntity.ok().body("Vendor deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting vendor: " + e.getMessage());
        }
    }

    @PutMapping("/vendors/{id}")
    public ResponseEntity<?> updateVendor(@PathVariable String id, @RequestBody Vendor updatedVendor) {
        try {
            Optional<Vendor> existingVendor = vendorService.getVendorById(id);
            if (existingVendor.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Vendor savedVendor = vendorService.updateVendorById(id, updatedVendor);
            return ResponseEntity.ok(savedVendor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating vendor: " + e.getMessage());
        }
    }

    // ==================== System Settings ====================
    
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSystemSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("siteName", "EventCraft");
        settings.put("maintenanceMode", false);
        settings.put("registrationEnabled", true);
        settings.put("maxEventsPerUser", 50);
        settings.put("emailNotifications", true);
        settings.put("version", "1.0.0");
        settings.put("lastUpdated", LocalDateTime.now());
        
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSystemSettings(@RequestBody Map<String, Object> settings) {
        try {
            // In a real application, you would save these settings to a database
            // For now, we'll just return the updated settings
            settings.put("lastUpdated", LocalDateTime.now());
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating system settings: " + e.getMessage());
        }
    }

    // ==================== Activity Logs ====================
    
    @GetMapping("/logs")
    public ResponseEntity<List<Map<String, Object>>> getActivityLogs() {
        // This is a placeholder - in a real application, you would fetch from a logging service
        List<Map<String, Object>> logs = List.of(
            Map.of(
                "id", "1",
                "action", "User Login",
                "user", "admin@eventcraft.com",
                "timestamp", LocalDateTime.now().minusHours(2),
                "details", "Admin user logged in successfully"
            ),
            Map.of(
                "id", "2",
                "action", "Event Created",
                "user", "user@example.com",
                "timestamp", LocalDateTime.now().minusHours(5),
                "details", "New event 'Birthday Party' created"
            )
        );
        
        return ResponseEntity.ok(logs);
    }
}
