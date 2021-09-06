const CONTENT_PATH = process.env.CONTENT_PATH

if (!CONTENT_PATH) {
  throw Error('CONTENT_PATH not provided. Specify the blog contents via CONTENT_PATH environment variable')
}

module.exports = {
  pathPrefix: process.env.PATH_PREFIX || undefined,
  siteMetadata: {
    title: `MSeeeeN`,
    description: `大阪発 IT メディア by MSEN`,
    siteUrl: `https://mseeeen.msen.jp/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://mseeeen.msen.jp/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${CONTENT_PATH}`,
        name: `blog`,
        ignore: [
          `${CONTENT_PATH}/*.md`,
          `${CONTENT_PATH}/.draft/**/*`,
          `${CONTENT_PATH}/.generator/**/*`,
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-autolink-headers`,
          'gatsby-remark-prismjs-title',
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              aliases: {
                'xaml': 'xml',
                'sh': 'bash',
                'ps': 'powershell',
              },
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  limit: 100
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `MSeeeeN`,
        short_name: `MSeeeeN`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/mseeeen-logo-square.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-gatsby-cloud`,
    {
      resolve: "gatsby-plugin-anchor-links",
      options: {
        offset: -100
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-root-import`,
    `gatsby-plugin-typegen`,
    `gatsby-plugin-sitemap`,
  ],
  mapping: {
    "MarkdownRemark.frontmatter.author": `AuthorYaml`,
  },
}
