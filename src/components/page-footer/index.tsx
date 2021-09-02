import * as React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql, Link } from "gatsby"

type Props = {
  logoImage?: any
}

export default function PageFooter(props: Props) {

  return (
    <div className={`page-footer`}>
      <div className={`page-footer-logo`}>
        { props.logoImage }
      </div>
      <div className={`page-footer-copyright`}>
          MSeeeeN © {new Date().getFullYear()}, MSEN Inc.
      </div>
    </div>
  )
}
