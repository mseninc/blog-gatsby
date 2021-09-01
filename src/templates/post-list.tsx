import * as React from "react"
import { graphql } from "gatsby"

import Layout from "components/layout"
import Seo from "components/seo"

import PostCardList from "components/post-card-list"
import { PostSummary } from "components/post-card"
import { PageContext } from "types/pagination"
import Paginator from "components/paginator"

type DataType = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
  allMarkdownRemark: {
    nodes: PostSummary[]
  }
};

type Props = {
  data: DataType
  pageContext: PageContext
  location: any
};

export default function PostListTemplate({ data, location, pageContext }: Props) {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={siteTitle}
        description={data.site.siteMetadata?.description}
      />
      <div className="full-wide-container">
        <main>
          <Paginator pathPrefix='/posts' context={pageContext} />
          <PostCardList posts={data.allMarkdownRemark.nodes} />
          <Paginator pathPrefix='/posts' context={pageContext} />
        </main>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
      ) {
      nodes {
        id
        excerpt(pruneLength: 120)
        frontmatter {
          title
          date(formatString: "YYYY/MM/DD")
          description
          tags
          author {
            name
          }
          avatarImage {
            childImageSharp {
              gatsbyImageData(width: 25, height: 25, layout: FIXED)
            }
          }
        }
        fields {
          slug
          heroImage {
            childImageSharp {
              gatsbyImageData(width: 320, height: 200, layout: CONSTRAINED)
            }
          }
        }
      }
    }
  }
`
