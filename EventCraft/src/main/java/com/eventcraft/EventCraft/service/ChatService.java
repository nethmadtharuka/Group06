package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.ChatDTO;
import com.eventcraft.EventCraft.entity.Chat;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.repository.ChatRepository;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
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

    public Chat createOrGetChat(ChatDTO chatDTO) {
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
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return chatRepository.save(chat);
    }

    public Optional<Chat> getChatById(String chatId) {
        return chatRepository.findById(chatId);
    }

    public Optional<Chat> getChatByVendorAndUser(String vendorId, String userId) {
        return chatRepository.findByVendor_IdAndUser_Id(vendorId, userId);
    }

    public List<Chat> getChatsByVendor(String vendorId) {
        return chatRepository.findByVendor_Id(vendorId);
    }

    public List<Chat> getChatsByUser(String userId) {
        return chatRepository.findByUser_Id(userId);
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
}

