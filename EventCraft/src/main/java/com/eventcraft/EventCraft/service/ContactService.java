package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.ContactFormDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final EmailService emailService;
    private final SMSService smsService;

    public void processContactForm(ContactFormDTO contactForm) {
        try {
            System.out.println("Processing contact form submission from: " + contactForm.getFullName());
            
            // Send email notification
            emailService.sendContactFormNotification(
                contactForm.getFullName(),
                contactForm.getEmail(),
                contactForm.getSubject(),
                contactForm.getMessage()
            );
            
            // Send SMS notification
            smsService.sendContactFormNotification(
                contactForm.getFullName(),
                contactForm.getEmail(),
                contactForm.getMessage()
            );
            
            System.out.println("Contact form processed successfully for: " + contactForm.getFullName());
            
        } catch (Exception e) {
            System.err.println("Failed to process contact form submission from " + contactForm.getFullName() + ": " + e.getMessage());
            throw new RuntimeException("Failed to process contact form submission", e);
        }
    }
}
