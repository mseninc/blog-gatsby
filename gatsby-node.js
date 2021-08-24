const path = require(`path`)
const _ = require("lodash")
const { createFilePath, createRemoteFileNode } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const tagTemplate = path.resolve("src/templates/tags.tsx")

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
        tagsGroup: allMarkdownRemark(limit: 2000) {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    function getDuplicateSlugs(posts) {
      const counts = posts.reduce(
        (p, c) => ({ ...p, [c.fields.slug]: (p[c.fields.slug] || 0) + 1 }), {});
      const duplicates = Object.keys(counts).filter(x => counts[x] > 1);
      return duplicates.length > 0 ? duplicates : null;
    }
    const duplicateSlugs = getDuplicateSlugs(posts);
    if (duplicateSlugs) {
      reporter.panicOnBuild(
        `Duplicate slugs detected`,
        { duplicateSlugs }
      )
    }
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
    

    // Extract tag data from query
    const tags = result.data.tagsGroup.group
    
    // Make tag pages
    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
        component: tagTemplate,
        context: {
          tag: tag.fieldValue,
        },
      })
    })
  }
}

exports.onCreateNode = async ({
  node,
  actions,
  getNode,
  store,
  cache,
  createNodeId,
}) => {
  const { createNode, createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })

    const value = slug.match(/([^/]+)\/$/)
      ? `/${RegExp.$1}/`
      : slug;

    createNodeField({
      name: `slug`,
      node,
      value,
    })

    if (node.frontmatter.author) {
      const url = `https://avatars.githubusercontent.com/${node.frontmatter.author}`;
      // https://www.gatsbyjs.com/docs/how-to/images-and-media/preprocessing-external-images/
      const fileNode = await createRemoteFileNode({
        url, // string that points to the URL of the image
        parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
        createNode, // helper function in gatsby-node to generate the node
        createNodeId, // helper function in gatsby-node to generate the node id
        cache, // Gatsby's cache
        store, // Gatsby's Redux store
      })
      if (fileNode) {
        node.frontmatter.avatarImage__NODE = fileNode.id
      }
    }
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      avatarImage: File @link(from: "avatarImage__NODE")
    }

    type Fields {
      slug: String
    }
  `)
}
