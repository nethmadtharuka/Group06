package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String usernameOrEmail, String rawPassword) {
        // Find user by username or email
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }

        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();

        // Verify password if user found
        boolean passwordMatches = passwordEncoder.matches(rawPassword, user.getPassword());

        if (passwordMatches) {
            return userOpt;
        }

        return Optional.empty();
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User updateUser(String userId, User updatedUser) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Update fields if provided
        if (updatedUser.getFullName() != null && !updatedUser.getFullName().isEmpty()) {
            existingUser.setFullName(updatedUser.getFullName());
        }
        if (updatedUser.getPhone() != null) {
            existingUser.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()) {
            // Check if email is already taken by another user
            Optional<User> userWithEmail = userRepository.findByEmail(updatedUser.getEmail());
            if (userWithEmail.isPresent() && !userWithEmail.get().getId().equals(userId)) {
                throw new RuntimeException("Email already exists");
            }
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getUsername() != null && !updatedUser.getUsername().isEmpty()) {
            // Check if username is already taken by another user
            Optional<User> userWithUsername = userRepository.findByUsername(updatedUser.getUsername());
            if (userWithUsername.isPresent() && !userWithUsername.get().getId().equals(userId)) {
                throw new RuntimeException("Username already exists");
            }
            existingUser.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            // Hash new password
            String hashedPassword = passwordEncoder.encode(updatedUser.getPassword());
            existingUser.setPassword(hashedPassword);
        }

        existingUser.setUpdatedAt(java.time.LocalDateTime.now());
        return userRepository.save(existingUser);
    }
}
