import React, { createRef, useEffect } from "react"
import { useState } from "react"
import * as styles from "./index.module.css"

export default function JumpButton() {
  const [toBottom, setToBottom] = useState(true)
  const buttonRef = createRef<HTMLButtonElement>()

  useEffect(() => {
    const onButtonClick = (e: any) => {
      const pos =
        window.scrollY > window.innerHeight
          ? { top: 0, left: 0 }
          : { top: window.document.body.scrollHeight || 99999, left: 0 }
      window.scrollTo({
        ...pos,
        behavior: "smooth",
      })
      e.preventDefault()
    }

    const onScroll = () => {
      setToBottom(
        () =>
          (window.pageYOffset || document.documentElement.scrollTop) <
          window.innerHeight
      )
    }

    buttonRef.current?.addEventListener("click", onButtonClick)
    document.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      buttonRef.current?.removeEventListener("click", onButtonClick)
      document.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className={`jump-button ${styles.container}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.button} ${toBottom ? styles.toBottom : ""}`}
      />
    </div>
  )
}
