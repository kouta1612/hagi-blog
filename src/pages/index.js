import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Header from "../components/header"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.nodes
  return (
    <Layout location={location} title={siteTitle}>
      <Header
        title="ホーム"
        description="都内のベンチャーでWebエンジニアをしています。"  
      />
      <Bio />
      <h2>ブログ一覧</h2>
      <hr />
      <ul className="post-list">
        {posts.map(post => {
          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <GatsbyImage image={getImage(post.frontmatter.image)} alt={post.frontmatter.alt} />
                </header>
                <div className="content">
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{post.frontmatter.title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                  {/* {post.frontmatter.tags.map((tag, index) => {
                    return <small key={index} className="tag">#{tag}</small>
                  })} */}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`{
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
    nodes {
      fields {
        slug
      }
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        title
        tags
        image {
          childImageSharp {
            gatsbyImageData(height: 200, width: 350, formats: [AUTO, WEBP, AVIF])
          }
        }
        alt
      }
    }
  }
}`
