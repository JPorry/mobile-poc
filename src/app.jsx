import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { isBrowser, isMobile } from "react-device-detect";

import keyboardImageUrl from "./assets/keyboard.png";
import statusBarImageUrl from "./assets/home-status-ios.png";
import "./app.css";

const keyboardHeight = 293;
const baseAppHeight = 844;
const baseAppWidth = 390;
const statusBarHeight = 44;

//eslint-disable-next-line
function MobileContainer({ children }) {
  const contentRef = useRef(null);
  const keyboardRef = useRef(null);
  const initialAppHeightRef = useRef(null);
  const [appSize, setAppSize] = useState();

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (!initialAppHeightRef.current) {
      initialAppHeightRef.current = visualViewport.height;
    }

    if (isMobile) {
      setAppSize({
        height: visualViewport.height,
        width: visualViewport.width,
      });
    } else {
      setAppSize({
        height: baseAppHeight,
        width: baseAppWidth,
      });
    }

    function adjustPositions() {
      if (isBrowser) return;
      //adjust app height
      contentRef.current.style.height = `${visualViewport.height}px`;
      contentRef.current.style.width = `${visualViewport.width}px`;

      if (visualViewport.height < initialAppHeightRef.current) {
        //keyboard open
        document.body.style.touchAction = "none";
      } else {
        //keyboard close
        document.body.style.touchAction = "auto";
      }
    }

    function onElementFocus(e) {
      if (isMobile) return;
      if (e.target.tagName === "INPUT") {
        //show keyboard and resize container
        keyboardRef.current.style.transform = "none";
        contentRef.current.style.height = `${baseAppHeight - keyboardHeight}px`;
      }
    }

    function onElementBlur(e) {
      if (isMobile) return;
      if (e.target.tagName === "INPUT") {
        //hide keyboard and resize container
        keyboardRef.current.style.removeProperty("transform");
        contentRef.current.style.height = `${baseAppHeight}px`;
      }
    }

    visualViewport.addEventListener("resize", adjustPositions);

    document.addEventListener("focus", onElementFocus, true);
    document.addEventListener("blur", onElementBlur, true);

    adjustPositions();

    return () => {
      visualViewport.removeEventListener("resize", adjustPositions);

      document.removeEventListener("focus", onElementFocus, true);
      document.removeEventListener("blur", onElementBlur, true);
    };
  }, []);

  return (
    <div
      className={cn("mobileContainer_wrapper", {
        isBrowser,
        isMobile,
      })}
      style={{
        "--baseAppHeight": baseAppHeight,
        "--baseAppWidth": baseAppWidth,
        "--keyboardHeight": keyboardHeight,
        "--statusBarHeight": statusBarHeight,
        "--appHeight": appSize?.height,
        "--appWidth": appSize?.width,
      }}
    >
      <div className="mobileContainer">
        <div
          className="mobileContainer_statusBar"
          style={{
            height: statusBarHeight,
          }}
        >
          <img src={statusBarImageUrl} alt="status bar" />
        </div>
        <div className="mobileContainer_contentWrapper" ref={contentRef}>
          {children}
        </div>
        <div
          className="mobileContainer_keyboard"
          style={{ height: keyboardHeight }}
          ref={keyboardRef}
        >
          <img src={keyboardImageUrl} alt="keyboard" />
        </div>
      </div>
    </div>
  );
}

//eslint-disable-next-line
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
