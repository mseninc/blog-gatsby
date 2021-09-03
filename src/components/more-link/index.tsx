import * as React from "react"
import { Link } from "gatsby"

type Props = {
  label?: string
  to: string
}

export default function MoreLink(props: Props) {
  const label = props.label || 'もっと見る'

  return (
    <Link to={props.to} className={`more-link`}>
      { label }
    </Link>
  )
}
