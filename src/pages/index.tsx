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
  allMarkdownRemark: {
    nodes?: PostSummary[]
  }
};

type Props = {
  data: DataType
  location: { pathname: string }
};

const BlogIndex = ({ data, location }: Props) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <ol style={{ listStyle: `none` }}>
        {posts?.map((post: PostSummary) => <PostCard post={post} />) || null}
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        ...PostSummary
      }
    }
  }
`
