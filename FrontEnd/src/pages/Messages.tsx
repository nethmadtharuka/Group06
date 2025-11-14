import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchIcon, MoreVerticalIcon, PlusCircleIcon, SendIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { chatAPI, messageAPI } from '../services/api';

export const Messages = () => {
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const loadConversations = async () => {
      if (userId) {
        try {
          const userRole = localStorage.getItem('userRole');
          let chats: any[] = [];
          
          // Load chats based on user role
          if (userRole === 'VENDOR') {
            // If user is a vendor, get vendor's chats
            try {
              const { vendorAPI } = await import('../services/api');
              const vendor = await vendorAPI.getVendorByUserId(userId);
              if (vendor && (vendor as any).id) {
                chats = await chatAPI.getChatsByVendor((vendor as any).id);
              }
            } catch (error) {
              console.error('Error loading vendor chats:', error);
              // Fallback to user chats if vendor lookup fails
              chats = await chatAPI.getChatsByUser(userId);
            }
          } else {
            // Regular user - get user's chats
            chats = await chatAPI.getChatsByUser(userId);
          }
          
          setConversations(chats || []);
          
          // Check if there's a chatId in location state (from Request a Quote)
          const chatIdFromState = (location.state as any)?.chatId;
          if (chatIdFromState) {
            // Verify the chat exists in the loaded chats, if not, it might be newly created
            const chatExists = chats.some((c: any) => c.id === chatIdFromState);
            if (chatExists) {
              setSelectedConversation(chatIdFromState);
            } else {
              // Chat was just created, add it to the list and select it
              try {
                const newChat = await chatAPI.getChatById(chatIdFromState);
                if (newChat) {
                  setConversations([newChat, ...chats]);
                  setSelectedConversation(chatIdFromState);
                }
              } catch (error) {
                console.error('Error loading new chat:', error);
                // Still select it even if we can't load details
                setSelectedConversation(chatIdFromState);
              }
            }
            // Clear the state to avoid re-selecting on re-render
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
  }, [userId, location.state]);

  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation && userId) {
        try {
          const chatMessages = await messageAPI.getMessagesByChat(selectedConversation);
          setMessages(chatMessages || []);
          // Mark messages as seen when viewing
          await messageAPI.markMessagesAsSeen(selectedConversation, userId);
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      }
    };
    loadMessages();
    
    // Set up polling to refresh messages every 3 seconds
    const interval = setInterval(() => {
      if (selectedConversation) {
        loadMessages();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedConversation, userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !userId) return;

    try {
      const userRole = localStorage.getItem('userRole');
      await messageAPI.sendMessage({
        chatId: selectedConversation,
        senderId: userId,
        content: newMessage.trim(),
        senderType: userRole === 'VENDOR' ? 'VENDOR' : 'USER'
      });
      setNewMessage('');
      // Reload messages
      const chatMessages = await messageAPI.getMessagesByChat(selectedConversation);
      setMessages(chatMessages || []);
      
      // Mark messages as seen when sending
      await messageAPI.markMessagesAsSeen(selectedConversation, userId);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return <div className="flex flex-col min-h-screen bg-[#0a0a0f] w-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-96 bg-[#0a0a0f] border-r border-gray-800">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search messages" className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No conversations yet</div>
            ) : (
              conversations.map((conversation: any) => {
                const userRole = localStorage.getItem('userRole');
                // If user is a vendor, show the customer/user info, otherwise show vendor info
                const displayName = userRole === 'VENDOR' 
                  ? (conversation.user?.fullName || conversation.user?.username || 'Customer')
                  : (conversation.vendor?.companyName || 'Vendor');
                const displaySubtext = userRole === 'VENDOR'
                  ? (conversation.user?.email || 'User')
                  : (conversation.vendor?.serviceType || 'Service');
                const displayInitial = userRole === 'VENDOR'
                  ? (conversation.user?.fullName?.[0] || conversation.user?.username?.[0] || 'C')
                  : (conversation.vendor?.companyName?.[0] || 'V');
                
                return (
                  <button 
                    key={conversation.id} 
                    onClick={() => setSelectedConversation(conversation.id)} 
                    className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-900 transition-colors ${selectedConversation === conversation.id ? 'bg-purple-900 bg-opacity-30' : ''}`}
                  >
                <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                        {displayInitial}
                      </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium">
                          {displayName}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                        {displaySubtext}
                      </p>
                      {conversation.lastMessage && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                      )}
                </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>
        <main className="flex-1 flex flex-col">
          {selectedConversation && conversations.find((c: any) => c.id === selectedConversation) && (
            <>
              {(() => {
                const currentChat = conversations.find((c: any) => c.id === selectedConversation);
                const userRole = localStorage.getItem('userRole');
                const displayName = userRole === 'VENDOR'
                  ? (currentChat?.user?.fullName || currentChat?.user?.username || 'Customer')
                  : (currentChat?.vendor?.companyName || 'Vendor');
                const displaySubtext = userRole === 'VENDOR'
                  ? (currentChat?.user?.email || 'User')
                  : (currentChat?.vendor?.serviceType || 'Service');
                const displayInitial = userRole === 'VENDOR'
                  ? (currentChat?.user?.fullName?.[0] || currentChat?.user?.username?.[0] || 'C')
                  : (currentChat?.vendor?.companyName?.[0] || 'V');
                
                return (
          <div className="bg-[#0a0a0f] border-b border-gray-800 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                        {displayInitial}
                      </div>
              <div>
                <h3 className="text-white font-medium">
                          {displayName}
                </h3>
                <p className="text-sm text-gray-400">
                          {displaySubtext}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <MoreVerticalIcon size={20} className="text-gray-400" />
            </button>
          </div>
                );
              })()}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((message: any) => {
                    // Check if message is from current user
                    const currentChat = conversations.find((c: any) => c.id === selectedConversation);
                    const userRole = localStorage.getItem('userRole');
                    
                    // Determine if message is from current user
                    let isMe = false;
                    if (message.senderType === 'USER') {
                      // Message is from a user - check if it's the current user
                      isMe = currentChat?.user?.id === userId || message.senderId === userId;
                    } else if (message.senderType === 'VENDOR') {
                      // Message is from a vendor - check if current user is the vendor
                      isMe = userRole === 'VENDOR' && (currentChat?.vendor?.user?.id === userId || message.senderId === userId);
                    } else {
                      // Fallback: check senderId directly
                      isMe = message.senderId === userId;
                    }
                    
                    return (
                      <div key={message.id} className={`flex items-end space-x-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                            {currentChat?.vendor?.companyName?.[0] || 'V'}
                          </div>
                        )}
                        <div className={`max-w-xl ${isMe ? 'bg-purple-600 text-white' : 'bg-gray-800 text-white'} rounded-2xl px-6 py-3`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                            {formatTime(message.createdAt || message.timestamp)}
                  </p>
                </div>
                        {isMe && (
                          <div className="w-8 h-8 rounded-full bg-[#e8c4a3] flex items-center justify-center text-white text-xs">
                            {currentChat?.user?.fullName?.[0] || currentChat?.user?.username?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
          </div>
          <div className="bg-[#0a0a0f] border-t border-gray-800 p-6">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                  <button type="button" className="p-2 hover:bg-gray-800 rounded-lg">
                <PlusCircleIcon size={24} className="text-gray-400" />
              </button>
                  <input 
                    type="text" 
                    placeholder="Type your message here..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                  <button type="submit" className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg">
                <SendIcon size={24} className="text-white" />
              </button>
                </form>
              </div>
            </>
          )}
          {!selectedConversation && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>;
};