import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { chatAPI, messageAPI } from '../services/api';
import { ArrowLeftIcon, SendIcon, MoreVerticalIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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

export const AdminMessagesView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [chatId, setChatId] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const chatIdFromState = (location.state as any)?.chatId;
    if (chatIdFromState) {
      setChatId(chatIdFromState);
    }
  }, [location]);

  useEffect(() => {
    if (chatId) {
      loadChatAndMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [chatId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatAndMessages = async () => {
    if (!chatId) return;
    try {
      const [chatData, messagesData] = await Promise.all([
        chatAPI.getChatById(chatId),
        messageAPI.getMessagesByChat(chatId)
      ]);
      setCurrentChat(chatData as Chat);
      setMessages((messagesData as Message[]) || []);
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!chatId) return;
    try {
      const messagesData = await messageAPI.getMessagesByChat(chatId);
      setMessages((messagesData as Message[]) || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !userId || sending) return;

    setSending(true);
    try {
      // Get Event Craft Support vendor ID
      const eventCraftSupportVendor = currentChat?.vendor?.companyName === 'Event Craft Support' 
        ? currentChat.vendor 
        : currentChat?.vendor2?.companyName === 'Event Craft Support' 
          ? currentChat.vendor2 
          : null;

      if (!eventCraftSupportVendor) {
        throw new Error('Unable to find Event Craft Support vendor');
      }

      await messageAPI.sendMessage({
        chatId: chatId,
        senderId: eventCraftSupportVendor.id,
        content: newMessage.trim(),
        senderType: 'VENDOR'
      });

      setNewMessage('');
      await loadMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(error.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const getDisplayInfo = () => {
    if (!currentChat) return { name: 'Loading...', subtext: '', initial: 'L' };
    
    if (currentChat.user) {
      return {
        name: currentChat.user.fullName || currentChat.user.username || 'User',
        subtext: currentChat.user.email || 'User',
        initial: (currentChat.user.fullName?.[0] || currentChat.user.username?.[0] || 'U').toUpperCase()
      };
    }
    
    const otherVendor = currentChat.vendor?.companyName === 'Event Craft Support' 
      ? currentChat.vendor2 
      : currentChat.vendor;
    
    return {
      name: otherVendor?.companyName || otherVendor?.user?.fullName || 'Vendor',
      subtext: otherVendor?.serviceType || otherVendor?.user?.email || 'Service',
      initial: (otherVendor?.companyName?.[0] || otherVendor?.user?.fullName?.[0] || 'V').toUpperCase()
    };
  };

  const isMyMessage = (message: Message) => {
    if (!currentChat) return false;
    const eventCraftSupportVendor = currentChat.vendor?.companyName === 'Event Craft Support' 
      ? currentChat.vendor 
      : currentChat.vendor2?.companyName === 'Event Craft Support' 
        ? currentChat.vendor2 
        : null;
    return eventCraftSupportVendor && message.senderId === eventCraftSupportVendor.id;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const displayInfo = getDisplayInfo();

  if (loading) {
    return (
      <div className="flex bg-transparent w-full min-h-screen">
        <Sidebar type="admin" />
        <div className="flex-1 ml-64 flex items-center justify-center min-h-screen">
          <div className="text-gray-400">Loading chat...</div>
        </div>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex min-h-screen bg-transparent w-full relative">
        <Sidebar type="admin" />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-gray-400">Chat not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-transparent w-full min-h-screen">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="bg-[#0a0a0f]/60 backdrop-blur-sm border-b border-gray-800 px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/messages')}
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeftIcon size={20} className="text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                {displayInfo.initial}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{displayInfo.name}</h1>
                <p className="text-sm text-gray-400">{displayInfo.subtext}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col bg-transparent">
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-transparent"
          >
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isMyMsg = isMyMessage(message);
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMyMsg ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMyMsg
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${isMyMsg ? 'text-purple-200' : 'text-gray-400'}`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="bg-[#0f0f1a] border-t border-gray-800 px-6 py-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <SendIcon size={20} />
                <span>{sending ? 'Sending...' : 'Send'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

