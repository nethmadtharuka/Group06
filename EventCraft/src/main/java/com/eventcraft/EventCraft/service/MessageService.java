package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.MessageDTO;
import com.eventcraft.EventCraft.entity.Chat;
import com.eventcraft.EventCraft.entity.Message;
import com.eventcraft.EventCraft.repository.ChatRepository;
import com.eventcraft.EventCraft.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final ChatService chatService;

    public Message sendMessage(MessageDTO messageDTO) {
        // Find chat
        Chat chat = chatRepository.findById(messageDTO.getChatId())
                .orElseThrow(() -> new RuntimeException("Chat not found with id: " + messageDTO.getChatId()));

        // Validate sender type
        Message.SenderType senderType;
        try {
            senderType = Message.SenderType.valueOf(messageDTO.getSenderType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid sender type. Must be VENDOR or USER");
        }

        // Validate sender ID matches chat participants
        if (senderType == Message.SenderType.VENDOR && !chat.getVendor().getId().equals(messageDTO.getSenderId())) {
            throw new RuntimeException("Sender ID does not match the vendor in this chat");
        }
        if (senderType == Message.SenderType.USER && !chat.getUser().getId().equals(messageDTO.getSenderId())) {
            throw new RuntimeException("Sender ID does not match the user in this chat");
        }

        // Create message
        Message message = Message.builder()
                .chat(chat)
                .senderId(messageDTO.getSenderId())
                .senderType(senderType)
                .content(messageDTO.getContent())
                .status(Message.MessageStatus.SENT)
                .createdAt(LocalDateTime.now())
                .build();

        Message savedMessage = messageRepository.save(message);

        // Update chat's last message
        String lastMessagePreview = messageDTO.getContent().length() > 50 
                ? messageDTO.getContent().substring(0, 50) + "..." 
                : messageDTO.getContent();
        chatService.updateChatLastMessage(messageDTO.getChatId(), lastMessagePreview);

        return savedMessage;
    }

    public List<Message> getMessagesByChat(String chatId) {
        return messageRepository.findByChat_IdOrderByCreatedAtAsc(chatId);
    }

    public Optional<Message> getMessageById(String messageId) {
        return messageRepository.findById(messageId);
    }

    public void markMessagesAsSeen(String chatId, String userId) {
        // Get all unread messages in the chat that were not sent by this user
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found with id: " + chatId));

        // Determine if userId is vendor or user
        boolean isVendor = chat.getVendor().getId().equals(userId);
        boolean isUser = chat.getUser().getId().equals(userId);

        if (!isVendor && !isUser) {
            throw new RuntimeException("User is not a participant in this chat");
        }

        // Get all messages in chat
        List<Message> messages = messageRepository.findByChat_IdOrderByCreatedAtAsc(chatId);

        // Mark messages as seen if they were sent by the other participant
        for (Message message : messages) {
            if (!message.getSenderId().equals(userId) && 
                message.getStatus() != Message.MessageStatus.SEEN) {
                message.setStatus(Message.MessageStatus.SEEN);
                messageRepository.save(message);
            }
        }
    }

    public long getUnreadMessageCount(String chatId, String userId) {
        // Verify chat exists
        chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found with id: " + chatId));

        List<Message> unreadMessages = getUnreadMessages(chatId, userId);
        return unreadMessages.size();
    }

    public List<Message> getUnreadMessages(String chatId, String userId) {
        // Verify chat exists
        chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found with id: " + chatId));

        List<Message> allMessages = messageRepository.findByChat_IdOrderByCreatedAtAsc(chatId);
        return allMessages.stream()
                .filter(message -> !message.getSenderId().equals(userId) && 
                                  message.getStatus() != Message.MessageStatus.SEEN)
                .collect(Collectors.toList());
    }
}

