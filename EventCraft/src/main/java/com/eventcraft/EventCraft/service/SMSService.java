package com.eventcraft.EventCraft.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@Slf4j
public class SMSService {
    
    @Value("${twilio.account.sid:your-twilio-account-sid}")
    private String accountSid;
    
    @Value("${twilio.auth.token:your-twilio-auth-token}")
    private String authToken;
    
    @Value("${twilio.from.number:+1234567890}")
    private String fromNumber;
    
    @Value("${sms.contact.number:+94774842458}")
    private String contactNumber;

    @PostConstruct
    public void init() {
        try {
            Twilio.init(accountSid, authToken);
            log.info("Twilio SMS service initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize Twilio SMS service: {}", e.getMessage());
        }
    }

    public void sendContactFormNotification(String fullName, String email, String message) {
        try {
            // Check if Twilio is properly configured
            if ("your-twilio-account-sid".equals(accountSid) || "your-twilio-auth-token".equals(authToken)) {
                log.warn("Twilio credentials not configured. SMS will not be sent. Please configure twilio.account.sid and twilio.auth.token in application.properties");
                return;
            }
            
            String smsMessage = String.format(
                "New contact form submission from %s (%s): %s",
                fullName,
                email,
                message.length() > 100 ? message.substring(0, 100) + "..." : message
            );
            
            // Send SMS using Twilio
            Message twilioMessage = Message.creator(
                new PhoneNumber(contactNumber),  // To
                new PhoneNumber(fromNumber),     // From
                smsMessage
            ).create();
            
            log.info("SMS sent successfully to {} with SID: {}", contactNumber, twilioMessage.getSid());
            
        } catch (Exception e) {
            log.error("Error sending SMS notification: {}", e.getMessage(), e);
            // Don't throw exception to prevent contact form submission failure
            // SMS is secondary to email notification
        }
    }
}