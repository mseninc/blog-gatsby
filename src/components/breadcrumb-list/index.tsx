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
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem">
        {!item.current && item.url
          ? <a
            itemProp="item"
            href={item.url}
            itemScope itemType="https://schema.org/WebPage"
            itemID={item.url}
          >
            <span itemProp="name">{item.name}</span>
          </a>
          : <span itemProp="name">{item.name}</span>
        }
        <meta itemProp="position" content={`${position}`} />
      </li>
    );
  }
  return (
    <div className={styles.breadcrumbList}>
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        {props.items.map((x, i) => createListItem(x, i + 1))}
      </ol>
    </div>
  );
}
