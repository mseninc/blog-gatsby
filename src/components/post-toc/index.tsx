import React, { useEffect, useState } from "react"
import { AnchorLink } from "gatsby-plugin-anchor-links"
import * as styles from "./index.module.css"

type Heading = {
  id: string
  value: string
  depth: number
}

type Props = {
  headings: Heading[]
  page?: string
  className?: string
}

export default function PostToc(props: Props) {
  const [activeAnchor, setActiveAnchor] = useState("")

  useEffect(() => {
    const onScroll = () => {
      const elems = document.querySelectorAll("h2[id],h3[id],h4[id]")
      if (elems.length === 0) {
        return
      }
      const activeIndex = Array.from(elems).findIndex(
        (x) => x.getBoundingClientRect().top - 150 > 0
      )
      const activeElem =
        activeIndex === 0
          ? elems[0]
          : activeIndex > 0
          ? elems[activeIndex - 1]
          : elems[elems.length - 1]
      setActiveAnchor(activeElem?.id || "")
    }
    document.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      document.removeEventListener("scroll", onScroll)
    }
  }, [activeAnchor])

  function createHeading(h: Heading) {
    const text = h.value.replace(/(<([^>]+)>)/gi, '');
    return (
      <li
        key={`post-toc-item-${h.id}`}
        className={`post-toc-item post-toc-item-depth-${h.depth - 1} ${
          styles[`depth${h.depth - 1}`]
        } ${h.id === activeAnchor ? "post-toc-item-active" : ""}`}
      >
        <AnchorLink to={`${props.page}#${h.id}`}>{text}</AnchorLink>
      </li>
    )
  }

  return (
    <div className={`post-toc ${styles.container}`}>
      <ul className={props.className || ""}>
        {props.headings.map((x) => createHeading(x))}
      </ul>
    </div>
  )
}
