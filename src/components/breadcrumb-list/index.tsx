import { Link } from "gatsby";
import React from "react";
import * as styles from "./index.module.css"

export type BreadcrumbListItem = {
  url?: string
  name: string
  current: boolean
}

type Props = {
  items: BreadcrumbListItem[]
}

export default function BreadcrumbList(props: Props) {

  function createListItem(item: BreadcrumbListItem, position: number) {
    return (
      <li
        key={`breadcrumb-list-item-${position}`}
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem">
        {!item.current && item.url
          ? <Link
              itemProp="item"
              to={item.url}
              itemScope itemType="https://schema.org/WebPage"
              itemID={item.url}
            >
            <span itemProp="name">{item.name}</span>
          </Link>
          : <span itemProp="name">{item.name}</span>
        }
        <meta itemProp="position" content={`${position}`} />
      </li>
    );
  }
  return (
    <div className={`breadcrumb-list ${styles.breadcrumbList}`}>
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        {props.items.map((x, i) => createListItem(x, i + 1))}
      </ol>
    </div>
  );
}
