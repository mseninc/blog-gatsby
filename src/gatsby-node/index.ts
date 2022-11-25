import path from "path"
import fs from "fs"
import { GatsbyNode, Node } from "gatsby"
import { createFilePath, createRemoteFileNode } from "gatsby-source-filesystem"
import { tagNameToPageUrl } from "../utils/tag"

const { paginate } = require("gatsby-awesome-pagination")

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions

  type Post = {
    id: string
    fields: {
      slug: string
    }
  }
  type DataType = {
    allMarkdownRemark: {
      nodes: Post[]
    }
    tagsGroup: {
      group: {
        fieldValue: string
        totalCount: number
      }[]
    }
  }

  const result = await graphql<DataType>(
    `
      {
        allMarkdownRemark(
          sort: { frontmatter: { date: ASC } }
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
          group(field: { frontmatter: { tags: SELECT } }) {
            fieldValue
            totalCount
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

  const posts = result.data?.allMarkdownRemark.nodes || []
  const postTemplate = path.resolve(`./src/templates/post.tsx`)

  if (posts.length > 0) {
    function getDuplicateSlugs(posts: Post[]) {
      const counts = posts.reduce(
        (p, c) => ({ ...p, [c.fields.slug]: (p[c.fields.slug] || 0) + 1 }),
        {} as { [slug: string]: number }
      )
      const duplicates = Object.keys(counts).filter((x) => counts[x] > 1)
      return duplicates.length > 0 ? duplicates : null
    }
    const duplicateSlugs = getDuplicateSlugs(posts)
    if (duplicateSlugs) {
      reporter.panicOnBuild(
        `Duplicate slugs detected ${JSON.stringify(duplicateSlugs)}`
      )
    }
    posts.forEach((post, index) => {
      createPage({
        path: post.fields.slug,
        component: postTemplate,
        context: {
          id: post.id,
        },
      })
    })

    const postListTemplate = path.resolve(`./src/templates/post-list.tsx`)

    paginate({
      createPage,
      items: posts,
      itemsPerPage: 30,
      pathPrefix: "/posts",
      component: postListTemplate,
    })

    // Extract tag data from query
    const tags = result.data?.tagsGroup.group || []
    const tagPageTemplate = path.resolve("src/templates/tags.tsx")

    // Make tag post list pages
    for (const { fieldValue: tagName, totalCount: postCount } of tags) {
      const postsPerPage = 30
      const numberOfPages = Math.ceil(postCount / postsPerPage)
      const basePath = tagNameToPageUrl(tagName)
      Array.from({ length: numberOfPages }).forEach((_, i) => {
        createPage({
          path: i === 0 ? basePath : `${basePath}${i + 1}`,
          component: tagPageTemplate,
          context: {
            limit: postsPerPage,
            skip: i * postsPerPage,
            numberOfPages,
            pageNumber: i,
            humanPageNumber: i + 1,
            tag: tagName,
            basePath,
          },
        })
      })
    }
  }
}

function getMatchedHeroImagePath(fileAbsolutePath: string, slug: string) {
  const candidateExtensions = ["jpg", "jpeg", "png"]
  // like `slug.jpg`
  for (const ext of candidateExtensions) {
    const testPath = path.resolve(
      fileAbsolutePath,
      "..",
      "images",
      `${slug}\.${ext}`
    )
    try {
      fs.statSync(testPath)
      return path.relative(path.resolve(fileAbsolutePath, ".."), testPath)
    } catch {}
  }
  // fallback to like `slug-1.jpg`
  for (const ext of candidateExtensions) {
    const testPath = path.resolve(
      fileAbsolutePath,
      "..",
      "images",
      `${slug}-1\.${ext}`
    )
    try {
      fs.statSync(testPath)
      return path.relative(path.resolve(fileAbsolutePath, ".."), testPath)
    } catch {}
  }
  return null
}

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({
  node,
  actions,
  getNode,
  store,
  cache,
  createNodeId,
  reporter,
}) => {
  const { createNode, createNodeField } = actions

  const mdr = node as Node & {
    id: string
    fileAbsolutePath: string
    frontmatter: {
      author: string
      avatarImage__NODE: any
    }
  }
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })

    // Flatten slug (e.g. /kenzauros/2021/hogehoge/ => /hogehoge/)
    const value = slug.match(/([^/]+)\/$/) ? `/${RegExp.$1}/` : slug

    createNodeField({
      name: `slug`,
      node,
      value,
    })

    // Hero image (eye catch image)
    const filename = slug.match(/([^/]+)\/$/) ? RegExp.$1 : ""
    const heroImagePath = getMatchedHeroImagePath(
      mdr.fileAbsolutePath,
      filename
    )
    createNodeField({
      name: `heroImage`,
      node,
      value: heroImagePath,
    })

    // Author avatar from exteranal source
    if (mdr.frontmatter.author) {
      const url = `https://avatars.githubusercontent.com/${mdr.frontmatter.author}`
      // https://www.gatsbyjs.com/docs/how-to/images-and-media/preprocessing-external-images/
      const fileNode = await createRemoteFileNode({
        url, // string that points to the URL of the image
        parentNodeId: mdr.id, // id of the parent node of the fileNode you are going to create
        createNode, // helper function in gatsby-node to generate the node
        createNodeId, // helper function in gatsby-node to generate the node id
        cache, // Gatsby's cache
      })
      if (fileNode) {
        mdr.frontmatter.avatarImage__NODE = fileNode.id
      }
    }
  }
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    const { createTypes } = actions

    createTypes(`
    type AuthorYaml implements Node {
      id: String
      name: String
      bio: String
      github: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      avatarImage: File @link(from: "avatarImage__NODE")
      author: AuthorYaml @link(by: "github")
    }

    type Fields {
      slug: String
      heroImage: File @fileByRelativePath
    }
  `)
  }
