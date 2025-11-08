package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.ProfileUpdateRequest;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    
    // Directory for storing uploaded profile pictures
    private final String UPLOAD_DIR = "uploads/profile-pictures/";

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

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User updateUser(String id, User user) {
        user.setId(id);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> updateProfile(String userId, ProfileUpdateRequest profileRequest) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();
        
        // Update profile fields
        if (profileRequest.getFullName() != null) {
            user.setFullName(profileRequest.getFullName());
        }
        if (profileRequest.getPhone() != null) {
            user.setPhone(profileRequest.getPhone());
        }
        if (profileRequest.getBio() != null) {
            user.setBio(profileRequest.getBio());
        }
        if (profileRequest.getAddress() != null) {
            user.setAddress(profileRequest.getAddress());
        }
        if (profileRequest.getDateOfBirth() != null) {
            user.setDateOfBirth(profileRequest.getDateOfBirth());
        }
        if (profileRequest.getEmail() != null && !profileRequest.getEmail().equals(user.getEmail())) {
            // Check if new email already exists
            if (existsByEmail(profileRequest.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(profileRequest.getEmail());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        return Optional.of(userRepository.save(user));
    }

    public Optional<String> uploadProfilePicture(String userId, MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("File must be an image");
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : ".jpg";
            String filename = userId + "_" + UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // Update user's profile picture path
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Delete old profile picture if exists
                if (user.getProfilePicture() != null && !user.getProfilePicture().isEmpty()) {
                    try {
                        Path oldFile = Paths.get(user.getProfilePicture());
                        Files.deleteIfExists(oldFile);
                    } catch (Exception e) {
                        System.err.println("Could not delete old profile picture: " + e.getMessage());
                    }
                }
                
                user.setProfilePicture(filePath.toString());
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
                
                return Optional.of(filePath.toString());
            }
            
            return Optional.empty();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    public boolean deleteProfilePicture(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getProfilePicture() != null && !user.getProfilePicture().isEmpty()) {
                try {
                    Path filePath = Paths.get(user.getProfilePicture());
                    Files.deleteIfExists(filePath);
                    
                    user.setProfilePicture(null);
                    user.setUpdatedAt(LocalDateTime.now());
                    userRepository.save(user);
                    
                    return true;
                } catch (IOException e) {
                    System.err.println("Could not delete profile picture: " + e.getMessage());
                    return false;
                }
            }
        }
        return false;
    }
}
