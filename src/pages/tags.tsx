import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "components/layout"
import Seo from "components/seo"
import BreadcrumbList, { BreadcrumbListItem } from "components/breadcrumb-list"
import { tagNameToPageUrl } from "utils/tag"
import "styles/tag-list-page.css"

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
};

type Props = {
  data: DataType
};

type TagObject = {
  tagName: string
  totalCount: number
}

export default function TagsPage(props: Props) {
  const {
    data: {
      site: {
        siteMetadata: {
          title,
          description,
        },
      },
      allMarkdownRemark: { group },
    },
  } = props;

  const tags = group.map(({ fieldValue: tagName, totalCount }) =>
    ({ tagName, totalCount }))
  
  const grouped = tags.reduce((p, c) => {
    const firstChar = c.tagName.substring(0, 1)
    if (!p[firstChar]) {
      p[firstChar] = []
    }
    p[firstChar].push(c)
    return p
  }, {} as { [firstChar: string]: TagObject[] })

  const tagmap = (Object.keys(grouped).map(firstChar => {
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
  }))

  const breadcrumb: BreadcrumbListItem[] = [
    { name: 'ホーム', current: false },
    { name: 'タグ索引', current: true, url: '/tags/' },
  ]

  const siteTitle = `タグ索引 | ${title}`
  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={siteTitle}
        description={description}
      />
      <div className="full-wide-container">
        <BreadcrumbList items={breadcrumb} />
        <main>
          {tagmap}
        </main>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
