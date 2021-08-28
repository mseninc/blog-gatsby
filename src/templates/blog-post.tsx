import * as React from "react"
import { Link, graphql } from "gatsby"
import TagList from "components/tag-list"

import Bio from "components/bio"
import Layout from "components/layout"
import Seo from "components/seo"
import PostToc from "components/post-toc"
import { IGatsbyImageData } from "gatsby-plugin-image"
import BreadcrumbList, { BreadcrumbListItem } from "components/breadcrumb-list"
import { tagNameToPageUrl } from "utils/tag"
import AuthorLink from "components/author-link"

import './blog-post.css'

type DataType = {
  site: {
    siteMetadata: {
      title: string
    }
  }
  markdownRemark: {
    id: string
    excerpt: string
    html: string
    frontmatter: {
      title: string
      date: string
      description: string
      tags: string[]
      author: {
        id: string
        name: string
        bio: string
      }
      avatarImage: IGatsbyImageData
      avatarImage25: IGatsbyImageData
    }
    headings: {
      depth: number
      id: string
      value: string
    }[]
    fields: {
      slug: string
    }
  }
  previous: {
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
    }
  }
  next: {
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
    }
  }
};

type Props = {
  data: DataType
  location: any
};

export default function BlogPostTemplate({ data, location }: Props) {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data

  const tags = post.frontmatter.tags;
  const tagList = tags ? <TagList tags={tags} /> : null;

  const author = post.frontmatter.author;
  const authorLink = author
    ? <AuthorLink
        github={author.id}
        name={author.name}
        avatarImage={post.frontmatter.avatarImage25}
        />
    : null;
  const bio = author
    ? <Bio
        github={author.id}
        name={author.name}
        bio={author.bio}
        avatarImage={post.frontmatter.avatarImage}
        />
    : null;

  const { headings } = post;
  const toc = headings?.length > 0
    ? <PostToc headings={headings} page={post.fields.slug} />
    : null;

  const breadcrumb: BreadcrumbListItem[] = [
    { name: 'ホーム', current: false },
    { name: post.frontmatter.title, current: true },
  ]

  if (tags?.length) {
    breadcrumb.splice(1, 0, { name: tags[0], url: tagNameToPageUrl(tags[0]), current: false });
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        keywords={tags}
      />
      <div className="main-container">
        <BreadcrumbList items={breadcrumb} />
        <main>
          <article
            itemScope
            itemType="http://schema.org/Article"
          >
            <header>
              {tagList}
              <h1 itemProp="headline">{post.frontmatter.title}</h1>
              <div className="header-meta">
                <div className="post-date">{post.frontmatter.date}</div>
                {authorLink}
              </div>
            </header>
            <section
              dangerouslySetInnerHTML={{ __html: post.html }}
              itemProp="articleBody"
            />
            <hr />
            <footer>
              {bio}
            </footer>
          </article>
        </main>
        <aside className="sidebar">
          {toc}
        </aside>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
        description
        tags
        author {
          id
          name
          bio
        }
        avatarImage {
          childImageSharp {
            gatsbyImageData(width: 50, height: 50, layout: FIXED)
          }
        }
        avatarImage25: avatarImage {
          childImageSharp {
            gatsbyImageData(width: 25, height: 25, layout: FIXED)
          }
        }
      }
      headings {
        depth
        id
        value
      }
      fields {
        slug
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
