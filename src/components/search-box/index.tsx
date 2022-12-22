import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import { Helmet } from "react-helmet"

type DataType = {
  site: {
    siteMetadata: {
      googleProgrammableSearchUrl: string
    }
  }
}

export default function SearchBox() {
  const data = useStaticQuery<DataType>(graphql`
    query SearchBoxQuery {
      site {
        siteMetadata {
          googleProgrammableSearchUrl
        }
      }
    }
  `)

  return data.site.siteMetadata.googleProgrammableSearchUrl ? (
    <>
      <Helmet>
        <script
          async
          src={data.site.siteMetadata.googleProgrammableSearchUrl}
        />
      </Helmet>
      <div className="gcse-search"></div>
    </>
  ) : null
}
