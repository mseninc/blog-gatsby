import * as React from "react"
import { graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "components/layout"
import Seo from "components/seo"

type DataType = {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

type Props = {
  data: DataType
  location: { pathname: string }
}

const NotFoundPage = ({ data, location }: Props) => {
  const siteTitle = data.site.siteMetadata.title
  const { pathname } = location;

  return (
    <>
      <Seo title="404" />
      <div className="error-page">
        <div className="error-content">
          <div className="error-page-logo-image">
            <StaticImage
              src="../images/mseeeen-logo-square.png"
              width={320}
              height={320}
              layout="fixed"
              placeholder="none"
              alt=""
            />
          </div>
          <div className="error-page-info">
            <h1>404</h1>
            <div className="error-page-message">Page not found</div>
            <Link to='/' className="error-page-link-button button">Go to Home page</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
