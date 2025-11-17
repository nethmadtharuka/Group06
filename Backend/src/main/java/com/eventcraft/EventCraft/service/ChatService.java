package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.ChatDTO;
import com.eventcraft.EventCraft.entity.Chat;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.repository.ChatRepository;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public Chat createOrGetChat(ChatDTO chatDTO) {
        // Determine if this is a vendor-to-vendor or vendor-to-user chat
        boolean isVendorToVendor = chatDTO.getVendor2Id() != null && !chatDTO.getVendor2Id().isEmpty();
        
        if (isVendorToVendor) {
            // Vendor-to-vendor chat
            if (chatDTO.getVendorId() == null || chatDTO.getVendor2Id() == null) {
                throw new RuntimeException("Both vendor IDs are required for vendor-to-vendor chat");
            }
            
            // Check if chat already exists (check both directions)
            Optional<Chat> existingChat = chatRepository.findByVendor_IdAndVendor2_Id(
                    chatDTO.getVendorId(), 
                    chatDTO.getVendor2Id()
            );
            
            if (existingChat.isEmpty()) {
                existingChat = chatRepository.findByVendor2_IdAndVendor_Id(
                        chatDTO.getVendorId(), 
                        chatDTO.getVendor2Id()
                );
            }
            
            if (existingChat.isPresent()) {
                return existingChat.get();
            }
            
            // Find both vendors
            Vendor vendor1 = vendorRepository.findById(chatDTO.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + chatDTO.getVendorId()));
            Vendor vendor2 = vendorRepository.findById(chatDTO.getVendor2Id())
                    .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + chatDTO.getVendor2Id()));
            
            // Create new vendor-to-vendor chat
            Chat chat = Chat.builder()
                    .vendor(vendor1)
                    .vendor2(vendor2)
                    .user(null)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            return chatRepository.save(chat);
        } else {
            // Vendor-to-user chat (existing logic)
            if (chatDTO.getVendorId() == null || chatDTO.getUserId() == null) {
                throw new RuntimeException("Vendor ID and User ID are required for vendor-to-user chat");
            }
            
            // Check if chat already exists
            Optional<Chat> existingChat = chatRepository.findByVendor_IdAndUser_Id(
                    chatDTO.getVendorId(), 
                    chatDTO.getUserId()
            );

            if (existingChat.isPresent()) {
                return existingChat.get();
            }

            // Find vendor and user
            Vendor vendor = vendorRepository.findById(chatDTO.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + chatDTO.getVendorId()));

            User user = userRepository.findById(chatDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + chatDTO.getUserId()));

            // Create new chat
            Chat chat = Chat.builder()
                    .vendor(vendor)
                    .user(user)
                    .vendor2(null)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            return chatRepository.save(chat);
        }
    }

    public Optional<Chat> getChatById(String chatId) {
        return chatRepository.findById(chatId);
    }

    public Optional<Chat> getChatByVendorAndUser(String vendorId, String userId) {
        return chatRepository.findByVendor_IdAndUser_Id(vendorId, userId);
    }

    public List<Chat> getChatsByVendor(String vendorId) {
        // Get chats where vendor is vendor1 or vendor2
        List<Chat> chatsAsVendor1 = chatRepository.findByVendor_Id(vendorId);
        List<Chat> chatsAsVendor2 = chatRepository.findByVendor2_Id(vendorId);
        
        // Combine and return
        chatsAsVendor1.addAll(chatsAsVendor2);
        
        // Ensure Event Craft Support chat exists and is included
        try {
            Chat supportChat = getOrCreateEventCraftSupportChatForVendor(vendorId);
            if (!chatsAsVendor1.stream().anyMatch(c -> c.getId().equals(supportChat.getId()))) {
                chatsAsVendor1.add(supportChat);
            }
        } catch (Exception e) {
            // Ignore if support chat creation fails
        }
        
        return chatsAsVendor1;
    }

    public List<Chat> getChatsByUser(String userId) {
        List<Chat> chats = chatRepository.findByUser_Id(userId);
        
        // Ensure Event Craft Support chat exists and is included
        try {
            Chat supportChat = getOrCreateEventCraftSupportChat(userId);
            if (!chats.stream().anyMatch(c -> c.getId().equals(supportChat.getId()))) {
                chats.add(supportChat);
            }
        } catch (Exception e) {
            // Ignore if support chat creation fails
        }
        
        return chats;
    }

    public void updateChatLastMessage(String chatId, String lastMessage) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isPresent()) {
            Chat chat = chatOpt.get();
            chat.setLastMessage(lastMessage);
            chat.setLastMessageAt(LocalDateTime.now());
            chat.setUpdatedAt(LocalDateTime.now());
            chatRepository.save(chat);
        }
    }

    /**
     * Get or create Event Craft admin support chat for a user
     * This chat is pinned and appears at the top for all users
     */
    public Chat getOrCreateEventCraftSupportChat(String userId) {
        // Check if system chat already exists for this user
        Optional<Chat> existingChat = chatRepository.findByUser_IdAndIsSystemChatTrue(userId);
        if (existingChat.isPresent()) {
            return existingChat.get();
        }

        // Find or create Event Craft Support vendor (special vendor for admin support)
        Vendor eventCraftSupport = vendorRepository.findByCompanyName("Event Craft Support")
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    // Find or create admin user first
                    User adminUser = userRepository.findByRole(User.Role.ADMIN)
                            .stream()
                            .findFirst()
                            .orElseGet(() -> {
                                // Generate secure password for system support account
                                String securePassword = passwordEncoder.encode("EventCraftSupport2024!");
                                User defaultAdmin = User.builder()
                                        .username("eventcraft_support")
                                        .email("support@eventcraft.com")
                                        .fullName("Event Craft Support")
                                        .role(User.Role.ADMIN)
                                        .password(securePassword)
                                        .createdAt(LocalDateTime.now())
                                        .updatedAt(LocalDateTime.now())
                                        .build();
                                return userRepository.save(defaultAdmin);
                            });
                    
                    // Create Event Craft Support vendor
                    Vendor supportVendor = Vendor.builder()
                            .user(adminUser)
                            .companyName("Event Craft Support")
                            .serviceType("Customer Support")
                            .address("Online")
                            .approvalStatus(Vendor.ApprovalStatus.APPROVED)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    return vendorRepository.save(supportVendor);
                });

        // Get the user requesting the chat
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Create system chat with Event Craft Support vendor
        Chat systemChat = Chat.builder()
                .vendor(eventCraftSupport)
                .vendor2(null)
                .user(user)
                .isPinned(true)
                .isSystemChat(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .lastMessage("Welcome to Event Craft Support! How can we help you today?")
                .lastMessageAt(LocalDateTime.now())
                .build();

        return chatRepository.save(systemChat);
    }

    /**
     * Get or create Event Craft admin support chat for a vendor
     */
    public Chat getOrCreateEventCraftSupportChatForVendor(String vendorId) {
        // Check if system chat already exists for this vendor
        Optional<Chat> existingChat = chatRepository.findByVendor_IdAndIsSystemChatTrue(vendorId);
        if (existingChat.isPresent()) {
            return existingChat.get();
        }

        // Find or create Event Craft Support vendor
        Vendor eventCraftSupport = vendorRepository.findByCompanyName("Event Craft Support")
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    User adminUser = userRepository.findByRole(User.Role.ADMIN)
                            .stream()
                            .findFirst()
                            .orElseGet(() -> {
                                // Generate secure password for system support account
                                String securePassword = passwordEncoder.encode("EventCraftSupport2024!");
                                User defaultAdmin = User.builder()
                                        .username("eventcraft_support")
                                        .email("support@eventcraft.com")
                                        .fullName("Event Craft Support")
                                        .role(User.Role.ADMIN)
                                        .password(securePassword)
                                        .createdAt(LocalDateTime.now())
                                        .updatedAt(LocalDateTime.now())
                                        .build();
                                return userRepository.save(defaultAdmin);
                            });
                    
                    Vendor supportVendor = Vendor.builder()
                            .user(adminUser)
                            .companyName("Event Craft Support")
                            .serviceType("Customer Support")
                            .address("Online")
                            .approvalStatus(Vendor.ApprovalStatus.APPROVED)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    return vendorRepository.save(supportVendor);
                });

        // Get the vendor requesting the chat
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));

        // Create vendor-to-vendor system chat
        Chat systemChat = Chat.builder()
                .vendor(vendor)
                .vendor2(eventCraftSupport)
                .user(null)
                .isPinned(true)
                .isSystemChat(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .lastMessage("Welcome to Event Craft Support! How can we help you today?")
                .lastMessageAt(LocalDateTime.now())
                .build();

        return chatRepository.save(systemChat);
    }
}

