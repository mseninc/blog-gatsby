import React from "react"
import { graphql } from "gatsby"
import { PageContext as PageContextOrg } from "types/pagination"

import Layout from "components/layout"
import Seo from "components/seo"
import Paginator from "components/paginator"
import BreadcrumbList, { BreadcrumbListItem } from "components/breadcrumb-list"
import PostCardList from "components/post-card-list"
import { PostSummary } from "components/post-card"
import Bio from "components/bio"

type DataType = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
  allMarkdownRemark: {
    totalCount: number
    edges: { node: PostSummary }[]
  }
  allAuthorYaml: {
    nodes: {
      name: string
      github: string
      bio: string
    }[]
  }
}

type PageContext = PageContextOrg & {
  author: string // github name
  basePath: string
}

type Props = {
  data: DataType
  pageContext: PageContext
  location: any
}

export default function AuthorPostList({ pageContext, data, location }: Props) {
  const { author: github, basePath, humanPageNumber } = pageContext
  const { edges } = data.allMarkdownRemark
  const { nodes: authors } = data.allAuthorYaml

  const { title } = data.site.siteMetadata

  const posts = edges.map((x) => x.node)

  if (authors.length !== 1) {
    throw new Error(`Author info for "${github}" not found`)
    
  }
  const author = authors[0]
  const avatarImage = posts[0].avatarImage!

  const breadcrumb: BreadcrumbListItem[] = [
    { name: "ホーム", current: false, url: "/" },
    { name: "著者一覧", current: false, url: "/authors/" },
    { name: author.name, current: humanPageNumber === 1, url: basePath },
  ]
  if (humanPageNumber !== 1) {
    breadcrumb.push({ name: `${humanPageNumber} ページ`, current: true })
  }

  return (
    <Layout location={location} title={title}>
      <Seo title={title} description={data.site.siteMetadata?.description} />
      <div className="full-wide-container">
        <BreadcrumbList items={breadcrumb} />
        <main>
          <div className="author-bio">
            <Bio
              github={author.github}
              name={author.name}
              bio={author.bio}
              avatarImage={avatarImage}
              />
          </div>
          <Paginator pathPrefix={basePath} context={pageContext} />
          <PostCardList posts={posts} />
          <Paginator pathPrefix={basePath} context={pageContext} />
        </main>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!, $author: String) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { author: { github: { eq: $author } } } }
    ) {
      totalCount
      edges {
        node {
          ...PostSummary
        }
      }
    }
    allAuthorYaml(limit: 1, filter: { github: { eq: $author } }) {
      nodes {
        github
        name
        bio
      }
    }
  }
`
