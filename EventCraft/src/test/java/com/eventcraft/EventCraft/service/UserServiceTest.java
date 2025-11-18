package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService
 * Tests all business logic for user management
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private PasswordEncoder encoder;

    @BeforeEach
    void setUp() {
        encoder = new BCryptPasswordEncoder();
        testUser = TestDataBuilder.buildTestUser();
        testUser.setId("test-user-id");
    }

    @Test
    @DisplayName("Should check if username exists")
    void testExistsByUsername() {
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        when(userRepository.existsByUsername("nonexistent")).thenReturn(false);

        assertTrue(userService.existsByUsername("testuser"));
        assertFalse(userService.existsByUsername("nonexistent"));
        verify(userRepository, times(2)).existsByUsername(anyString());
    }

    @Test
    @DisplayName("Should check if email exists")
    void testExistsByEmail() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        when(userRepository.existsByEmail("nonexistent@example.com")).thenReturn(false);

        assertTrue(userService.existsByEmail("test@example.com"));
        assertFalse(userService.existsByEmail("nonexistent@example.com"));
        verify(userRepository, times(2)).existsByEmail(anyString());
    }

    @Test
    @DisplayName("Should get all users")
    void testGetAllUsers() {
        List<User> users = Arrays.asList(testUser, TestDataBuilder.buildTestVendorUser());
        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getAllUsers();

        assertThat(result).hasSize(2);
        verify(userRepository).findAll();
    }

    @Test
    @DisplayName("Should get user by ID")
    void testGetUserById() {
        when(userRepository.findById("test-user-id")).thenReturn(Optional.of(testUser));
        when(userRepository.findById("nonexistent")).thenReturn(Optional.empty());

        Optional<User> found = userService.getUserById("test-user-id");
        Optional<User> notFound = userService.getUserById("nonexistent");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
        assertFalse(notFound.isPresent());
        verify(userRepository, times(2)).findById(anyString());
    }

    @Test
    @DisplayName("Should create user with hashed password")
    void testCreateUser() {
        User newUser = TestDataBuilder.buildTestUser();
        User savedUser = TestDataBuilder.buildTestUser();
        savedUser.setId("new-user-id");

        when(passwordEncoder.encode(anyString())).thenReturn("hashed-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.createUser(newUser);

        assertNotNull(result);
        assertEquals("new-user-id", result.getId());
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(userRepository).save(argThat(user -> user.getPassword().equals("hashed-password")));
    }

    @Test
    @DisplayName("Should authenticate user by username")
    void testAuthenticateUserByUsername() {
        User userWithHashedPassword = TestDataBuilder.buildTestUser();
        userWithHashedPassword.setId("test-user-id");
        userWithHashedPassword.setPassword(encoder.encode("password123"));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userWithHashedPassword));
        when(passwordEncoder.matches("password123", userWithHashedPassword.getPassword())).thenReturn(true);

        Optional<User> result = userService.authenticateUser("testuser", "password123");

        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        verify(userRepository).findByUsername("testuser");
        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    @DisplayName("Should authenticate user by email")
    void testAuthenticateUserByEmail() {
        User userWithHashedPassword = TestDataBuilder.buildTestUser();
        userWithHashedPassword.setId("test-user-id");
        userWithHashedPassword.setPassword(encoder.encode("password123"));

        when(userRepository.findByUsername("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(userWithHashedPassword));
        when(passwordEncoder.matches("password123", userWithHashedPassword.getPassword())).thenReturn(true);

        Optional<User> result = userService.authenticateUser("test@example.com", "password123");

        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
        verify(userRepository).findByUsername("test@example.com");
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("Should fail authentication with wrong password")
    void testAuthenticateUserWrongPassword() {
        User userWithHashedPassword = TestDataBuilder.buildTestUser();
        userWithHashedPassword.setPassword(encoder.encode("password123"));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userWithHashedPassword));
        when(passwordEncoder.matches("wrongpassword", userWithHashedPassword.getPassword())).thenReturn(false);

        Optional<User> result = userService.authenticateUser("testuser", "wrongpassword");

        assertFalse(result.isPresent());
        verify(passwordEncoder).matches("wrongpassword", userWithHashedPassword.getPassword());
    }

    @Test
    @DisplayName("Should fail authentication for non-existent user")
    void testAuthenticateUserNotFound() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("nonexistent")).thenReturn(Optional.empty());

        Optional<User> result = userService.authenticateUser("nonexistent", "password123");

        assertFalse(result.isPresent());
        verify(userRepository).findByUsername("nonexistent");
        verify(userRepository).findByEmail("nonexistent");
    }

    @Test
    @DisplayName("Should delete user by ID")
    void testDeleteUser() {
        doNothing().when(userRepository).deleteById("test-user-id");

        userService.deleteUser("test-user-id");

        verify(userRepository).deleteById("test-user-id");
    }
}

