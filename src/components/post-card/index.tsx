import React from "react";
import { graphql, Link } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";

import AuthorLink from "components/author-link";
import TagList from "components/tag-list";

import * as styles from "./index.module.css"

export type PostSummary = {
  id: string
  excerpt?: string
  frontmatter: {
    title: string
    date: string
    description?: string
    tags: string[]
    author?: {
      id: string
      name: string
    }
    avatarImage?: IGatsbyImageData
  }
  fields: {
    slug: string
    heroImage?: IGatsbyImageData
  }
};

type Props = {
  post: PostSummary;
  showDescription?: boolean
};

export const query = graphql`
  fragment PostSummary on MarkdownRemark {
    id
    excerpt(pruneLength: 160)
    frontmatter {
      title
      date(formatString: "YYYY.MM.DD")
      description
      tags
      author {
        id
        name
      }
      avatarImage {
        childImageSharp {
          gatsbyImageData(width: 25, height: 25, layout: FIXED)
        }
      }
    }
    fields {
      slug
      heroImage {
        childImageSharp {
          gatsbyImageData(width: 400, height: 240, layout: CONSTRAINED)
        }
      }
    }
  }
`

export default function PostCard({ post, showDescription }: Props) {

  const heroImage = post.fields.heroImage ? getImage(post.fields.heroImage) : null;
  const avatarImage = post.frontmatter.avatarImage ? getImage(post.frontmatter.avatarImage) : null;
  const description = showDescription
    ? post.frontmatter.description || post.excerpt
    : null
  return (
    <div className="post-card">
      <div className="post-card-hero">
        <Link to={post.fields.slug}>
          { heroImage
            ? <GatsbyImage
                image={heroImage}
                alt={post.frontmatter.title}
                />
            : <div className={`post-hero-placeholder ${styles.postHeroPlaceholder}`}>
                <span>{post.frontmatter.tags?.[0] || post.frontmatter.author?.id || ''}</span>
              </div>
          }
        </Link>
      </div>
      <div className="post-card-title">
        <Link to={post.fields.slug}>
          {post.frontmatter.title}
        </Link>
      </div>
      {
        post.frontmatter.tags?.length
        ? <div className="post-card-tags">{<TagList tags={post.frontmatter.tags} />}</div>
        : null
      }
      {
        showDescription
        ? <div className="post-card-description">{description}</div>
        : null
      }
      <div className="post-card-footer">
      <div className="post-card-date">
          { post.frontmatter.date }
        </div>
        <div className="post-card-author">
          { avatarImage && post.frontmatter.author
            ? <AuthorLink
                name={post.frontmatter.author.name}
                github={post.frontmatter.author.id}
                avatarImage={avatarImage}
                reverse={true}
                />
            : null}
        </div>
      </div>
    </div>
  );
}
