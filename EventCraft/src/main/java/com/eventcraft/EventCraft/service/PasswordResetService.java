package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.PasswordResetToken;
import com.eventcraft.EventCraft.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    
    private static final int TOKEN_LENGTH = 32;
    private static final int EXPIRY_HOURS = 24;
    private static final String TOKEN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    public String generateResetToken(String email) {
        // Delete any existing tokens for this email
        tokenRepository.deleteByEmail(email);
        
        // Generate secure random token
        String token = generateSecureToken();
        
        // Create and save token
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .email(email)
                .expiryDate(LocalDateTime.now().plusHours(EXPIRY_HOURS))
                .used(false)
                .build();
        
        tokenRepository.save(resetToken);
        
        // Send email
        emailService.sendPasswordResetEmail(email, token);
        
        return token;
    }

    private String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder();
        
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            token.append(TOKEN_CHARS.charAt(random.nextInt(TOKEN_CHARS.length())));
        }
        
        return token.toString();
    }

    public boolean validateToken(String token) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findByToken(token);
        
        if (resetTokenOpt.isEmpty()) {
            return false;
        }
        
        PasswordResetToken resetToken = resetTokenOpt.get();
        
        return !resetToken.isExpired() && !resetToken.isUsed();
    }

    public Optional<String> getEmailByToken(String token) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findByToken(token);
        
        if (resetTokenOpt.isEmpty()) {
            return Optional.empty();
        }
        
        PasswordResetToken resetToken = resetTokenOpt.get();
        
        if (resetToken.isExpired() || resetToken.isUsed()) {
            return Optional.empty();
        }
        
        return Optional.of(resetToken.getEmail());
    }

    @Transactional
    public void markTokenAsUsed(String token) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findByToken(token);
        
        if (resetTokenOpt.isPresent()) {
            PasswordResetToken resetToken = resetTokenOpt.get();
            resetToken.setUsed(true);
            tokenRepository.save(resetToken);
        }
    }
    
    public void cleanupExpiredTokens() {
        // This method can be called periodically to clean up expired tokens
        // For now, we'll implement it as a simple method
        // In production, you might want to use @Scheduled annotation
        LocalDateTime now = LocalDateTime.now();
        tokenRepository.findAll().stream()
                .filter(token -> token.getExpiryDate().isBefore(now))
                .forEach(token -> tokenRepository.delete(token));
    }
}