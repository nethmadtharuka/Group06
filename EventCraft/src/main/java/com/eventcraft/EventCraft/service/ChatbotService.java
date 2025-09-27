package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.entity.ChatbotConversation;
import com.eventcraft.EventCraft.repository.ChatbotConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatbotConversationRepository chatbotRepository;

    public List<ChatbotConversation> getAllConversations() {
        return chatbotRepository.findAll();
    }

    public Optional<ChatbotConversation> getConversationById(String id) {
        return chatbotRepository.findById(id);
    }

    public ChatbotConversation createConversation(ChatbotConversation conversation) {
        return chatbotRepository.save(conversation);
    }

    public void deleteConversation(String id) {
        chatbotRepository.deleteById(id);
    }
}
