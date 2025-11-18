package com.eventcraft.EventCraft.util;

import com.eventcraft.EventCraft.entity.*;
import com.eventcraft.EventCraft.dto.VendorRegDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Utility class for building test data objects
 * Helps create consistent test data across all test suites
 */
public class TestDataBuilder {

    public static User buildTestUser() {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .fullName("Test User")
                .phone("1234567890")
                .role(User.Role.CUSTOMER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static User buildTestVendorUser() {
        return User.builder()
                .username("vendoruser")
                .email("vendor@example.com")
                .password("password123")
                .fullName("Vendor User")
                .phone("1234567890")
                .role(User.Role.VENDOR)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Event buildTestEvent(User user) {
        return Event.builder()
                .user(user)
                .name("Test Event")
                .description("Test Event Description")
                .startDate(LocalDate.now().plusDays(7))
                .endDate(LocalDate.now().plusDays(7))
                .location("Test Location")
                .budget(1000.0)
                .status(Event.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Vendor buildTestVendor(User user) {
        return Vendor.builder()
                .user(user)
                .companyName("Test Company")
                .serviceType("Catering")
                .address("123 Test St")
                .mainPhotoURL("http://example.com/photo.jpg")
                .detailPhotoURL("http://example.com/detail.jpg")
                .details("Test vendor details")
                .rating(4.5)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static VendorRegDTO buildVendorRegDTO() {
        VendorRegDTO dto = new VendorRegDTO();
        dto.setCompanyName("Test Company");
        dto.setServiceType("Catering");
        dto.setAddress("123 Test St");
        dto.setMainPhotoURL("http://example.com/photo.jpg");
        dto.setDetailPhotoURL("http://example.com/detail.jpg");
        dto.setDetails("Test vendor details");
        return dto;
    }

    public static Contract buildTestContract(Event event, Vendor vendor) {
        return Contract.builder()
                .event(event)
                .vendor(vendor)
                .contractText("Test contract text")
                .signed(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Review buildTestReview(Vendor vendor, User user) {
        return Review.builder()
                .vendor(vendor)
                .user(user)
                .rating(5)
                .comment("Great service!")
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static VendorPackage buildTestVendorPackage(Vendor vendor) {
        return VendorPackage.builder()
                .vendor(vendor)
                .packageName("Basic Package")
                .description("Basic package description")
                .price(500.0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Chat buildTestChat(User user, Vendor vendor) {
        return Chat.builder()
                .user(user)
                .vendor(vendor)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static Message buildTestMessage(Chat chat, String senderId, Message.SenderType senderType) {
        return Message.builder()
                .chat(chat)
                .senderId(senderId)
                .senderType(senderType)
                .content("Test message")
                .status(Message.MessageStatus.SENT)
                .createdAt(LocalDateTime.now())
                .build();
    }
}

