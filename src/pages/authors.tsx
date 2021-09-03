import React from "react"
import Seo from "../components/seo";
import { Link, graphql } from "gatsby"

type Author = {
  id: string;
  name: string;
  bio: string;
}

type Props = {
  data: {
    allAuthorYaml: {
      edges: { node: Author }[]
    },
    site: {
      siteMetadata: { title: string },
    },
  }
}

export default function AuthorsPage(props: Props) {
  const { edges } = props.data.allAuthorYaml;
  const authors: Author[] = edges?.map((x: any) => x.node);
  const { title } = props.data.site.siteMetadata;

  return (
    <div>
      <Seo title={`著者一覧`} />
      <div>
        <h1>著者</h1>
        <ul>
          {authors.map(author => (
            <li key={author.id}>
              <Link to={`/authors/${author.id}/`}>
                {author.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allAuthorYaml {
      edges {
        node {
          id
          name
          bio
        }
      }
    }
  }
`
