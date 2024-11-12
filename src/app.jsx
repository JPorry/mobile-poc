import { useEffect, useRef, useState } from "react";
import MobileContainer from "./components/mobile-container";
import { motion, AnimatePresence } from "framer-motion";

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

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }
    });

    const observer = new MutationObserver(observerCallback);
    observer.observe(chatRef.current, {
      childList: true,
    });

    resizeObserver.observe(chatRef.current);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
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
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              layout
              key={index}
              className="message"
              initial={{
                scale: 1.2,
                opacity: 0,
                backgroundColor: "rgba(173,216,230,1)",
              }}
              animate={{
                scale: 1,
                opacity: 1,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                transition: {
                  backgroundColor: {
                    delay: 0.5,
                  },
                },
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring" }}
            >
              {message}
            </motion.div>
          ))}
        </AnimatePresence>
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
