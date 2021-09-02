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

  const latestPosts = data.latestPosts.nodes;
  const latestPostIdList = latestPosts?.map(x => x.id)
  const topics1 = data.topics1.nodes?.filter(x => !latestPostIdList?.includes(x.id)).slice(0, 5)
  const topics2 = data.topics2.nodes?.filter(x => !latestPostIdList?.includes(x.id)).slice(0, 5)

  return (
    <Layout location={location} title={siteTitle}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="crossOrigin" />
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap" rel="stylesheet" />
      </Helmet>
      <Seo />
      <TopPageHero />
      {latestPosts
      ? (
        <div className="global-root-group">
          <div className="global-wrapper">
            <TopPageHeading title="最新記事" sub="Latest articles" />
            <div className={`featured-post-card-list`}>
              {latestPosts.map((post: PostSummary, n: number) =>
                <PostCard key={`post-card-${post.id}`} post={post} showDescription={n === 0} />)}
            </div>
          </div>
        </div>
      )
      : null}
      <div className="global-root-group">
        <div className="global-wrapper">
          <TopPageHeading title="Web" sub="Web related" />
          <div className={`featured-post-card-list`}>
            {topics1?.map((post: PostSummary, n: number) =>
              <PostCard post={post} showDescription={n === 0} />) || null}
          </div>
        </div>
        <div className="global-wrapper">
          <TopPageHeading title="AWS" sub="Amazon Web Service" />
          <div className={`featured-post-card-list`}>
            {topics2?.map((post: PostSummary, n: number) =>
              <PostCard post={post} showDescription={n === 0} />) || null}
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
      limit: 10
      filter: {frontmatter: {tags: {eq: "Web"}}}
    ) {
      nodes {
        ...PostSummary
      }
    }
    topics2: allMarkdownRemark (
      sort: {fields: frontmatter___date, order: DESC}
      limit: 10
      filter: {frontmatter: {tags: {eq: "AWS"}}}
    ) {
      nodes {
        ...PostSummary
      }
    }
  }
`
