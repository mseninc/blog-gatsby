import * as React from "react"
import { graphql } from "gatsby"

import PostCard, { PostSummary } from "../components/post-card";
import Layout from "../components/layout";
import Seo from "../components/seo";

type DataType = {
  site: {
    siteMetadata: {
      title: string
    }
  }
  topics1: {
    nodes?: PostSummary[]
  }
  topics2: {
    nodes?: PostSummary[]
  }
};

type Props = {
  data: DataType
  location: { pathname: string }
};

const BlogIndex = ({ data, location }: Props) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <ol style={{ listStyle: `none` }}>
        {data.topics1.nodes?.map((post: PostSummary) => <PostCard post={post} />) || null}
      </ol>
      <hr/>
      <ol style={{ listStyle: `none` }}>
        {data.topics2.nodes?.map((post: PostSummary) => <PostCard post={post} />) || null}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    topics1: allMarkdownRemark (
      sort: {fields: frontmatter___date, order: DESC}
      limit: 5
      filter: {frontmatter: {tags: {eq: "Web"}}}
    ) {
      nodes {
        ...PostSummary
      }
    }
    topics2: allMarkdownRemark (
      sort: {fields: frontmatter___date, order: DESC}
      limit: 5
      filter: {frontmatter: {tags: {eq: "AWS"}}}
    ) {
      nodes {
        ...PostSummary
      }
    }
  }
`
