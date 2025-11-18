import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchIcon, MoreVerticalIcon, SendIcon, CheckIcon, CheckCircle2, PaperclipIcon, SmileIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { chatAPI, messageAPI } from '../services/api';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderType: 'USER' | 'VENDOR';
  createdAt: string;
  status?: 'SENT' | 'SEEN';
}

interface Chat {
  id: string;
  vendor?: {
    id: string;
    companyName: string;
    serviceType: string;
    user?: {
      id: string;
      fullName: string;
      username: string;
      email: string;
    };
  };
  vendor2?: {
    id: string;
    companyName: string;
    serviceType: string;
    user?: {
      id: string;
      fullName: string;
      username: string;
      email: string;
    };
  };
  user?: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  isPinned?: boolean;
  isSystemChat?: boolean;
}

export const Messages = () => {
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [myVendorId, setMyVendorId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  // Get vendor ID if user is a vendor
  const getVendorId = async (): Promise<string | null> => {
    if (userRole === 'VENDOR' && userId) {
      try {
        const { vendorAPI } = await import('../services/api');
        const vendor = await vendorAPI.getVendorByUserId(userId);
        if (vendor && (vendor as any).id) {
          const vendorId = (vendor as any).id;
          setMyVendorId(vendorId); // Store in state
          return vendorId;
        }
      } catch (error) {
        console.error('Error getting vendor ID:', error);
      }
    }
    return null;
  };

  // Load vendor ID on mount
  useEffect(() => {
    if (userRole === 'VENDOR' && userId) {
      getVendorId();
    }
  }, [userRole, userId]);

  // Load unread counts for all conversations
  useEffect(() => {
    const loadUnreadCounts = async () => {
      if (!userId || conversations.length === 0) return;
      
      const idToUse = userRole === 'VENDOR' ? await getVendorId() : userId;
      if (!idToUse) return;
      
      const counts: Record<string, number> = {};
      for (const conversation of conversations) {
        try {
          const result = await messageAPI.getUnreadMessageCount(conversation.id, idToUse);
          counts[conversation.id] = (result as any).unreadCount || 0;
        } catch (error) {
          console.error(`Error loading unread count for chat ${conversation.id}:`, error);
          counts[conversation.id] = 0;
        }
      }
      setUnreadCounts(counts);
    };
    
    loadUnreadCounts();
    const interval = setInterval(loadUnreadCounts, 5000);
    return () => clearInterval(interval);
  }, [conversations, userId, userRole]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (userId) {
        try {
          let chats: Chat[] = [];
          
          if (userRole === 'VENDOR') {
            const vendorId = await getVendorId();
            if (vendorId) {
              chats = (await chatAPI.getChatsByVendor(vendorId)) as Chat[];
            }
          } else {
            chats = (await chatAPI.getChatsByUser(userId)) as Chat[];
          }
          
          // Sort chats: pinned/system chats first, then by lastMessageAt (most recent first)
          chats = (chats || []).sort((a, b) => {
            // Pinned/system chats always come first
            const aIsPinned = a.isPinned || a.isSystemChat;
            const bIsPinned = b.isPinned || b.isSystemChat;
            if (aIsPinned && !bIsPinned) return -1;
            if (!aIsPinned && bIsPinned) return 1;
            
            // Within same pinned status, sort by lastMessageAt
            const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.createdAt).getTime();
            const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
          
          setConversations(chats);
          
          // Check if there's a chatId in location state (from Request a Quote)
          const chatIdFromState = (location.state as any)?.chatId;
          if (chatIdFromState) {
            const chatExists = chats.some((c) => c.id === chatIdFromState);
            if (chatExists) {
              setSelectedConversation(chatIdFromState);
            } else {
              try {
                const newChat = (await chatAPI.getChatById(chatIdFromState)) as Chat;
                if (newChat && newChat.id) {
                  setConversations([newChat, ...chats]);
                  setSelectedConversation(chatIdFromState);
                }
              } catch (error) {
                console.error('Error loading new chat:', error);
                setSelectedConversation(chatIdFromState);
              }
            }
            window.history.replaceState({}, document.title);
          } else if (chats && chats.length > 0 && !selectedConversation) {
            setSelectedConversation(chats[0].id);
          }
        } catch (error) {
          console.error('Error loading conversations:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadConversations();
  }, [userId, location.state, userRole]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load messages for selected conversation
  useEffect(() => {
    // Clear messages when conversation changes
    setMessages([]);
    setMessagesLoading(false);
    
    if (!selectedConversation || !userId) {
      return;
    }
    
    const loadMessages = async (isInitialLoad = false) => {
      if (selectedConversation && userId) {
        if (isInitialLoad) {
          setMessagesLoading(true);
        }
        try {
          const idToUse = userRole === 'VENDOR' ? await getVendorId() : userId;
          if (!idToUse) return;
          
          const chatMessages = (await messageAPI.getMessagesByChat(selectedConversation)) as Message[];
          setMessages(chatMessages || []);
          
          // Mark messages as seen when viewing (this returns plain text, not JSON)
          try {
            await messageAPI.markMessagesAsSeen(selectedConversation, idToUse);
          } catch (error) {
            // Ignore errors for mark as seen - it's not critical
            console.log('Note: Could not mark messages as seen');
          }
          
          // Update unread count
          try {
            const result = await messageAPI.getUnreadMessageCount(selectedConversation, idToUse);
            setUnreadCounts(prev => ({
              ...prev,
              [selectedConversation]: (result as any).unreadCount || 0
            }));
          } catch (error) {
            console.error('Error updating unread count:', error);
          }
        } catch (error) {
          console.error('Error loading messages:', error);
        } finally {
          if (isInitialLoad) {
            setMessagesLoading(false);
          }
        }
      }
    };
    
    // Initial load with loading state
    loadMessages(true);
    
    // Set up polling to refresh messages every 2 seconds (without loading state)
    const interval = setInterval(() => {
      if (selectedConversation) {
        loadMessages(false);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [selectedConversation, userId, userRole]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !userId || sending) return;

    setSending(true);
    try {
      let senderId = userId;
      
      if (userRole === 'VENDOR') {
        // For vendors, we must use the vendor entity ID from the chat
        // Get the current chat to ensure we use the correct vendor ID
        const currentChat = conversations.find((c) => c.id === selectedConversation);
        if (currentChat) {
          const isVendorToVendor = currentChat.vendor2 != null;
          if (isVendorToVendor) {
            // Vendor-to-vendor chat: determine which vendor is the current user
            const myVendorId = await getVendorId();
            if (myVendorId) {
              // Use the vendor ID that matches the current user
              if (currentChat.vendor?.id === myVendorId) {
                senderId = currentChat.vendor.id;
              } else if (currentChat.vendor2?.id === myVendorId) {
                senderId = currentChat.vendor2.id;
              } else {
                senderId = myVendorId; // Fallback
              }
            } else {
              throw new Error('Unable to determine vendor ID. Please refresh and try again.');
            }
          } else {
            // Vendor-to-user chat
            if (currentChat.vendor?.id) {
              senderId = currentChat.vendor.id;
            } else {
              const vendorId = await getVendorId();
              if (vendorId) {
                senderId = vendorId;
              } else {
                throw new Error('Unable to determine vendor ID. Please refresh and try again.');
              }
            }
          }
        } else {
          // Fallback: get vendor ID from API
          const vendorId = await getVendorId();
          if (vendorId) {
            senderId = vendorId;
          } else {
            throw new Error('Unable to determine vendor ID. Please refresh and try again.');
          }
        }
      }
      
      await messageAPI.sendMessage({
        chatId: selectedConversation,
        senderId: senderId,
        content: newMessage.trim(),
        senderType: userRole === 'VENDOR' ? 'VENDOR' : 'USER'
      });
      
      setNewMessage('');
      
      // Reload messages immediately
      const chatMessages = (await messageAPI.getMessagesByChat(selectedConversation)) as Message[];
      setMessages(chatMessages || []);
      
      // Reload conversations to update lastMessage
      let chats: Chat[] = [];
      if (userRole === 'VENDOR') {
        const vendorId = await getVendorId();
        if (vendorId) {
          chats = (await chatAPI.getChatsByVendor(vendorId)) as Chat[];
        }
      } else {
        chats = (await chatAPI.getChatsByUser(userId)) as Chat[];
      }
      chats = (chats || []).sort((a, b) => {
        // Pinned/system chats first
        const aIsPinned = a.isPinned || a.isSystemChat;
        const bIsPinned = b.isPinned || b.isSystemChat;
        if (aIsPinned && !bIsPinned) return -1;
        if (!aIsPinned && bIsPinned) return 1;
        
        // Then by lastMessageAt
        const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      setConversations(chats);
      
      // Mark messages as seen (this returns plain text, not JSON)
      try {
        await messageAPI.markMessagesAsSeen(selectedConversation, senderId);
      } catch (error) {
        // Ignore errors for mark as seen - it's not critical
        console.log('Note: Could not mark messages as seen');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(error.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Format time (e.g., "2:30 PM")
  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Format date for grouping (e.g., "Today", "Yesterday", "12/25/2024")
  const formatDateGroup = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const dateKey = new Date(message.createdAt).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  // Get display info for conversation
  const getConversationDisplay = (conversation: Chat, myVendorId?: string | null) => {
    // Check if this is Event Craft Support chat
    const isEventCraftSupport = conversation.isSystemChat && 
      (conversation.vendor?.companyName === 'Event Craft Support' || 
       conversation.vendor2?.companyName === 'Event Craft Support');
    
    if (isEventCraftSupport) {
      return {
        name: 'Event Craft Support',
        subtext: 'Customer Support',
        initial: 'EC'
      };
    }
    
    const isVendorToVendor = conversation.vendor2 != null;
    
    if (userRole === 'VENDOR') {
      if (isVendorToVendor) {
        // Vendor-to-vendor chat - show the other vendor
        // Determine which vendor is "other" based on myVendorId
        const otherVendor = (myVendorId && conversation.vendor?.id === myVendorId)
          ? conversation.vendor2 
          : conversation.vendor;
        
        return {
          name: otherVendor?.companyName || otherVendor?.user?.fullName || 'Vendor',
          subtext: otherVendor?.serviceType || otherVendor?.user?.email || 'Service',
          initial: (otherVendor?.companyName?.[0] || otherVendor?.user?.fullName?.[0] || 'V').toUpperCase()
        };
      } else {
        // Vendor-to-user chat
        return {
          name: conversation.user?.fullName || conversation.user?.username || 'Customer',
          subtext: conversation.user?.email || 'User',
          initial: (conversation.user?.fullName?.[0] || conversation.user?.username?.[0] || 'C').toUpperCase()
        };
      }
    } else {
      // User viewing vendor
      return {
        name: conversation.vendor?.companyName || conversation.vendor?.user?.fullName || 'Vendor',
        subtext: conversation.vendor?.serviceType || conversation.vendor?.user?.email || 'Service',
        initial: (conversation.vendor?.companyName?.[0] || conversation.vendor?.user?.fullName?.[0] || 'V').toUpperCase()
      };
    }
  };

  // Check if message is from current user
  const isMyMessage = (message: Message, currentChat: Chat | undefined) => {
    if (!currentChat) return false;
    
    const isVendorToVendor = currentChat.vendor2 != null;
    
    if (message.senderType === 'USER') {
      // For users, senderId is the user ID
      return currentChat.user?.id === userId || message.senderId === userId;
    } else if (message.senderType === 'VENDOR') {
      // For vendors, senderId is the vendor entity ID
      if (userRole === 'VENDOR') {
        if (isVendorToVendor) {
          // Vendor-to-vendor: check if senderId matches either vendor in the chat
          return currentChat.vendor?.id === message.senderId || currentChat.vendor2?.id === message.senderId;
        } else {
          // Vendor-to-user: check if senderId matches the vendor
          return currentChat.vendor?.id === message.senderId;
        }
      }
      return false;
    }
    return false;
  };

  const currentChat = conversations.find((c) => c.id === selectedConversation);
  const displayInfo = currentChat ? getConversationDisplay(currentChat, myVendorId) : null;
  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full relative">
      <Header />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Conversations Sidebar */}
        <aside className="w-80 bg-[#0f0f1a]/60 backdrop-blur-sm border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 
              className="text-2xl font-bold text-white mb-4 messages-title"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Messages
            </h2>
            <div className="relative messages-search-container">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 messages-search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Search or start new chat" 
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 messages-search-input" 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loading fullScreen={false} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="mb-2">No conversations yet</p>
                <p className="text-sm text-gray-500">Click "Request a Quote" on a vendor page to start chatting</p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const display = getConversationDisplay(conversation, myVendorId);
                const unreadCount = unreadCounts[conversation.id] || 0;
                const isSelected = selectedConversation === conversation.id;
                const isPinned = conversation.isPinned || conversation.isSystemChat;
                const isEventCraftSupport = conversation.isSystemChat && 
                  (conversation.vendor?.companyName === 'Event Craft Support' || 
                   conversation.vendor2?.companyName === 'Event Craft Support');
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-3 flex items-center space-x-3 border-b border-gray-800 messages-conversation-item ${
                      isSelected ? 'bg-gray-900' : ''
                    } ${isPinned ? 'bg-opacity-50' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg messages-avatar ${
                        isEventCraftSupport 
                          ? 'bg-gradient-to-br from-blue-600 to-blue-800' 
                          : 'bg-gradient-to-br from-purple-600 to-purple-800'
                      }`}>
                        {isEventCraftSupport ? 'EC' : display.initial}
                      </div>
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#0f0f1a] messages-unread-badge">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                      )}
                      {isPinned && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-[#0f0f1a] messages-pin-badge">
                          <span className="text-[8px]">📌</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-medium text-sm truncate messages-conversation-name ${isEventCraftSupport ? 'text-blue-400' : 'text-white'}`}>
                            {isEventCraftSupport ? 'Event Craft Support' : display.name}
                          </h3>
                          {isPinned && !isEventCraftSupport && (
                            <span className="text-xs text-yellow-500 messages-pin-icon">📌</span>
                          )}
                        </div>
                        {conversation.lastMessageAt && (
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0 messages-conversation-time">
                            {formatTime(conversation.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate messages-conversation-preview ${unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {conversation.lastMessage || 'No messages yet'}
                        </p>
                        {unreadCount > 0 && (
                          <div className="w-2 h-2 bg-green-500 rounded-full ml-2 flex-shrink-0 messages-unread-dot"></div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-transparent">
          {selectedConversation && displayInfo ? (
            <>
              {/* Chat Header */}
              <div className="bg-[#0f0f1a] border-b border-gray-800 px-6 py-4 flex items-center justify-between messages-chat-header">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold messages-chat-avatar ${
                    currentChat?.isSystemChat && (currentChat?.vendor?.companyName === 'Event Craft Support' || currentChat?.vendor2?.companyName === 'Event Craft Support')
                      ? 'bg-gradient-to-br from-blue-600 to-blue-800'
                      : 'bg-gradient-to-br from-purple-600 to-purple-800'
                  }`}>
                    {displayInfo.initial}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 
                        className={`font-medium messages-chat-name ${
                          currentChat?.isSystemChat && (currentChat?.vendor?.companyName === 'Event Craft Support' || currentChat?.vendor2?.companyName === 'Event Craft Support')
                            ? 'text-blue-400'
                            : 'text-white'
                        }`}
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {displayInfo.name}
                      </h3>
                      {currentChat?.isPinned && (
                        <span className="text-xs text-yellow-500 messages-chat-pin">📌</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 messages-chat-subtext">{displayInfo.subtext}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-800 rounded-lg messages-chat-menu-button">
                  <MoreVerticalIcon size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Messages Area */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-transparent"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)' }}
              >
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loading fullScreen={false} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                        <SendIcon size={32} className="text-gray-600" />
                      </div>
                      <p className="text-lg mb-2">No messages yet</p>
                      <p className="text-sm">Start the conversation by sending a message</p>
                    </div>
                  </div>
                ) : (
                  Object.entries(messageGroups).map(([dateKey, dateMessages]) => {
                    return (
                      <div key={dateKey}>
                        {/* Date Separator */}
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-800 px-4 py-1 rounded-full messages-date-separator">
                            <span className="text-xs text-gray-400 font-medium">
                              {formatDateGroup(dateMessages[0].createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Messages for this date */}
                        {dateMessages.map((message) => {
                          const isMe = isMyMessage(message, currentChat);
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex items-end space-x-2 mb-1 messages-message-container ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                              {!isMe && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 messages-message-avatar">
                                  {displayInfo.initial}
                                </div>
                              )}
                              <div className={`max-w-[70%] ${isMe ? 'order-2' : ''}`}>
                                <div
                                  className={`rounded-2xl px-4 py-2 messages-message-bubble ${
                                    isMe
                                      ? 'bg-purple-600 text-white rounded-br-md'
                                      : 'bg-gray-800 text-white rounded-bl-md'
                                  }`}
                                >
                                  <p className="text-sm break-words whitespace-pre-wrap messages-message-content">{message.content}</p>
                                  <div className={`flex items-center justify-end mt-1 space-x-1 messages-message-meta ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                                    <span className="text-xs messages-message-time">{formatTime(message.createdAt)}</span>
                                    {isMe && (
                                      <span className="ml-1 messages-message-status">
                                        {message.status === 'SEEN' ? (
                                          <CheckCircle2 size={14} className="text-blue-400" />
                                        ) : (
                                          <CheckIcon size={14} />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {isMe && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 messages-message-avatar messages-message-avatar-me">
                                  {userRole === 'VENDOR' ? displayInfo.initial : (currentChat?.user?.fullName?.[0] || 'U').toUpperCase()}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-[#0f0f1a] border-t border-gray-800 p-4 messages-input-container">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-800 rounded-lg flex-shrink-0 messages-input-attach"
                    title="Attach file"
                  >
                    <PaperclipIcon size={20} className="text-gray-400" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none messages-input-field"
                      disabled={sending}
                    />
                  </div>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-800 rounded-lg flex-shrink-0 messages-input-emoji"
                    title="Emoji"
                  >
                    <SmileIcon size={20} className="text-gray-400" />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed messages-input-send"
                    title="Send message"
                  >
                    <SendIcon size={20} className="text-white" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <SendIcon size={40} className="text-gray-600" />
                </div>
                <p className="text-xl mb-2">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </main>
      </div>
      <style>{`
        .messages-title {
          transition: all 0.3s ease;
        }
        .messages-title:hover {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .messages-search-container {
          transition: all 0.3s ease;
        }
        .messages-search-icon {
          transition: all 0.3s ease;
        }
        .messages-search-container:hover .messages-search-icon {
          color: #a78bfa;
          transform: scale(1.1);
        }
        .messages-search-input {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-search-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
          border-color: rgba(139, 92, 246, 0.8);
        }
        .messages-search-input:hover:not(:focus) {
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-1px);
        }
        .messages-conversation-item {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-conversation-item:hover {
          background: rgba(17, 24, 39, 0.8);
          transform: translateX(4px);
        }
        .messages-avatar {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-conversation-item:hover .messages-avatar {
          transform: scale(1.1) rotate(5deg);
        }
        .messages-unread-badge {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-conversation-item:hover .messages-unread-badge {
          transform: scale(1.2) rotate(10deg);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
        }
        .messages-pin-badge {
          transition: all 0.3s ease;
        }
        .messages-conversation-item:hover .messages-pin-badge {
          transform: scale(1.2) rotate(-10deg);
        }
        .messages-conversation-name {
          transition: all 0.3s ease;
        }
        .messages-conversation-item:hover .messages-conversation-name {
          color: #a78bfa;
        }
        .messages-pin-icon {
          transition: all 0.3s ease;
        }
        .messages-conversation-item:hover .messages-pin-icon {
          transform: scale(1.2) rotate(-10deg);
        }
        .messages-conversation-time {
          transition: all 0.3s ease;
        }
        .messages-conversation-item:hover .messages-conversation-time {
          color: #c4b5fd;
        }
        .messages-conversation-preview {
          transition: all 0.3s ease;
        }
        .messages-conversation-item:hover .messages-conversation-preview {
          color: #c4b5fd;
        }
        .messages-unread-dot {
          transition: all 0.3s ease;
        }
        .messages-conversation-item:hover .messages-unread-dot {
          transform: scale(1.3);
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }
        .messages-chat-header {
          transition: all 0.3s ease;
        }
        .messages-chat-avatar {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-chat-header:hover .messages-chat-avatar {
          transform: scale(1.1) rotate(5deg);
        }
        .messages-chat-name {
          transition: all 0.3s ease;
        }
        .messages-chat-header:hover .messages-chat-name {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .messages-chat-pin {
          transition: all 0.3s ease;
        }
        .messages-chat-header:hover .messages-chat-pin {
          transform: scale(1.2) rotate(-10deg);
        }
        .messages-chat-subtext {
          transition: all 0.3s ease;
        }
        .messages-chat-header:hover .messages-chat-subtext {
          color: #c4b5fd;
        }
        .messages-chat-menu-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-chat-menu-button:hover {
          transform: scale(1.15) rotate(90deg);
          background: rgba(139, 92, 246, 0.2);
        }
        .messages-date-separator {
          transition: all 0.3s ease;
        }
        .messages-date-separator:hover {
          background: rgba(139, 92, 246, 0.2);
          transform: scale(1.05);
        }
        .messages-message-container {
          transition: all 0.3s ease;
        }
        .messages-message-container:hover {
          transform: translateX(4px);
        }
        .messages-message-avatar {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-message-container:hover .messages-message-avatar {
          transform: scale(1.15) rotate(5deg);
        }
        .messages-message-bubble {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-message-container:hover .messages-message-bubble {
          transform: scale(1.02);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
        }
        .messages-message-content {
          transition: all 0.3s ease;
        }
        .messages-message-container:hover .messages-message-content {
          color: #e9d5ff;
        }
        .messages-message-time {
          transition: all 0.3s ease;
        }
        .messages-message-container:hover .messages-message-time {
          opacity: 0.8;
        }
        .messages-message-status {
          transition: all 0.3s ease;
        }
        .messages-message-container:hover .messages-message-status {
          transform: scale(1.1);
        }
        .messages-input-container {
          transition: all 0.3s ease;
        }
        .messages-input-attach,
        .messages-input-emoji {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-input-attach:hover,
        .messages-input-emoji:hover {
          transform: scale(1.15) rotate(10deg);
          background: rgba(139, 92, 246, 0.2);
        }
        .messages-input-field {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .messages-input-field:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
          border-color: rgba(139, 92, 246, 0.8);
        }
        .messages-input-field:hover:not(:focus) {
          border-color: rgba(139, 92, 246, 0.5);
        }
        .messages-input-send {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .messages-input-send::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .messages-input-send:hover::before {
          left: 100%;
        }
        .messages-input-send:hover:not(:disabled) {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  );
};
