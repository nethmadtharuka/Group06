package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        System.out.println("DEBUG: Creating user: " + user.getUsername() + " with email: " + user.getEmail());
        System.out.println("DEBUG: Original password length: " + user.getPassword().length());

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        System.out.println("DEBUG: Hashed password length: " + hashedPassword.length());

        user.setPassword(hashedPassword);
        User savedUser = userRepository.save(user);

        System.out.println("DEBUG: User saved with ID: " + savedUser.getId());
        return savedUser;
    }

    public Optional<User> authenticateUser(String usernameOrEmail, String rawPassword) {
        System.out.println("DEBUG: Attempting to authenticate user: " + usernameOrEmail);

        // Find user by username or email
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            System.out.println("DEBUG: User not found by username, trying email...");
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }

        if (userOpt.isEmpty()) {
            System.out.println("DEBUG: User not found by username or email");
            return Optional.empty();
        }

        User user = userOpt.get();
        System.out.println("DEBUG: Found user: " + user.getUsername() + " (ID: " + user.getId() + ")");
        System.out.println("DEBUG: Raw password length: " + rawPassword.length());
        System.out.println("DEBUG: Stored password hash length: " + user.getPassword().length());

        // Verify password if user found
        boolean passwordMatches = passwordEncoder.matches(rawPassword, user.getPassword());
        System.out.println("DEBUG: Password matches: " + passwordMatches);

        if (passwordMatches) {
            return userOpt;
        }

        return Optional.empty();
    }

    public boolean resetPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        System.out.println("DEBUG: Password reset successful for user: " + email);
        return true;
    }

    public User updateUser(String id, User user) {
        user.setId(id);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
