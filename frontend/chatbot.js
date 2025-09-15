import React, { useEffect, useRef, useState } from 'react';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (userInput.trim() !== '') {
      const outgoing = { sender: 'user', text: userInput, at: new Date().toISOString() };
      setMessages((prev) => [...prev, outgoing]);
      setUserInput('');
      setIsTyping(true);

      try {
        const response = await fetch('http://localhost:8080/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: outgoing.text }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        const botText = data && data.response ? data.response : "Thanks for your message! How can I help with your event?";
        setMessages((prev) => [...prev, { sender: 'bot', text: botText, at: new Date().toISOString() }]);
      } catch (err) {
        setMessages((prev) => [...prev, { sender: 'bot', text: "I'm having trouble connecting right now, but I’m here to help!", at: new Date().toISOString() }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="chatbot-container" role="region" aria-label="Chat window">
      <div className="chatbot-header">
        <span className="chatbot-title">Chat with us</span>
        <button className="chatbot-close" aria-label="Close chat" onClick={onClose}>✖</button>
      </div>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg-row ${msg.sender}`}>
            {msg.sender === 'bot' ? (
              <img
                className="msg-avatar"
                src="https://api.dicebear.com/7.x/bottts/png?seed=Agent&size=64"
                alt="AI"
                width="28"
                height="28"
              />
            ) : (
              <div className="msg-avatar user-initial">U</div>
            )}
            <div className="msg-bundle">
              <div className="msg-bubble"><p>{msg.text}</p></div>
              <span className="msg-time">{formatTime(msg.at)}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="msg-row bot">
            <img
              className="msg-avatar"
              src="https://api.dicebear.com/7.x/bottts/png?seed=Agent&size=64"
              alt="AI"
              width="28"
              height="28"
            />
            <div className="msg-bundle">
              <div className="msg-bubble typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything about your event..."
          ref={inputRef}
        />
        <button type="submit" className="send-btn" aria-label="Send message" disabled={!userInput.trim()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chatbot;