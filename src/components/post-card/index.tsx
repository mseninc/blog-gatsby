import React from "react";
import { graphql, Link } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";

type Post = {
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
  }
};

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {

  const image = post.frontmatter.avatarImage ? getImage(post.frontmatter.avatarImage) : null;
  return (
    <div className="post-card">
      <div className="post-title">
        <Link to={post.fields.slug}>
          {post.frontmatter.title}
        </Link>
      </div>
      <div className="post-description">{post.frontmatter.description || post.excerpt}</div>
      <div className="post-tags">{post.frontmatter.tags}</div>
      <div className="post-author">{post.frontmatter.author?.name}</div>
      { image
        ? <GatsbyImage
            image={image}
            className="bio-avatar"
            alt={post.frontmatter.author?.name || ''}
            />
        : null}
    </div>
  );
}

export const query = graphql`
  fragment PostSummary on MarkdownRemark {
    id
    excerpt(pruneLength: 80)
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
    }
  }
`
