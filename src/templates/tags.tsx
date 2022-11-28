import React from "react"
import { graphql } from "gatsby"
import { PageContext as PageContextOrg } from "types/pagination"

import Layout from "components/layout"
import Seo from "components/seo"
import Paginator from "components/paginator"
import BreadcrumbList, { BreadcrumbListItem } from "components/breadcrumb-list"
import PostCardList from "components/post-card-list"
import { PostSummary } from "components/post-card"

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
}

type PageContext = PageContextOrg & {
  tagList: string[]
  basePath: string
}

type Props = {
  data: DataType
  pageContext: PageContext
  location: any
}

export default function TagPostList({ pageContext, data, location }: Props) {
  const { tagList, basePath, humanPageNumber } = pageContext
  const { edges } = data.allMarkdownRemark

  const { title } = data.site.siteMetadata

  const posts = edges.map((x) => x.node)

  const breadcrumb: BreadcrumbListItem[] = [
    { name: "ホーム", current: false, url: "/" },
    { name: "タグ一覧", current: false, url: "/tags/" },
    { name: tagList[0], current: humanPageNumber === 1, url: basePath },
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
          <Paginator pathPrefix={basePath} context={pageContext} />
          <PostCardList posts={posts} showAuthor={true} />
          <Paginator pathPrefix={basePath} context={pageContext} />
        </main>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!, $tagList: [String]) {
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
      filter: { frontmatter: { tags: { in: $tagList } } }
    ) {
      totalCount
      edges {
        node {
          ...PostSummary
        }
      }
    }
  }
`
