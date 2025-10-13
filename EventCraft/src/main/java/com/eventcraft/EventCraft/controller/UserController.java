package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.ForgotPasswordRequest;
import com.eventcraft.EventCraft.dto.LoginRequest;
import com.eventcraft.EventCraft.dto.ResetPasswordRequest;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.service.PasswordResetService;
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
    private final PasswordResetService passwordResetService;

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

    // Test endpoint to create an admin user
    @PostMapping("/test-admin")
    public ResponseEntity<?> createTestAdmin() {
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@eventcraft.com");
        adminUser.setPassword("admin123");
        adminUser.setFullName("Administrator");
        adminUser.setRole(User.Role.ADMIN);

        try {
            User createdUser = userService.createUser(adminUser);
            createdUser.setPassword(null); // Remove password from response
            return ResponseEntity.ok("Admin user created: " + createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating admin user: " + e.getMessage());
        }
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            // Check if user exists
            if (!userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Email not found");
            }
            
            // Generate and send reset token
            passwordResetService.generateResetToken(request.getEmail());
            
            return ResponseEntity.ok("Password reset email sent successfully");
        } catch (Exception e) {
            System.err.println("Error in forgot password: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to process password reset request");
        }
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validateToken(token);
        if (isValid) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            // Validate token
            Optional<String> emailOpt = passwordResetService.getEmailByToken(request.getToken());
            if (emailOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid or expired token");
            }

            String email = emailOpt.get();
            
            // Reset password
            boolean success = userService.resetPassword(email, request.getNewPassword());
            if (!success) {
                return ResponseEntity.badRequest().body("Failed to reset password");
            }

            // Mark token as used
            passwordResetService.markTokenAsUsed(request.getToken());

            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            System.err.println("Error in reset password: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to reset password");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }
}
