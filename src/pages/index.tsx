import * as React from "react"
import { graphql } from "gatsby"

import PostCard, { PostSummary } from "components/post-card";
import Layout from "components/layout";
import Seo from "components/seo";
import TopPageHeading from "components/top-page-heading";
import TopPageHero from "components/top-page-hero";
import { Helmet } from "react-helmet";

type DataType = {
  site: {
    siteMetadata: {
      title: string
    }
  }
  latestPosts: {
    nodes?: PostSummary[]
  }
  topics1: {
    nodes?: PostSummary[]
  }
  topics2: {
    nodes?: PostSummary[]
  }
}

type Props = {
  data: DataType
  location: { pathname: string }
};

export default function BlogIndex({ data, location }: Props) {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="crossOrigin" />
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap" rel="stylesheet" />
      </Helmet>
      <Seo />
      <TopPageHero />
      {data.latestPosts.nodes
      ? (
        <div className="global-root-group">
          <div className="global-wrapper">
            <TopPageHeading title="最新記事" sub="Latest articles" />
            <div className={`featured-post-card-list`}>
              {data.latestPosts.nodes.map((post: PostSummary) => <PostCard key={`post-card-${post.id}`} post={post} />)}
            </div>
          </div>
        </div>
      )
      : null}
      <div className="global-root-group">
        <div className="global-wrapper">
          <TopPageHeading title="Web" sub="Web related" />
          <div className={`featured-post-card-list`}>
            {data.topics1.nodes?.map((post: PostSummary) => <PostCard post={post} />) || null}
          </div>
        </div>
        <div className="global-wrapper">
          <TopPageHeading title="AWS" sub="Amazon Web Service" />
          <div className={`featured-post-card-list`}>
            {data.topics2.nodes?.map((post: PostSummary) => <PostCard post={post} />) || null}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    latestPosts: allMarkdownRemark (
      sort: {fields: frontmatter___date, order: DESC}
      limit: 5
    ) {
      nodes {
        ...PostSummary
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
