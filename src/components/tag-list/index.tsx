import React from "react";
import { Link } from "gatsby";
import { kebabCase } from "lodash";

export default function TagList(props: { tags: string[] }) {

  return (
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
  );
  
}
