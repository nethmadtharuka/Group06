package com.eventcraft.EventCraft.controller;

import com.eventcraft.EventCraft.entity.ChatbotConversation;
import com.eventcraft.EventCraft.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @GetMapping
    public List<ChatbotConversation> getAllConversations() {
        return chatbotService.getAllConversations();
    }

    @GetMapping("/{id}")
    public Optional<ChatbotConversation> getConversationById(@PathVariable String id) {
        return chatbotService.getConversationById(id);
    }

    @PostMapping
    public ChatbotConversation createConversation(@RequestBody ChatbotConversation conversation) {
        return chatbotService.createConversation(conversation);
    }

    @DeleteMapping("/{id}")
    public void deleteConversation(@PathVariable String id) {
        chatbotService.deleteConversation(id);
    }
}
