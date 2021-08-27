import React from "react";
import { graphql, Link } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";

export type PostSummary = {
  id: string
  excerpt?: string
  frontmatter: {
    title: string
    date: string
    description?: string
    tags: string
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
};

export const query = graphql`
  fragment PostSummary on MarkdownRemark {
    id
    excerpt(pruneLength: 120)
    frontmatter {
      title
      date(formatString: "YYYY/MM/DD")
      description
      tags
      author {
        id
        name
      }
      avatarImage {
        childImageSharp {
          gatsbyImageData(width: 50, height: 50, layout: FIXED)
        }
      }
    }
    fields {
      slug
      heroImage {
        childImageSharp {
          gatsbyImageData(width: 320, layout: CONSTRAINED)
        }
      }
    }
  }
`

export default function PostCard({ post }: Props) {

  const heroImage = post.fields.heroImage ? getImage(post.fields.heroImage) : null;
  const avatarImage = post.frontmatter.avatarImage ? getImage(post.frontmatter.avatarImage) : null;
  return (
    <div className="post-card">
      <div className="post-hero">
        { heroImage
          ? <GatsbyImage
              image={heroImage}
              alt={post.frontmatter.title}
              />
          : null}
      </div>
      <div className="post-title">
        <Link to={post.fields.slug}>
          {post.frontmatter.title}
        </Link>
      </div>
      <div className="post-description">{post.frontmatter.description || post.excerpt}</div>
      <div className="post-tags">{post.frontmatter.tags}</div>
      <div className="post-author">
        { avatarImage
          ? <GatsbyImage
              image={avatarImage}
              className="bio-avatar"
              alt={post.frontmatter.author?.name || ''}
              />
          : null}
        {post.frontmatter.author?.name}
      </div>
    </div>
  );
}
