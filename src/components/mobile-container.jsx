import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { isBrowser, isMobile } from "react-device-detect";

import keyboardImageUrl from "../assets/keyboard.png";
import statusBarImageUrl from "../assets/home-status-ios.png";

import "./mobile-container.css";

const keyboardHeight = 293;
const baseAppHeight = 844;
const baseAppWidth = 390;
const statusBarHeight = 44;

export default function MobileContainer({ children }) {
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
