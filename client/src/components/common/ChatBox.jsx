import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Clock, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAPI } from '../../services/api';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [showUserForm, setShowUserForm] = useState(true);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const [typing, setTyping] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('chatSessionId');
    if (savedSession) {
      setSessionId(savedSession);
      setShowUserForm(false);
      fetchChatHistory(savedSession);
    }

    if (user) {
      setUserInfo((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }

    const socketUrl = process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace(/\/api$/, '')
      : 'http://localhost:5000';

    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('new_message', (data) => {
      if (data.sessionId === sessionId) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    newSocket.on('typing', (data) => {
      if (data.sessionId === sessionId) {
        setIsAdminTyping(data.isTyping);
      }
    });

    return () => newSocket.disconnect();
  }, [sessionId, user]);

  useEffect(() => {
    if (socket && sessionId) {
      socket.emit('join_chat', sessionId);
    }
  }, [socket, sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async (sid) => {
    try {
      const response = await chatAPI.getChatHistory(sid);
      setMessages(response.data.chat.messages || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.email) {
      toast.error('Please enter your name and email');
      return;
    }

    setLoading(true);
    try {
      const response = await chatAPI.startChat({
        ...userInfo,
        userId: user?._id,
      });
      const { sessionId: sid } = response.data;
      setSessionId(sid);
      localStorage.setItem('chatSessionId', sid);
      setShowUserForm(false);

      if (inputMessage.trim()) {
        await sendMessage(inputMessage, sid);
        setInputMessage('');
      }
    } catch (error) {
      toast.error('Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message, sid = sessionId) => {
    if (!message.trim() || !sid) return;

    try {
      const response = await chatAPI.sendMessage({
        sessionId: sid,
        message,
        senderType: 'customer',
        userId: user?._id,
      });

      const messageObj = {
        ...response.data.data,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, messageObj]);
      setInputMessage('');

      if (socket) {
        socket.emit('typing', { sessionId: sid, isTyping: false });
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessage(inputMessage);
  };

  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    if (socket && !typing && e.target.value) {
      setTyping(true);
      socket.emit('typing', { sessionId, isTyping: true });

      setTimeout(() => {
        socket.emit('typing', { sessionId, isTyping: false });
        setTyping(false);
      }, 1000);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#C2185B] text-white p-4 rounded-full shadow-lg hover:bg-[#E5093F] transition"
        >
          <MessageCircle size={24} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
              isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'
            }`}
          >
            <div className="bg-gradient-to-r from-[#C2185B] to-[#FF2E4C] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <span className="font-semibold">Support Chat</span>
                {sessionId && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Online</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/20 p-1 rounded transition">
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {showUserForm ? (
                  <div className="flex-1 p-6">
                    <h3 className="font-semibold mb-4">Start a Conversation</h3>
                    <p className="text-sm text-gray-500 mb-4">Our support team will help you with any questions.</p>
                    <form onSubmit={handleStartChat} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="input-field"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="input-field"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        className="input-field"
                      />
                      <textarea
                        placeholder="How can we help you?"
                        value={inputMessage}
                        onChange={handleTyping}
                        className="input-field resize-none"
                        rows="3"
                      />
                      <button type="submit" disabled={loading} className="w-full bg-[#C2185B] text-white py-2 rounded-lg font-semibold">
                        {loading ? 'Starting...' : 'Start Chat'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.senderType === 'customer' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                              msg.senderType === 'customer'
                                ? 'bg-[#C2185B] text-white rounded-br-none'
                                : 'bg-white border text-gray-700 rounded-bl-none shadow-sm'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.senderType === 'customer' ? 'text-white/70' : 'text-gray-400'}`}>
                              {formatTime(msg.createdAt)}
                              {msg.senderType === 'customer' && (
                                <span className="ml-1">{msg.isRead ? <CheckCheck size={12} /> : <Clock size={12} />}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isAdminTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white border rounded-2xl p-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={handleTyping}
                        placeholder="Type your message..."
                        className="flex-1 input-field py-2"
                      />
                      <button type="submit" className="bg-[#C2185B] text-white p-2 rounded-lg hover:bg-[#E5093F] transition">
                        <Send size={18} />
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBox;
