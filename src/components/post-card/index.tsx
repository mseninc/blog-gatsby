import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { getImage, GatsbyImage } from "gatsby-plugin-image";

type Props = {
  id: string;
}

export default function PostCard({ id }: Props) {

  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        edges {
          node {
            id
            excerpt(pruneLength: 80, truncate: true)
            frontmatter {
              title
              date(formatString: "YYYY-MM-DD")
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
        }
      }
    }
  `);

  const { node: post } = data.allMarkdownRemark.edges.find((x: any) => x.node.id === id);
  const image = getImage(post.frontmatter.avatarImage);
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
            alt={post.frontmatter.author?.name}
            />
        : null}
    </div>
  );
}
