import React from "react"
import { Link } from "gatsby"

import { tagNameToPageUrl } from "utils/tag"

import * as styles from "./index.module.css"

export default function TagList(props: { tags: string[] }) {
  // make unique
  const tags = [...new Set(props.tags)]

  return (
    <div className={`tag-list ${styles.container}`}>
      <ul itemProp="keywords" className={`tag-highlight-first`} role="list">
        {tags.map((tag) => (
          <Link
            key={`tag-${tag}`}
            to={tagNameToPageUrl(tag)}
            title={tag}
            className={`tag`}
            role="listitem"
          >
            {tag}
          </Link>
        ))}
      </ul>
    </div>
  )
}
