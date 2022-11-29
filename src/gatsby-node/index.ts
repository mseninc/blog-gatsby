import path from "path"
import fs from "fs"
import { GatsbyNode, Node } from "gatsby"
import {
  createFilePath,
  createRemoteFileNode,
} from "gatsby-source-filesystem"
import { authorToPageUrl } from "../utils/author"
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
  type AuthorYaml = {
    id: string
    name: string
    bio: string
    github: string
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
    authorsGroup: {
      group: {
        fieldValue: string
        totalCount: number
      }[]
    }
  }

  const result = await graphql<DataType>(
    `
      {
        allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
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
        authorsGroup: allMarkdownRemark(limit: 2000) {
          group(field: { frontmatter: { author: { github: SELECT } } }) {
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

    // Group tags by the URL (basePath) (e.g. both "Windows-11" and "windows-11" are corresponding to `/windows-11`)
    const tagGroups = tags
      .reduce<{
        [key: string]: {
          basePath: string
          tagList: string[]
          postCount: number
        }
      }>((p, { fieldValue: tagName, totalCount: postCount }) => {
        const basePath = tagNameToPageUrl(tagName)
        if (basePath in p) {
          p[basePath].tagList.push(tagName)
          p[basePath].postCount += postCount
        } else {
          p[basePath] = {
            basePath,
            tagList: [tagName],
            postCount,
          }
        }
        return p
      }, {})

    // Make tag post list pages
    const tagPageTemplate = path.resolve("src/templates/tags.tsx")
    for (const { basePath, tagList, postCount } of Object.values(tagGroups)) {
      const postsPerPage = 30
      const numberOfPages = Math.ceil(postCount / postsPerPage)
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
            tagList,
            basePath,
          },
        })
      })
    }

    // Make author's post list pages
    const authors = result.data?.authorsGroup.group || []
    const authorPageTemplate = path.resolve("src/templates/author.tsx")
    for (const { fieldValue: author, totalCount: postCount } of authors) {
      const basePath = authorToPageUrl(author)
      const postsPerPage = 30
      const numberOfPages = Math.ceil(postCount / postsPerPage)
      Array.from({ length: numberOfPages }).forEach((_, i) => {
        createPage({
          path: i === 0 ? basePath : `${basePath}${i + 1}`,
          component: authorPageTemplate,
          context: {
            limit: postsPerPage,
            skip: i * postsPerPage,
            numberOfPages,
            pageNumber: i,
            humanPageNumber: i + 1,
            author,
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
    } catch { }
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
    } catch { }
  }
  return null
}

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({
  node,
  actions,
  getNode,
  createNodeId,
  getCache,
}) => {
  const { createNode, createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const mdr = node as Node & {
      id: string
      fileAbsolutePath: string
      frontmatter: {
        author: string
      }
    }

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
  }
  // Author avatar from exteranal source
  if (node.internal.type === `AuthorYaml`) {
    const authorNode = node as Node & { github: string }
    const url = `https://avatars.githubusercontent.com/${authorNode.github}`
    const fileNode = await createRemoteFileNode({
      url, // string that points to the URL of the image
      parentNodeId: authorNode.id, // id of the parent node of the fileNode you are going to create
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
      getCache, // Gatsby's cache
    })
    if (fileNode) {
      createNodeField({ node, name: "avatarImageFile", value: fileNode.id })
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
      avatarImage: File @link(from: "fields.avatarImageFile")
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      author: AuthorYaml @link(by: "github")
    }

    type Fields {
      slug: String
      heroImage: File @fileByRelativePath
    }
  `)
  }
