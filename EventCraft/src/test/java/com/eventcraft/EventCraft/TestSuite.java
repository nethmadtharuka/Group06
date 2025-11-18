package com.eventcraft.EventCraft;

import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

/**
 * Comprehensive Test Suite
 * Runs all test categories:
 * - Unit Tests (Service Layer)
 * - Repository Tests (Integration with MongoDB)
 * - Controller Tests (API Integration)
 * - End-to-End Flow Tests
 * - Security Tests
 */
@Suite
@SuiteDisplayName("EventCraft Complete Test Suite")
@SelectPackages({
    "com.eventcraft.EventCraft.service",
    "com.eventcraft.EventCraft.repository",
    "com.eventcraft.EventCraft.controller",
    "com.eventcraft.EventCraft.integration",
    "com.eventcraft.EventCraft.security"
})
public class TestSuite {
    // This class serves as a test suite runner
    // All tests in the selected packages will be executed
}

