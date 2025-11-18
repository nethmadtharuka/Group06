package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Repository integration tests for UserRepository
 * Uses Testcontainers to spin up a real MongoDB instance for testing
 */
@DataMongoTest
@Testcontainers
@DisplayName("UserRepository Integration Tests")
class UserRepositoryTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:7.0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        testUser = TestDataBuilder.buildTestUser();
    }

    @Test
    @DisplayName("Should save and find user by ID")
    void testSaveAndFindById() {
        User saved = userRepository.save(testUser);

        Optional<User> found = userRepository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals(testUser.getUsername(), found.get().getUsername());
        assertEquals(testUser.getEmail(), found.get().getEmail());
    }

    @Test
    @DisplayName("Should find user by username")
    void testFindByUsername() {
        userRepository.save(testUser);

        Optional<User> found = userRepository.findByUsername("testuser");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
    }

    @Test
    @DisplayName("Should find user by email")
    void testFindByEmail() {
        userRepository.save(testUser);

        Optional<User> found = userRepository.findByEmail("test@example.com");

        assertTrue(found.isPresent());
        assertEquals("test@example.com", found.get().getEmail());
    }

    @Test
    @DisplayName("Should check if username exists")
    void testExistsByUsername() {
        userRepository.save(testUser);

        assertTrue(userRepository.existsByUsername("testuser"));
        assertFalse(userRepository.existsByUsername("nonexistent"));
    }

    @Test
    @DisplayName("Should check if email exists")
    void testExistsByEmail() {
        userRepository.save(testUser);

        assertTrue(userRepository.existsByEmail("test@example.com"));
        assertFalse(userRepository.existsByEmail("nonexistent@example.com"));
    }

    @Test
    @DisplayName("Should find all users")
    void testFindAll() {
        User user1 = TestDataBuilder.buildTestUser();
        User user2 = TestDataBuilder.buildTestVendorUser();
        userRepository.save(user1);
        userRepository.save(user2);

        var users = userRepository.findAll();

        assertThat(users).hasSize(2);
    }

    @Test
    @DisplayName("Should delete user by ID")
    void testDeleteById() {
        User saved = userRepository.save(testUser);
        String id = saved.getId();

        userRepository.deleteById(id);

        Optional<User> found = userRepository.findById(id);
        assertFalse(found.isPresent());
    }

    @Test
    @DisplayName("Should not find non-existent user")
    void testFindNonExistentUser() {
        Optional<User> found = userRepository.findById("nonexistent-id");

        assertFalse(found.isPresent());
    }
}

