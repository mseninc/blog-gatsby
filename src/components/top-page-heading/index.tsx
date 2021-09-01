import React from "react";

type Props = {
  title: string
  sub: string
}

export default function TopPageHeading(props: Props) {
  const { title, sub } = props;

  return (
    <h2 className={`top-page-heading`}>
      <strong>{title}</strong>
      <small>{sub}</small>
    </h2>
  )
}
