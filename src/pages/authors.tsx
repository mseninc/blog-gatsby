import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "components/layout"
import Seo from "components/seo"
import BreadcrumbList, { BreadcrumbListItem } from "components/breadcrumb-list"
import { IGatsbyImageData } from "gatsby-plugin-image"
import Bio from "components/bio"

type DataType = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
  allAuthorYaml: {
    nodes: {
      github: string
      name: string
      bio: string
      avatarImage: IGatsbyImageData
    }[]
  }
  authorPostCounts: {
    group: {
      fieldValue: string
      totalCount: number
    }[]
  }
}

type Props = {
  data: DataType
  location: any
}

export default function Page(props: Props) {
  const {
    data: {
      allAuthorYaml: { nodes: authors },
      authorPostCounts: { group: postCounts },
    },
    location,
  } = props

  const authorElements = authors.map((author) => {
    const postCount = postCounts.find((x) => x.fieldValue === author.github)
    return (
      <div className="author-bio">
        <Bio
          github={author.github}
          name={author.name}
          bio={author.bio}
          avatarImage={author.avatarImage}
          postCount={postCount ? postCount.totalCount : 0}
          showLinks={true}
        />
      </div>
    )
  })

  const breadcrumb: BreadcrumbListItem[] = [
    { name: "ホーム", current: false, url: "/" },
    { name: "著者一覧", current: true, url: "/authors/" },
  ]

  const title = `著者一覧`
  const description = `${title} の著者一覧です`
  return (
    <Layout location={location} title={title}>
      <Seo title={title} description={description} />
      <div className="full-wide-container">
        <BreadcrumbList items={breadcrumb} />
        <main className="authors">{authorElements}</main>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    allAuthorYaml {
      nodes {
        github
        name
        bio
        avatarImage {
          childImageSharp {
            gatsbyImageData(width: 50, height: 50, layout: FIXED)
          }
        }
      }
    }
    authorPostCounts: allMarkdownRemark(limit: 2000) {
      group(field: { frontmatter: { author: { github: SELECT } } }) {
        fieldValue
        totalCount
      }
    }
  }
`
