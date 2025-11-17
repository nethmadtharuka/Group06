package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.ChatDTO;
import com.eventcraft.EventCraft.entity.Chat;
import com.eventcraft.EventCraft.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<?> createOrGetChat(@Valid @RequestBody ChatDTO chatDTO) {
        try {
            Chat chat = chatService.createOrGetChat(chatDTO);
            return ResponseEntity.ok(chat);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> getChatById(@PathVariable String chatId) {
        Optional<Chat> chat = chatService.getChatById(chatId);
        return chat.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vendor/{vendorId}/user/{userId}")
    public ResponseEntity<Chat> getChatByVendorAndUser(
            @PathVariable String vendorId,
            @PathVariable String userId) {
        Optional<Chat> chat = chatService.getChatByVendorAndUser(vendorId, userId);
        return chat.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Chat>> getChatsByVendor(@PathVariable String vendorId) {
        List<Chat> chats = chatService.getChatsByVendor(vendorId);
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Chat>> getChatsByUser(@PathVariable String userId) {
        List<Chat> chats = chatService.getChatsByUser(userId);
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/vendor/{vendorId1}/vendor/{vendorId2}")
    public ResponseEntity<Chat> getChatByVendors(
            @PathVariable String vendorId1,
            @PathVariable String vendorId2) {
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setVendorId(vendorId1);
        chatDTO.setVendor2Id(vendorId2);
        try {
            Chat chat = chatService.createOrGetChat(chatDTO);
            return ResponseEntity.ok(chat);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/support/user/{userId}")
    public ResponseEntity<Chat> getEventCraftSupportChatForUser(@PathVariable String userId) {
        try {
            Chat chat = chatService.getOrCreateEventCraftSupportChat(userId);
            return ResponseEntity.ok(chat);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/support/vendor/{vendorId}")
    public ResponseEntity<Chat> getEventCraftSupportChatForVendor(@PathVariable String vendorId) {
        try {
            Chat chat = chatService.getOrCreateEventCraftSupportChatForVendor(vendorId);
            return ResponseEntity.ok(chat);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

