package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.ChatbotConversation;
import com.eventcraft.EventCraft.entity.Event;
import com.eventcraft.EventCraft.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatbotConversationRepository extends MongoRepository<ChatbotConversation, String> {

    List<ChatbotConversation> findByUser(User user);

    List<ChatbotConversation> findByEvent(Event event);
}
