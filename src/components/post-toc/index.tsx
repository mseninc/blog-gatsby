import { AnchorLink } from "gatsby-plugin-anchor-links";
import React from "react";

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
        className={`post-toc-item post-toc-item-depth-${h.depth}`}
      >
        <AnchorLink to={`${props.page}#${h.id}`}>{h.value}</AnchorLink>
      </li>
    )
  }

  return (
    <ul className={`post-toc ${props.className || ''}`}>
      {props.headings.map(x => createHeading(x))}
    </ul>
  );

}
