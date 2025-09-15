import React, { useState } from 'react';
import './app.css';
import Chatbot from './chatbot';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="App">
      <header>
        <h1>Welcome to Your Event Planner</h1>
        <p>Plan your wedding or event easily with our tools.</p>
        <button onClick={() => alert("Start Planning")}>Start Planning</button>
      </header>
      {isChatOpen && (
        <div className="chatbot-backdrop" role="button" aria-label="Close chat" onClick={() => setIsChatOpen(false)} />
      )}

      <div className={`chatbot-drawer ${isChatOpen ? 'open' : ''}`} aria-hidden={!isChatOpen}>
        {isChatOpen && (
          <Chatbot onClose={() => setIsChatOpen(false)} />
        )}
      </div>
      <button
        className="chatbot-fab"
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
        onClick={() => setIsChatOpen((v) => !v)}
      >
        {isChatOpen ? '✖' : '💬'}
      </button>
      <footer>
        <p>&copy; 2025 Event Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
