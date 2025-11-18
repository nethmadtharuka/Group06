package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.dto.MessageDTO;
import com.eventcraft.EventCraft.entity.Message;
import com.eventcraft.EventCraft.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@Valid @RequestBody MessageDTO messageDTO) {
        try {
            Message message = messageService.sendMessage(messageDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<Message>> getMessagesByChat(@PathVariable String chatId) {
        List<Message> messages = messageService.getMessagesByChat(chatId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<Message> getMessageById(@PathVariable String messageId) {
        Optional<Message> message = messageService.getMessageById(messageId);
        return message.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/chat/{chatId}/mark-seen/user/{userId}")
    public ResponseEntity<?> markMessagesAsSeen(
            @PathVariable String chatId,
            @PathVariable String userId) {
        try {
            messageService.markMessagesAsSeen(chatId, userId);
            return ResponseEntity.ok("Messages marked as seen");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/chat/{chatId}/unread-count/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUnreadMessageCount(
            @PathVariable String chatId,
            @PathVariable String userId) {
        try {
            long count = messageService.getUnreadMessageCount(chatId, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("chatId", chatId);
            response.put("userId", userId);
            response.put("unreadCount", count);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/chat/{chatId}/unread/user/{userId}")
    public ResponseEntity<List<Message>> getUnreadMessages(
            @PathVariable String chatId,
            @PathVariable String userId) {
        try {
            List<Message> messages = messageService.getUnreadMessages(chatId, userId);
            return ResponseEntity.ok(messages);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

