const path = require(`path`)
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)
const fs = require("fs")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const blogTemplate = path.resolve(`./src/templates/posts.js`)
  // const tagTemplate = path.resolve(`./src/templates/tags.js`)

  const result = await graphql(
    `
      {
        postRemark: allMarkdownRemark(
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
        tagRemark: allMarkdownRemark(limit: 2000) {
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

  const posts = result.data.postRemark.nodes

  posts.forEach((post, index) => {
    const previousPostId = index === 0 ? null : posts[index - 1].id
    const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

    createPage({
      path: post.fields.slug,
      component: blogTemplate,
      context: {
        id: post.id,
        previousPostId,
        nextPostId,
      },
    })
  })

  // const tags = result.data.tagRemark.group

  // tags.forEach(tag => {
  //   createPage({
  //     path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
  //     component: tagTemplate,
  //     context: {
  //       tag: tag.fieldValue,
  //     },
  //   })
  // })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Example
  // https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#createSchemaCustomization:~:text=addThirdPartySchema%20object-,Example,-exports.createSchemaCustomization
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      tags: [String!]
      image: File @fileByRelativePath
    }

    type Fields {
      slug: String
    }
  `)
}

exports.onPostBuild = () => {
  fs.copyFile(`./firebase.json`, `./public/firebase.json`, err => {
    if (err) {
      throw err
    }
  })
}
