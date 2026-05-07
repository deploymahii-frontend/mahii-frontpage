import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { chatAPI } from '../../services/api';
import {
  ArrowLeft,
  Circle,
  Send,
  Search,
  Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminChatDashboard = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) return;
    fetchChats();
  }, [user]);

  useEffect(() => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) return;

    const socketUrl = process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace(/\/api$/, '')
      : 'http://localhost:5000';

    const adminSocket = io(socketUrl);
    setSocket(adminSocket);

    adminSocket.on('connect', () => {
      adminSocket.emit('join_admin', user._id);
    });

    adminSocket.on('new_chat_message', (payload) => {
      setChats((prev) => {
        const updated = prev.map((chat) => {
          if (chat.sessionId === payload.sessionId) {
            return {
              ...chat,
              lastMessageAt: new Date().toISOString(),
              unreadCount: (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        });
        return updated;
      });

      if (selectedChat?.sessionId === payload.sessionId) {
        setMessages((prev) => [...prev, payload.message]);
      }
    });

    adminSocket.on('disconnect', () => {
      console.log('Admin socket disconnected');
    });

    return () => {
      adminSocket.disconnect();
    };
  }, [user, selectedChat]);

  useEffect(() => {
    if (!selectedChat || !socket) return;
    socket.emit('join_chat', selectedChat.sessionId);
  }, [socket, selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.getAdminChats();
      setChats(response.data.chats || []);
    } catch (error) {
      console.error('Error fetching admin chats:', error);
      toast.error('Unable to load chat sessions');
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chat) => {
    setLoadingChat(true);
    setSelectedChat(chat);
    try {
      const response = await chatAPI.getChatHistory(chat.sessionId);
      setMessages(response.data.chat.messages || []);
    } catch (error) {
      console.error('Error loading chat conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedChat || !messageText.trim()) return;

    try {
      const response = await chatAPI.sendMessage({
        sessionId: selectedChat.sessionId,
        message: messageText,
        senderType: 'admin',
        userId: user._id,
      });

      const sentMessage = response.data.data;
      setMessages((prev) => [...prev, sentMessage]);
      setMessageText('');

      setChats((prev) =>
        prev.map((chat) =>
          chat.sessionId === selectedChat.sessionId
            ? { ...chat, lastMessageAt: sentMessage.createdAt || new Date().toISOString(), unreadCount: 0 }
            : chat
        )
      );

      if (socket) {
        socket.emit('typing', { sessionId: selectedChat.sessionId, isTyping: false });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Message failed to send');
    }
  };

  const filteredChats = chats.filter((chat) => {
    const query = search.toLowerCase();
    return (
      chat.userInfo?.name?.toLowerCase().includes(query) ||
      chat.userInfo?.email?.toLowerCase().includes(query) ||
      chat.sessionId?.toLowerCase().includes(query)
    );
  });

  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return <Navigate to="/secure-admin-portal" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white sticky top-0 z-50">
        <div className="container-custom py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Shield size={28} />
            <div>
              <h1 className="text-xl font-bold">Admin Chat Center</h1>
              <p className="text-sm text-blue-200">Monitor support conversations in real time.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition">
              <ArrowLeft size={16} /> Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Conversations</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Select a chat to view or reply.</p>
                </div>
              </div>
              <div className="mt-4 relative">
                <Search size={18} className="absolute left-4 top-3 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or ID"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="max-h-[680px] overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-500">Loading chats...</div>
              ) : filteredChats.length ? (
                filteredChats.map((chat) => (
                  <button
                    key={chat.sessionId}
                    type="button"
                    onClick={() => selectChat(chat)}
                    className={`w-full rounded-3xl p-4 text-left transition border ${
                      selectedChat?.sessionId === chat.sessionId
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
                        : 'border-gray-200 bg-white shadow-sm hover:border-blue-300 dark:border-gray-700 dark:bg-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{chat.userInfo?.name || 'Guest user'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{chat.userInfo?.email || 'No email provided'}</p>
                      </div>
                      <span className={`text-xs font-semibold ${chat.unreadCount > 0 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
                        {chat.unreadCount > 0 ? `${chat.unreadCount} new` : 'No unread'}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {chat.messages?.[chat.messages.length - 1]?.message || 'No messages yet'}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span>{chat.status?.charAt(0).toUpperCase() + chat.status?.slice(1)}</span>
                      <span>{new Date(chat.lastMessageAt).toLocaleString()}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-16 text-gray-500">No chat sessions found.</div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              {selectedChat ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedChat.userInfo?.name || 'Guest Customer'}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedChat.userInfo?.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-200">
                      <Circle className="h-2.5 w-2.5 animate-pulse" /> {selectedChat.status || 'active'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">Select a chat session to review messages.</div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 dark:bg-gray-900" style={{ minHeight: '480px' }}>
              {loadingChat ? (
                <div className="flex items-center justify-center text-gray-500">Loading conversation...</div>
              ) : selectedChat ? (
                <>
                  {messages.length ? (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`max-w-3xl ${message.senderType === 'admin' ? 'ml-auto text-right' : 'mr-auto text-left'}`}
                      >
                        <div className={`inline-flex flex-col gap-2 rounded-3xl p-4 ${
                          message.senderType === 'admin'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                              {message.senderType === 'admin' ? 'Support' : 'Customer'}
                            </span>
                            <span className="text-[11px] text-gray-400">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="whitespace-pre-wrap break-words text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-gray-500">No messages in this chat yet.</div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="text-center py-20 text-gray-500">Pick a chat from the left to begin.</div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex gap-3">
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={!selectedChat}
                  placeholder={selectedChat ? 'Type a reply...' : 'Select a chat to respond.'}
                  className="flex-1 rounded-3xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900"
                />
                <button
                  type="submit"
                  disabled={!selectedChat || !messageText.trim()}
                  className="inline-flex h-12 items-center justify-center rounded-3xl bg-blue-600 px-5 text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatDashboard;
