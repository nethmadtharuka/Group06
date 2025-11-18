import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { adminAPI } from '../services/api';
import { MessageSquareIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminMessagesPage = () => {
  const [supportChats, setSupportChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadChats = async () => {
      try {
        const chatsData = await adminAPI.getSupportChats();
        setSupportChats(chatsData || []);
      } catch (error) {
        console.error('Error loading support chats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadChats();
    
    // Refresh chats every 10 seconds
    const interval = setInterval(loadChats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenChat = async (chat: any) => {
    try {
      navigate('/admin/messages/view', { state: { chatId: chat.id } });
    } catch (error) {
      console.error('Error opening chat:', error);
      navigate('/admin/messages/view', { state: { chatId: chat.id } });
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getChatDisplayName = (chat: any) => {
    if (chat.user) {
      return chat.user.fullName || chat.user.username || 'User';
    }
    if (chat.vendor && chat.vendor.companyName !== 'Event Craft Support') {
      return chat.vendor.companyName || 'Vendor';
    }
    if (chat.vendor2 && chat.vendor2.companyName !== 'Event Craft Support') {
      return chat.vendor2.companyName || 'Vendor';
    }
    return 'Unknown';
  };

  return (
    <div className="flex bg-transparent w-full min-h-screen">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64 min-h-screen">
        <header className="bg-[#0a0a0f]/60 backdrop-blur-sm border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <MessageSquareIcon className="mr-2" size={24} />
              Support Messages
            </h1>
          </div>
        </header>
        <main className="p-8">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading support messages...</div>
            ) : supportChats.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageSquareIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>No support messages at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {supportChats.map((chat: any) => (
                  <div
                    key={chat.id}
                    className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
                    onClick={() => handleOpenChat(chat)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{getChatDisplayName(chat)}</h3>
                        <p className="text-gray-400 text-sm truncate">{chat.lastMessage || 'No messages yet'}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-gray-500 text-xs mb-1">{formatDate(chat.lastMessageAt || chat.createdAt)}</p>
                        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                          Open Chat →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

