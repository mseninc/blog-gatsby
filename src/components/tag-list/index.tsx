import React from "react";
import { Link } from "gatsby";

import { tagNameToPageUrl } from "utils/tag";

import * as styles from "./index.module.css"

export default function TagList(props: { tags: string[] }) {

  // make unique
  const tags = [...new Set(props.tags)]

  return (
    <div className={`tag-list ${styles.container}`}>
      <ul itemProp="keywords">
        {tags.map(tag => (
          <li
            key={`tag-${tag}`}
            className="tag"
          >
            <Link to={tagNameToPageUrl(tag)} title={tag}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
  
}
