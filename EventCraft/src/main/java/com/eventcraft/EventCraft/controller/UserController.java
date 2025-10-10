package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.LoginRequest;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Check for required fields
        if (user.getUsername() == null || user.getUsername().isEmpty() ||
                user.getEmail() == null || user.getEmail().isEmpty() ||
                user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }
        // Check for unique username/email
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        String loginId = loginRequest.getLoginIdentifier();
        System.out.println("DEBUG: Login attempt for: " + loginId);
        System.out.println("DEBUG: Password: " + (loginRequest.getPassword() != null ? "provided" : "null"));

        if (loginId == null || loginRequest.getPassword() == null) {
            System.out.println("DEBUG: Missing login credentials");
            return ResponseEntity.badRequest().body("Missing username/email or password");
        }

        // Verify credentials with bcrypt
        Optional<User> authenticatedUser = userService.authenticateUser(
                loginId,
                loginRequest.getPassword()
        );

        if (authenticatedUser.isPresent()) {
            // Return user data if valid (excluding password)
            User user = authenticatedUser.get();
            user.setPassword(null); // Remove password from response for security
            System.out.println("DEBUG: Login successful for user: " + user.getUsername());
            return ResponseEntity.ok(user);
        } else {
            System.out.println("DEBUG: Login failed for user: " + loginId);
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    // Test endpoint to create a test user
    @PostMapping("/test-user")
    public ResponseEntity<?> createTestUser() {
        User testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@test.com");
        testUser.setPassword("password123");
        testUser.setFullName("Test User");

        try {
            User createdUser = userService.createUser(testUser);
            createdUser.setPassword(null); // Remove password from response
            return ResponseEntity.ok("Test user created: " + createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating test user: " + e.getMessage());
        }
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }
}
