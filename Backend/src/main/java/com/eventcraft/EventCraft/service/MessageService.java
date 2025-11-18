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
        boolean isVendorToVendor = chat.getVendor2() != null;
        boolean isSystemChat = chat.getIsSystemChat() != null && chat.getIsSystemChat();
        
        // For system chats, allow more flexible validation
        if (!isSystemChat) {
            if (senderType == Message.SenderType.VENDOR) {
                // For vendor-to-vendor chats, sender can be either vendor
                if (isVendorToVendor) {
                    boolean isVendor1 = chat.getVendor() != null && chat.getVendor().getId().equals(messageDTO.getSenderId());
                    boolean isVendor2 = chat.getVendor2() != null && chat.getVendor2().getId().equals(messageDTO.getSenderId());
                    if (!isVendor1 && !isVendor2) {
                        throw new RuntimeException("Sender ID does not match either vendor in this chat");
                    }
                } else {
                    // Vendor-to-user chat
                    if (chat.getVendor() == null || !chat.getVendor().getId().equals(messageDTO.getSenderId())) {
                        throw new RuntimeException("Sender ID does not match the vendor in this chat");
                    }
                }
            } else if (senderType == Message.SenderType.USER) {
                // User can only send in vendor-to-user chats
                if (isVendorToVendor) {
                    throw new RuntimeException("Users cannot send messages in vendor-to-vendor chats");
                }
                if (chat.getUser() == null || !chat.getUser().getId().equals(messageDTO.getSenderId())) {
                    throw new RuntimeException("Sender ID does not match the user in this chat");
                }
            }
        } else {
            // System chat validation - allow admin to respond
            // For system chats, we allow the admin vendor or the user/vendor who initiated the chat
            if (senderType == Message.SenderType.VENDOR) {
                boolean isValidVendor = false;
                if (chat.getVendor() != null && chat.getVendor().getId().equals(messageDTO.getSenderId())) {
                    isValidVendor = true;
                }
                if (chat.getVendor2() != null && chat.getVendor2().getId().equals(messageDTO.getSenderId())) {
                    isValidVendor = true;
                }
                if (!isValidVendor) {
                    throw new RuntimeException("Sender ID does not match any vendor in this system chat");
                }
            } else if (senderType == Message.SenderType.USER) {
                if (chat.getUser() == null || !chat.getUser().getId().equals(messageDTO.getSenderId())) {
                    throw new RuntimeException("Sender ID does not match the user in this system chat");
                }
            }
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

        // Send automated reply if message is sent TO a vendor (not FROM a vendor)
        // Only for vendor-to-user chats, and only if user sent the message
        if (!isVendorToVendor && senderType == Message.SenderType.USER && chat.getVendor() != null) {
            sendAutomatedReply(chat, messageDTO.getSenderId());
        }

        return savedMessage;
    }

    private void sendAutomatedReply(Chat chat, String userSenderId) {
        try {
            // Create automated reply message
            String automatedMessage = "Thank you for your message. We will contact you soon.";
            String vendorId = chat.getVendor().getId();
            
            Message automatedReply = Message.builder()
                    .chat(chat)
                    .senderId(vendorId)
                    .senderType(Message.SenderType.VENDOR)
                    .content(automatedMessage)
                    .status(Message.MessageStatus.SENT)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            messageRepository.save(automatedReply);
            
            // Update chat's last message
            chatService.updateChatLastMessage(chat.getId(), automatedMessage);
        } catch (Exception e) {
            // Log error but don't fail the original message send
            System.err.println("Failed to send automated reply: " + e.getMessage());
        }
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
        boolean isVendor1 = chat.getVendor() != null && chat.getVendor().getId().equals(userId);
        boolean isVendor2 = chat.getVendor2() != null && chat.getVendor2().getId().equals(userId);
        boolean isUser = chat.getUser() != null && chat.getUser().getId().equals(userId);

        if (!isVendor1 && !isVendor2 && !isUser) {
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

