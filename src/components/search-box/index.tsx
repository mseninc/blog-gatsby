import { graphql, useStaticQuery } from "gatsby"
import React, { useEffect } from "react"
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

  useEffect(() => {
    const timeoutId = setInterval(() => {
      const input = document.querySelector<HTMLInputElement>(
        ".gsc-input-box input[type=text]"
      )
      if (input) {
        input.placeholder = "ここから記事を検索できます"
        clearInterval(timeoutId)
      }
    }, 250)
    return () => clearInterval(timeoutId)
  }, [])

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
