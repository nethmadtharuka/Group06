package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TestController {

    private final PasswordResetService passwordResetService;

    // Test endpoint to verify email service configuration
    @PostMapping("/email")
    public ResponseEntity<?> testEmail(@RequestParam String email) {
        try {
            passwordResetService.generateResetToken(email);
            return ResponseEntity.ok("Test email sent successfully to: " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send test email: " + e.getMessage());
        }
    }

    // Test endpoint to validate token format
    @GetMapping("/validate-token")
    public ResponseEntity<?> testValidateToken(@RequestParam String token) {
        try {
            boolean isValid = passwordResetService.validateToken(token);
            return ResponseEntity.ok("Token valid: " + isValid);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error validating token: " + e.getMessage());
        }
    }
}