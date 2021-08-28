import { AnchorLink } from "gatsby-plugin-anchor-links";
import React from "react";
import * as styles from "./index.module.css"

type Heading = {
  id: string,
  value: string,
  depth: number,
}

type Props = {
  headings: Heading[],
  page?: string,
  className?: string,
};

export default function PostToc(props: Props) {

  function createHeading(h: Heading) {
    return (
      <li
        key={`post-toc-item-${h.id}`}
        className={`post-toc-item post-toc-item-depth-${h.depth - 1} ${styles[`depth${h.depth - 1}`]}`}
      >
        <AnchorLink to={`${props.page}#${h.id}`}>{h.value}</AnchorLink>
      </li>
    )
  }

  return (
    <div className={`post-toc ${styles.container}`}>
      <ul className={props.className || ''}>
        {props.headings.map(x => createHeading(x))}
      </ul>
    </div>
  );

}
