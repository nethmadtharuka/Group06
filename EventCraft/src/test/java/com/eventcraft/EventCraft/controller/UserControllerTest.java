package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.LoginRequest;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.service.UserService;
import com.eventcraft.EventCraft.util.TestDataBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(UserController.class)
@DisplayName("UserController API Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = TestDataBuilder.buildTestUser();
        testUser.setId("test-user-id");
    }

    @Test
    @DisplayName("Should get all users")
    void testGetAllUsers() throws Exception {
        when(userService.getAllUsers()).thenReturn(Arrays.asList(testUser));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("testuser"))
                .andExpect(jsonPath("$[0].email").value("test@example.com"));

        verify(userService).getAllUsers();
    }

    @Test
    @DisplayName("Should get user by ID")
    void testGetUserById() throws Exception {
        when(userService.getUserById("test-user-id")).thenReturn(Optional.of(testUser));

        mockMvc.perform(get("/api/users/test-user-id"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.id").value("test-user-id"));

        verify(userService).getUserById("test-user-id");
    }

    @Test
    @DisplayName("Should return 404 for non-existent user")
    void testGetUserByIdNotFound() throws Exception {
        when(userService.getUserById("nonexistent")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/nonexistent"))
                .andExpect(status().isOk())
                .andExpect(content().string(""));

        verify(userService).getUserById("nonexistent");
    }

    @Test
    @DisplayName("Should register user successfully")
    void testRegisterUser() throws Exception {
        User newUser = TestDataBuilder.buildTestUser();
        User savedUser = TestDataBuilder.buildTestUser();
        savedUser.setId("new-user-id");

        when(userService.existsByUsername("testuser")).thenReturn(false);
        when(userService.existsByEmail("test@example.com")).thenReturn(false);
        when(userService.createUser(any(User.class))).thenReturn(savedUser);

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("new-user-id"))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).existsByUsername("testuser");
        verify(userService).existsByEmail("test@example.com");
        verify(userService).createUser(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration with missing fields")
    void testRegisterUserMissingFields() throws Exception {
        User invalidUser = new User();
        invalidUser.setUsername("testuser");
        // Missing email and password

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Missing required fields"));

        verify(userService, never()).createUser(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration with duplicate username")
    void testRegisterUserDuplicateUsername() throws Exception {
        User newUser = TestDataBuilder.buildTestUser();
        when(userService.existsByUsername("testuser")).thenReturn(true);

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username already exists"));

        verify(userService).existsByUsername("testuser");
        verify(userService, never()).createUser(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration with duplicate email")
    void testRegisterUserDuplicateEmail() throws Exception {
        User newUser = TestDataBuilder.buildTestUser();
        when(userService.existsByUsername("testuser")).thenReturn(false);
        when(userService.existsByEmail("test@example.com")).thenReturn(true);

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email already exists"));

        verify(userService).existsByEmail("test@example.com");
        verify(userService, never()).createUser(any(User.class));
    }

    @Test
    @DisplayName("Should login user successfully")
    void testLoginUser() throws Exception {
        User authenticatedUser = TestDataBuilder.buildTestUser();
        authenticatedUser.setId("test-user-id");
        authenticatedUser.setPassword(null); // Password removed for response

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setLoginIdentifier("testuser");
        loginRequest.setPassword("password123");

        when(userService.authenticateUser("testuser", "password123"))
                .thenReturn(Optional.of(authenticatedUser));

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(userService).authenticateUser("testuser", "password123");
    }

    @Test
    @DisplayName("Should reject login with invalid credentials")
    void testLoginUserInvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setLoginIdentifier("testuser");
        loginRequest.setPassword("wrongpassword");

        when(userService.authenticateUser("testuser", "wrongpassword"))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));

        verify(userService).authenticateUser("testuser", "wrongpassword");
    }

    @Test
    @DisplayName("Should reject login with missing credentials")
    void testLoginUserMissingCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setLoginIdentifier("testuser");
        // Missing password

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Missing username/email or password"));

        verify(userService, never()).authenticateUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should delete user")
    void testDeleteUser() throws Exception {
        doNothing().when(userService).deleteUser("test-user-id");

        mockMvc.perform(delete("/api/users/test-user-id"))
                .andExpect(status().isOk());

        verify(userService).deleteUser("test-user-id");
    }
}

