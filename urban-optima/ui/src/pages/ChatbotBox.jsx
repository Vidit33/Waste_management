import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoMdClose, IoMdChatbubbles } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/chat', { message: input });
      setMessages([...newMessages, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Chatbot error, please try again.' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      {/* Floating Circle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-lg hover:bg-purple-800 transition"
        >
          <IoMdChatbubbles size={28} />
        </button>
      )}

      {/* Animated Chatbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-md flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between  bg-gradient-to-r from-purple-800 via-purple-600 to-purple-800 text-white px-4 py-2">
              <h2 className="text-lg font-bold">Eco Advisory Bot</h2>
              <button onClick={() => setIsOpen(false)}>
                <IoMdClose size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-2 py-3 bg-gray-100 space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-xs md:max-w-sm px-4 py-2 rounded-md text-sm w-2/3 flex justify-center ${
                    msg.role === 'user' ? 'ml-auto bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 text-white' : 'mr-auto bg-gradient-to-br from-green-100 to-slate-200 text-green-900'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={chatRef}></div>
            </div>

            {/* Input */}
            <div className="flex gap-2 p-2 border-t border-gray-300">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your mission query..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
