import React from "react";
import { Link } from "gatsby";
import { kebabCase } from "lodash";
import * as styles from "./index.module.css"

export default function TagList(props: { tags: string[] }) {

  return (
    <div className={`tag-list ${styles.container}`}>
      <ul itemProp="keywords">
        {props.tags.map(tag => (
          <li
            key={`tag-${tag}`}
            className="tag"
          >
            <Link to={`/tags/${kebabCase(tag)}`}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
  
}
