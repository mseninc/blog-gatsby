const path = require("path")

const contentPath = path.resolve(process.env.CONTENT_PATH || "content")

console.debug(`CONTENT_PATH - ${contentPath}`)
console.debug(`PATH_PREFIX - ${process.env.PATH_PREFIX}`)
console.debug(`GA_TRACKING_ID - ${process.env.GA_TRACKING_ID}`)
console.debug(`S3_BUCKET_NAME - ${process.env.S3_BUCKET_NAME}`)
console.debug(`S3_REGION - ${process.env.S3_REGION}`)
console.debug(`S3_REMOVE_NONEXISTENT_OBJECTS - ${process.env.S3_REMOVE_NONEXISTENT_OBJECTS}`)

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
            return allMarkdownRemark.nodes.map((node) => {
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
      removeNonexistentObjects: process.env.S3_REMOVE_NONEXISTENT_OBJECTS,
      // https://gatsby-plugin-s3.jari.io/recipes/with-cloudfront/
      protocol: siteAddress.protocol.slice(0, -1),
      hostname: siteAddress.hostname,
    },
  },
]

if (process.env.GA_TRACKING_ID) {
  plugins.push({
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: process.env.GA_TRACKING_ID,
    },
  })
}

module.exports = {
  pathPrefix: process.env.PATH_PREFIX || undefined,
  siteMetadata: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteUrl: SITE_URL,
  },
  plugins,
  mapping: {
    "MarkdownRemark.frontmatter.author": `AuthorYaml`,
  },
}
