package com.eventcraft.EventCraft.repository;

import com.eventcraft.EventCraft.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByChat_IdOrderByCreatedAtAsc(String chatId);
    List<Message> findByChat_IdAndStatus(String chatId, Message.MessageStatus status);
    List<Message> findByChat_IdAndSenderIdNot(String chatId, String senderId);
}

