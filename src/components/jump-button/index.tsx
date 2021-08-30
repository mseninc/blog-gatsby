import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useCallback } from "react";
import * as styles from "./index.module.css"

export default function JumpButton() {

  const TOP_BOTTOM_THRESHOLD = 100;

  const [toBottom, setToBottom] = useState(true);

  const onButtonClick = useCallback(() => {
    const pos = (window.scrollY > TOP_BOTTOM_THRESHOLD)
      ? { top: 0, left: 0 }
      : { top: window.document.body.scrollHeight || 99999, left: 0 };
    window.scrollTo({
      ...pos,
      behavior: 'smooth'
    });
  }, [window]);

  // setToBottom(() => (window.pageYOffset || document.documentElement.scrollTop) < TOP_BOTTOM_THRESHOLD);

  const onScroll = useCallback(() => {
    setToBottom(() => (window.pageYOffset || document.documentElement.scrollTop) < TOP_BOTTOM_THRESHOLD);
  }, []);

  useEffect(() => {
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, []);

  return (
    <div className={`jump-button ${styles.container}`}>
      <button
        type="button"
        className={`${styles.button} ${(toBottom ? styles.toBottom : '')}`}
        onClick={onButtonClick}
      />
    </div>
  );
}
