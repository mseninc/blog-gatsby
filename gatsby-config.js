const path = require("path")
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const contentPath = path.resolve(process.env.CONTENT_PATH || "content")
const s3RemoveNonexistentObjects =
  `${process.env.S3_REMOVE_NONEXISTENT_OBJECTS}` === "true"

console.debug(`CONTENT_PATH - ${contentPath}`)
console.debug(`PATH_PREFIX - ${process.env.PATH_PREFIX}`)
console.debug(`GA_TRACKING_ID - ${process.env.GA_TRACKING_ID}`)
console.debug(`S3_BUCKET_NAME - ${process.env.S3_BUCKET_NAME}`)
console.debug(`S3_REGION - ${process.env.S3_REGION}`)
console.debug(`S3_REMOVE_NONEXISTENT_OBJECTS - ${s3RemoveNonexistentObjects}`)
console.debug(
  `GOOGLE_PROGRAMMABLE_SEARCH_URL - ${process.env.GOOGLE_PROGRAMMABLE_SEARCH_URL}`,
)

const {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  MANIFEST_BG_COLOR,
  MANIFEST_THEME_COLOR,
} = require("./site-config")

const siteAddress = new URL(SITE_URL)

const plugins = [
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
        `${contentPath}/.github/**/*`,
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
            showCaptions: true,
            markdownCaptions: true,
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
        "gatsby-remark-prismjs-title",
        {
          resolve: `gatsby-remark-prismjs`,
          options: {
            classPrefix: "language-",
            aliases: {
              "xaml": "xml",
              "sh": "bash",
              "ps": "powershell",
              "cmd": "batch",
            },
          },
        },
        `gatsby-remark-copy-linked-files`,
        `gatsby-remark-smartypants`,
        {
          resolve: `gatsby-remark-katex`,
          options: {
            // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
            strict: `ignore`,
          },
        },
      ],
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
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
      setup: (options) => ({
        ...options,
        custom_namespaces: { media: "http://search.yahoo.com/mrss/" },
      }),
      feeds: [
        {
          serialize: ({ query: { site, allMarkdownRemark } }) => {
            return allMarkdownRemark.nodes.map((node) => {
              return Object.assign({}, node.frontmatter, {
                description: node.excerpt,
                date: node.frontmatter.date,
                url: site.siteMetadata.siteUrl + node.fields.slug,
                guid: site.siteMetadata.siteUrl + node.fields.slug,
                custom_elements: [
                  {
                    "media:content": {
                      _attr: {
                        url:
                          site.siteMetadata.siteUrl +
                          node.fields.heroImage?.publicURL,
                        media: "image",
                      },
                    },
                  },
                ],
              })
            })
          },
          query: `
            {
              allMarkdownRemark(
                sort: { frontmatter: { date: DESC } },
                limit: 100
              ) {
                nodes {
                  excerpt
                  fields {
                    slug
                    heroImage {
                      publicURL
                    }
                  }
                  frontmatter {
                    title
                    date
                  }
                }
              }
            }
          `,
          title: SITE_NAME,
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
      offset: -100,
    },
  },
  // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.dev/offline
  // `gatsby-plugin-offline`,
  `gatsby-plugin-root-import`,
  `gatsby-plugin-typegen`,
  `gatsby-plugin-sitemap`,
  {
    resolve: `gatsby-plugin-s3`,
    options: {
      bucketName: process.env.S3_BUCKET_NAME || "msen-blog-preview",
      region: process.env.S3_REGION || "ap-northeast-1",
      acl: null,
      removeNonexistentObjects: s3RemoveNonexistentObjects,
      // https://gatsby-plugin-s3.jari.io/recipes/with-cloudfront/
      protocol: siteAddress.protocol.slice(0, -1),
      hostname: siteAddress.hostname,
    },
  },
]

if (process.env.GA_TRACKING_ID) {
  plugins.push({
    resolve: `gatsby-plugin-google-gtag`,
    options: {
      trackingIds: [
        process.env.GA_TRACKING_ID, // Google Analytics / GA
      ],
      pluginConfig: {
        head: true,
      },
    },
  })
}

module.exports = {
  pathPrefix: process.env.PATH_PREFIX || undefined,
  siteMetadata: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteUrl: SITE_URL,
    googleProgrammableSearchUrl:
      process.env.GOOGLE_PROGRAMMABLE_SEARCH_URL || "",
  },
  plugins,
}
