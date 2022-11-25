import React from "react"
import { graphql, Link } from "gatsby"
import { tagNameToPageUrl } from "utils/tag"
import Layout from "components/layout"
import Seo from "components/seo"
import BreadcrumbList, { BreadcrumbListItem } from "components/breadcrumb-list"

type DataType = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
  allMarkdownRemark: {
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

type TagObject = {
  tagName: string
  totalCount: number
}

export default function TagsPage(props: Props) {
  const {
    data: {
      allMarkdownRemark: { group },
    },
    location,
  } = props

  const tags = group.map(({ fieldValue: tagName, totalCount }) => ({
    tagName,
    totalCount,
  }))

  const grouped = tags.reduce((p, c) => {
    const firstChar = c.tagName.substring(0, 1)
    if (!p[firstChar]) {
      p[firstChar] = []
    }
    p[firstChar].push(c)
    return p
  }, {} as { [firstChar: string]: TagObject[] })

  const tagmap = Object.keys(grouped).map((firstChar) => {
    const tags = grouped[firstChar]
    tags.sort((a, b) => b.totalCount - a.totalCount)
    return (
      <div key={`tag-group-${firstChar}`} className={`tagmap-group`}>
        <h2 className={`tagmap-first-char`}>{firstChar}</h2>
        <div className={`tagmap-tag-container`}>
          {tags.map(({ tagName, totalCount }) => (
            <Link
              key={`tag-${tagName}`}
              to={tagNameToPageUrl(tagName)}
              title={tagName}
              className={`tag`}
              role="listitem"
            >
              {tagName}
              <small>{totalCount}</small>
            </Link>
          ))}
        </div>
      </div>
    )
  })

  const breadcrumb: BreadcrumbListItem[] = [
    { name: "ホーム", current: false, url: "/" },
    { name: "タグ一覧", current: true, url: "/tags/" },
  ]

  const title = `タグ一覧`
  const description = `${title} のタグ一覧です`
  return (
    <Layout location={location} title={title}>
      <Seo title={title} description={description} />
      <div className="full-wide-container">
        <BreadcrumbList items={breadcrumb} />
        <main>{tagmap}</main>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark(limit: 2000) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`
