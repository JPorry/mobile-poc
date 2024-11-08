import { useEffect, useRef, useState } from "react";
import MobileContainer from "./components/mobile-container";

import "./app.css";

function ChatContainer({ children }) {
  const chatRef = useRef(null);

  useEffect(() => {
    function observerCallback(mutationList) {
      for (let mutation of mutationList) {
        if (mutation.type === "childList") {
          if (mutation.addedNodes.length) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }
      }
    }

    const observer = new MutationObserver(observerCallback);
    observer.observe(chatRef.current, {
      childList: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="chatContainer" ref={chatRef}>
      {children}
    </div>
  );
}

function App() {
  const fakeInputRef = useRef(null);
  const fieldRef = useRef(null);

  const [messages, setMessages] = useState([]);

  return (
    <MobileContainer>
      <ChatContainer>
        {messages.map((message, index) => (
          <>
            <div key={index} className="message">
              {message}
            </div>
            <div className="h_scroller">
              <div className="rect">2a</div>
              <div className="rect">2b</div>
              <div className="rect">2c</div>
              <div className="rect">2d</div>
              <div className="rect">2e</div>
            </div>
          </>
        ))}
      </ChatContainer>

      <div className="bottom">
        <input
          type="text"
          className="field"
          ref={fieldRef}
          onChange={() => {
            fakeInputRef.current.textContent = fieldRef.current.value;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setMessages([...messages, fieldRef.current.value]);
              fieldRef.current.value = "";
              fakeInputRef.current.textContent = "";
            }
          }}
        />
        <div
          ref={fakeInputRef}
          className="fakeInput"
          onClick={() => {
            fieldRef.current.focus();
          }}
        ></div>
      </div>
    </MobileContainer>
  );
}

export default App;
