package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.ContactFormDTO;
import com.eventcraft.EventCraft.service.EmailService;
import com.eventcraft.EventCraft.service.SMSService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final EmailService emailService;
    private final SMSService smsService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactFormDTO contactForm) {
        try {
            log.info("Received contact form submission from: {}", contactForm.getFullName());
            
            // Validate required fields
            if (contactForm.getFullName() == null || contactForm.getFullName().trim().isEmpty() ||
                contactForm.getEmail() == null || contactForm.getEmail().trim().isEmpty() ||
                contactForm.getSubject() == null || contactForm.getSubject().trim().isEmpty() ||
                contactForm.getMessage() == null || contactForm.getMessage().trim().isEmpty()) {
                
                return ResponseEntity.badRequest().body(createErrorResponse("All fields are required"));
            }

            // Validate email format
            String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
            if (!contactForm.getEmail().matches(emailRegex)) {
                return ResponseEntity.badRequest().body(createErrorResponse("Please enter a valid email address"));
            }

            // Send email notification
            try {
                emailService.sendContactFormNotification(
                    contactForm.getFullName().trim(),
                    contactForm.getEmail().trim(),
                    contactForm.getSubject().trim(),
                    contactForm.getMessage().trim()
                );
                log.info("Email notification sent successfully");
            } catch (Exception e) {
                log.error("Failed to send email notification: {}", e.getMessage(), e);
                // Continue processing even if email fails
            }

            // Send SMS notification
            try {
                smsService.sendContactFormNotification(
                    contactForm.getFullName().trim(),
                    contactForm.getEmail().trim(),
                    contactForm.getMessage().trim()
                );
                log.info("SMS notification sent successfully");
            } catch (Exception e) {
                log.error("Failed to send SMS notification: {}", e.getMessage(), e);
                // Continue processing even if SMS fails
            }

            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thank you for reaching out! We will get back to you soon.");
            
            log.info("Contact form processed successfully for: {}", contactForm.getFullName());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error processing contact form submission: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(createErrorResponse(
                "Sorry, there was an error processing your request. Please try again later."
            ));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("message", "Contact service is running");
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}