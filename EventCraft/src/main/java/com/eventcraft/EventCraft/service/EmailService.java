package com.eventcraft.EventCraft.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.from:noreply@eventcraft.com}")
    private String fromEmail;
    
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset - EventCraft");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            String emailBody = "Hello,\n\n" +
                    "You requested a password reset for your EventCraft account.\n\n" +
                    "Click the link below to reset your password:\n" +
                    resetUrl + "\n\n" +
                    "This link will expire in 24 hours.\n\n" +
                    "If you didn't request this password reset, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "EventCraft Team";
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
}