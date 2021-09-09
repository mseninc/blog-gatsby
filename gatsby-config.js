const path = require('path')

const contentPath = path.resolve(process.env.CONTENT_PATH || 'content')

console.debug(`Content path - ${contentPath}`)
console.debug(`Path prefix - ${process.env.PATH_PREFIX}`)

const {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  MANIFEST_BG_COLOR,
  MANIFEST_THEME_COLOR,
  GA_TRACKING_ID,
} = require('./site-config')

module.exports = {
  pathPrefix: process.env.PATH_PREFIX || undefined,
  siteMetadata: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteUrl: SITE_URL,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: SITE_URL,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: contentPath,
        name: `blog`,
        ignore: [
          `${contentPath}/*.md`,
          `${contentPath}/.draft/**/*`,
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
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: GA_TRACKING_ID,
      },
    },
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
        name: SITE_NAME,
        short_name: SITE_NAME,
        start_url: `/`,
        background_color: MANIFEST_BG_COLOR,
        theme_color: MANIFEST_THEME_COLOR,
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
