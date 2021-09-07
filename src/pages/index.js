import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
// import { GatsbyImage, getImage } from "gatsby-plugin-image"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.nodes
  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title="ホーム"
        description="都内のベンチャーでWebエンジニアをしています。"  
      />
      <Bio />
      <h2>ブログ一覧</h2>
      <hr />
      <ul style={{ listStyle: `none` }}>
        {posts.map(post => {
          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{post.frontmatter.title}</span>
                    </Link>
                  </h2>
                  {/* <GatsbyImage image={getImage(post.frontmatter.image)} alt={post.frontmatter.alt} /> */}
                  <small>{post.frontmatter.date}</small>
                  {/* {post.frontmatter.tags.map((tag, index) => {
                    return <small key={index} className="tag">#{tag}</small>
                  })} */}
                </header>
              </article>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY/MM/DD")
          title
          tags
          # image {
          #   childImageSharp {
          #     gatsbyImageData(
          #       width: 200
          #       formats: [AUTO, WEBP, AVIF]
          #     )
          #   }
          # }
          # alt
        }
      }
    }
  }
`
