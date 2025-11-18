package com.eventcraft.EventCraft.integration;

import com.eventcraft.EventCraft.dto.LoginRequest;
import com.eventcraft.EventCraft.entity.*;
import com.eventcraft.EventCraft.repository.*;
import com.eventcraft.EventCraft.util.TestDataBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-End Flow Automation Tests
 * Tests complete user journeys and business flows
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@DisplayName("End-to-End Flow Automation Tests")
class EndToEndFlowTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:7.0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Clean up test data
        contractRepository.deleteAll();
        reviewRepository.deleteAll();
        eventRepository.deleteAll();
        vendorRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Complete User Registration and Event Creation Flow")
    void testUserRegistrationAndEventCreationFlow() throws Exception {
        // Step 1: Register a new user
        User newUser = TestDataBuilder.buildTestUser();
        String userJson = objectMapper.writeValueAsString(newUser);

        String userResponse = mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        User createdUser = objectMapper.readValue(userResponse, User.class);
        String userId = createdUser.getId();
        assertThat(userId).isNotNull();

        // Step 2: Login with the created user
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setLoginIdentifier("testuser");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));

        // Step 3: Create an event for the user
        Event newEvent = TestDataBuilder.buildTestEvent(createdUser);
        String eventJson = objectMapper.writeValueAsString(newEvent);

        String eventResponse = mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Event"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Event createdEvent = objectMapper.readValue(eventResponse, Event.class);
        String eventId = createdEvent.getId();
        assertThat(eventId).isNotNull();

        // Step 4: Retrieve user's events
        mockMvc.perform(get("/api/events/user/" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(eventId))
                .andExpect(jsonPath("$[0].name").value("Test Event"));

        // Step 5: Get upcoming events
        mockMvc.perform(get("/api/events/user/" + userId + "/upcoming")
                        .param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(eventId));
    }

    @Test
    @DisplayName("Complete Vendor Registration and Package Creation Flow")
    void testVendorRegistrationFlow() throws Exception {
        // Step 1: Create a user
        User user = TestDataBuilder.buildTestUser();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);

        // Step 2: Register as vendor
        com.eventcraft.EventCraft.dto.VendorRegDTO vendorRegDTO = TestDataBuilder.buildVendorRegDTO();
        String vendorJson = objectMapper.writeValueAsString(vendorRegDTO);

        String vendorResponse = mockMvc.perform(post("/api/vendors/register/" + user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(vendorJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("Test Company"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        com.eventcraft.EventCraft.entity.Vendor createdVendor = objectMapper.readValue(
                vendorResponse, com.eventcraft.EventCraft.entity.Vendor.class);
        String vendorId = createdVendor.getId();
        assertThat(vendorId).isNotNull();

        // Step 3: Verify user role was updated
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertThat(updatedUser.getRole()).isEqualTo(User.Role.VENDOR);

        // Step 4: Get vendor details
        mockMvc.perform(get("/api/vendors/" + vendorId + "/details"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vendor.id").value(vendorId))
                .andExpect(jsonPath("$.vendor.companyName").value("Test Company"));
    }

    @Test
    @DisplayName("Complete Event-Vendor Contract Flow")
    void testEventVendorContractFlow() throws Exception {
        // Step 1: Create user and event
        User user = TestDataBuilder.buildTestUser();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);

        Event event = TestDataBuilder.buildTestEvent(user);
        event = eventRepository.save(event);

        // Step 2: Create vendor
        User vendorUser = TestDataBuilder.buildTestVendorUser();
        vendorUser.setPassword(passwordEncoder.encode(vendorUser.getPassword()));
        vendorUser.setRole(User.Role.VENDOR);
        vendorUser = userRepository.save(vendorUser);

        com.eventcraft.EventCraft.entity.Vendor vendor = TestDataBuilder.buildTestVendor(vendorUser);
        vendor = vendorRepository.save(vendor);

        // Step 3: Create contract
        Contract contract = TestDataBuilder.buildTestContract(event, vendor);
        contract.setContractText("Service contract for event");
        String contractJson = objectMapper.writeValueAsString(contract);

        String contractResponse = mockMvc.perform(post("/api/contracts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contractJson))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Contract createdContract = objectMapper.readValue(contractResponse, Contract.class);
        String contractId = createdContract.getId();
        assertThat(contractId).isNotNull();

        // Step 4: Get contract by ID
        mockMvc.perform(get("/api/contracts/" + contractId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(contractId))
                .andExpect(jsonPath("$.contractText").value("Service contract for event"));
    }

    @Test
    @DisplayName("Complete Review and Rating Flow")
    void testReviewAndRatingFlow() throws Exception {
        // Step 1: Create vendor
        User vendorUser = TestDataBuilder.buildTestVendorUser();
        vendorUser.setPassword(passwordEncoder.encode(vendorUser.getPassword()));
        vendorUser.setRole(User.Role.VENDOR);
        vendorUser = userRepository.save(vendorUser);

        com.eventcraft.EventCraft.entity.Vendor vendor = TestDataBuilder.buildTestVendor(vendorUser);
        vendor = vendorRepository.save(vendor);

        // Step 2: Create user who will review
        User reviewer = TestDataBuilder.buildTestUser();
        reviewer.setEmail("reviewer@example.com");
        reviewer.setUsername("reviewer");
        reviewer.setPassword(passwordEncoder.encode(reviewer.getPassword()));
        reviewer = userRepository.save(reviewer);

        // Step 3: Create review
        Review review = TestDataBuilder.buildTestReview(vendor, reviewer);
        review.setRating(5);
        review.setComment("Excellent service!");
        String reviewJson = objectMapper.writeValueAsString(review);

        String reviewResponse = mockMvc.perform(post("/api/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reviewJson))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Review createdReview = objectMapper.readValue(reviewResponse, Review.class);
        String reviewId = createdReview.getId();
        assertThat(reviewId).isNotNull();

        // Step 4: Get reviews for vendor
        mockMvc.perform(get("/api/reviews/vendor/" + vendor.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(reviewId))
                .andExpect(jsonPath("$[0].rating").value(5))
                .andExpect(jsonPath("$[0].comment").value("Excellent service!"));
    }

    @Test
    @DisplayName("Complete Calendar Query Flow")
    void testCalendarQueryFlow() throws Exception {
        // Step 1: Create user with multiple events
        User user = TestDataBuilder.buildTestUser();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);

        // Step 2: Create events with different dates
        Event event1 = TestDataBuilder.buildTestEvent(user);
        event1.setStartDate(LocalDate.now().plusDays(5));
        event1.setName("Event 1");
        eventRepository.save(event1);

        Event event2 = TestDataBuilder.buildTestEvent(user);
        event2.setStartDate(LocalDate.now().plusDays(15));
        event2.setName("Event 2");
        eventRepository.save(event2);

        Event event3 = TestDataBuilder.buildTestEvent(user);
        event3.setStartDate(LocalDate.now().plusDays(50));
        event3.setName("Event 3");
        eventRepository.save(event3);

        // Step 3: Query upcoming events
        mockMvc.perform(get("/api/events/user/" + user.getId() + "/upcoming")
                        .param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));

        // Step 4: Query events by date range
        LocalDate startDate = LocalDate.now().plusDays(1);
        LocalDate endDate = LocalDate.now().plusDays(30);

        mockMvc.perform(get("/api/events/user/" + user.getId() + "/date-range")
                        .param("startDate", startDate.toString())
                        .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2)); // Only event1 and event2
    }

    @Test
    @DisplayName("Complete User-Vendor Chat Flow")
    void testChatFlow() throws Exception {
        // Step 1: Create user and vendor
        User user = TestDataBuilder.buildTestUser();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);

        User vendorUser = TestDataBuilder.buildTestVendorUser();
        vendorUser.setPassword(passwordEncoder.encode(vendorUser.getPassword()));
        vendorUser.setRole(User.Role.VENDOR);
        vendorUser = userRepository.save(vendorUser);

        com.eventcraft.EventCraft.entity.Vendor vendor = TestDataBuilder.buildTestVendor(vendorUser);
        vendor = vendorRepository.save(vendor);

        // Step 2: Create chat
        Chat chat = TestDataBuilder.buildTestChat(user, vendor);
        String chatJson = objectMapper.writeValueAsString(chat);

        String chatResponse = mockMvc.perform(post("/api/chats")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(chatJson))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Chat createdChat = objectMapper.readValue(chatResponse, Chat.class);
        String chatId = createdChat.getId();
        assertThat(chatId).isNotNull();

        // Step 3: Send message
        Message message = TestDataBuilder.buildTestMessage(
                createdChat, user.getId(), Message.SenderType.USER);
        message.setContent("Hello, I'm interested in your services");
        String messageJson = objectMapper.writeValueAsString(message);

        mockMvc.perform(post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(messageJson))
                .andExpect(status().isOk());

        // Step 4: Get messages for chat
        mockMvc.perform(get("/api/messages/chat/" + chatId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}

