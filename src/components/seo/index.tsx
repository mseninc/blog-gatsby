import * as React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

type Props = {
  description?: string
  lang?: string
  meta?: any[]
  title?: string
  keywords?: string[]
  imageUrl?: string
}

export default function Seo({
  description,
  lang,
  meta,
  title,
  keywords,
  imageUrl,
}: Props) {
  const { site, ogpDefaultImage } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }
        ogpDefaultImage: file(name: { eq: "mseeeen-ogp-image-1200x630" }) {
          publicURL
          name
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = `${site.siteMetadata?.title} | ${site.siteMetadata.description}`
  const absoluteImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : site.siteMetadata.siteUrl + imageUrl
    : site.siteMetadata.siteUrl + ogpDefaultImage.publicURL

  return (
    <Helmet
      htmlAttributes={{
        lang: lang || "ja",
      }}
      title={title || defaultTitle}
      titleTemplate={
        title && defaultTitle ? `%s | ${site.siteMetadata?.title}` : undefined
      }
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `keywords`,
          content: keywords?.join(","),
          itemprop: "keywords",
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: absoluteImageUrl,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta || [])}
    />
  )
}
