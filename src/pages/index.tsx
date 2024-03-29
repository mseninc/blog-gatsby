import { graphql } from "gatsby"
import * as React from "react"

import ClientOnly from "components/client-only"
import Layout from "components/layout"
import MoreLink from "components/more-link"
import PostCard, { PostSummary } from "components/post-card"
import SearchBox from "components/search-box"
import Seo from "components/seo"
import TopPageHeading from "components/top-page-heading"
import TopPageHero from "components/top-page-hero"
import WebFont from "components/web-font"
import { tagNameToPageUrl } from "utils/tag"

const featuredTags = [
  { name: "AWS", sub: "Amazon Web Services" },
  { name: "Web", sub: "Web realted technologies" },
  { name: "仮想化技術", sub: "Virtualization" },
  { name: "Linux", sub: "Amazon Linux, CentOS, Ubuntu..." },
  { name: ".NET", sub: ".NET, .NET Framework, C#, VB.NET..." },
  { name: "Windows", sub: "Windows Server, Windows 10" },
]

type DataType = {
  site: {
    siteMetadata: {
      title: string
    }
  }
  latestPosts: {
    nodes?: PostSummary[]
  }
} & {
  [topicKey: string]: { nodes?: PostSummary[] }
}

type Props = {
  data: DataType
  location: { pathname: string }
}

export default function BlogIndex({ data, location }: Props) {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const latestPostIdList = data.latestPosts.nodes?.map((x) => x.id)

  const latestPosts = data.latestPosts.nodes ? (
    <div className="global-root-group">
      <div className="global-wrapper">
        <TopPageHeading title="最新記事" sub="Latest articles" />
        <div className={`featured-post-card-list`}>
          {data.latestPosts.nodes.map((post: PostSummary, n: number) => (
            <PostCard
              key={`post-card-${post.id}`}
              post={post}
              showDescription={true}
              showAuthor={true}
            />
          ))}
        </div>
        <MoreLink to="/posts/" />
      </div>
    </div>
  ) : null

  const featuredTagPostLists = featuredTags.map((tag, i) => {
    const posts = data[`topics${i + 1}`].nodes
      ?.filter((x) => !latestPostIdList?.includes(x.id))
      .slice(0, 5)
    if (!posts) {
      return null
    }
    const url = tagNameToPageUrl(tag.name)
    return (
      <div key={`featured-post-${i}`} className="global-root-group">
        <div className="global-wrapper">
          <TopPageHeading title={tag.name} sub={tag.sub} />
          <div className={`featured-post-card-list`}>
            {posts?.map((post: PostSummary, n: number) => (
              <PostCard
                key={`post-${post.id}`}
                post={post}
                showDescription={true}
                showAuthor={true}
              />
            )) || null}
          </div>
          <MoreLink to={url} />
        </div>
      </div>
    )
  })

  return (
    <Layout location={location} title={siteTitle}>
      <WebFont />
      <Seo />
      <TopPageHero />
      <div className="global-root-group search-group">
        <div className="global-wrapper">
          <ClientOnly>
            <SearchBox />
          </ClientOnly>
        </div>
      </div>
      {latestPosts}
      {featuredTagPostLists}
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
    latestPosts: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 5
    ) {
      nodes {
        ...PostSummary
      }
    }
    topics1: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 10
      filter: { frontmatter: { tags: { eq: "AWS" } } }
    ) {
      nodes {
        ...PostSummary
      }
    }
    topics2: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 10
      filter: { frontmatter: { tags: { eq: "Web" } } }
    ) {
      nodes {
        ...PostSummary
      }
    }
    topics3: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 10
      filter: { frontmatter: { tags: { eq: "仮想化技術" } } }
    ) {
      nodes {
        ...PostSummary
      }
    }
    topics4: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 10
      filter: { frontmatter: { tags: { eq: "Linux" } } }
    ) {
      nodes {
        ...PostSummary
      }
    }
    topics5: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 10
      filter: { frontmatter: { tags: { eq: ".NET" } } }
    ) {
      nodes {
        ...PostSummary
      }
    }
    topics6: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 10
      filter: { frontmatter: { tags: { eq: "Windows" } } }
    ) {
      nodes {
        ...PostSummary
      }
    }
  }
`
