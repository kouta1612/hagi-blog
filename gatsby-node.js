const path = require("path")
const _ = require("lodash")
const { createFilePath } = require("gatsby-source-filesystem")
const fs = require("fs")

// ブログページを動的に作成する
exports.createPages = async ({ graphql, actions, reporter }) => {
  const result = await graphql(`{
    postMdx: allMdx(sort: {frontmatter: {date: ASC}}, limit: 1000) {
      nodes {
        id
        fields {
          slug
        }
        internal {
          contentFilePath
        }
      }
    }
    # tagMdx: allMdx(limit: 2000) {
    #   group(field: {frontmatter: {tags: SELECT}}) {
    #     fieldValue
    #     internal {
    #       contentFilePath
    #     }
    #   }
    # }
  }`)

  if (result.errors) {
    reporter.panicOnBuild(
      "There was an error loading your blog posts",
      result.errors
    )
    return
  }

  const { createPage } = actions

  const posts = result.data.postMdx.nodes
  const postTemplate = path.resolve("./src/templates/posts.jsx")

  posts.forEach((post, index) => {
    const previousPostId = index === 0 ? null : posts[index - 1].id
    const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

    createPage({
      path: post.fields.slug,
      component: `${postTemplate}?__contentFilePath=${post.internal.contentFilePath}`,
      context: {
        id: post.id,
        previousPostId,
        nextPostId,
      },
    })
  })

  // const tags = result.data.tagMdx.group
  // const tagTemplate = path.resolve(`./src/templates/tags.jsx`)

  // tags.forEach(tag => {
  //   createPage({
  //     path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
  //     component: `${tagTemplate}?__contentFilePath=${post.internal.contentFilePath}`,
  //     context: {
  //       tag: tag.fieldValue,
  //     },
  //   })
  // })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === "Mdx") {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: "slug",
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

// ビルドが完了したときに実行される
exports.onPostBuild = () => {
  fs.copyFile("./firebase.json", "./public/firebase.json", err => {
    if (err) {
      throw err
    }
  })
}
