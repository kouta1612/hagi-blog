import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const Tags = ({ pageContext, data, location }) => {
  const posts = data.allMarkdownRemark.nodes
  const siteTitle = data.site.siteMetadata.title
  const tagTitle = `「${pageContext.tag}」に関する記事一覧`

  return (
    <Layout location={location} title={siteTitle}>
      <h1>{tagTitle}</h1>
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

export default Tags

export const Head = ({ pageContext }) => {
  const tagTitle = `「${pageContext.tag}」に関する記事一覧`
  return <Seo title={tagTitle} description={tagTitle} />
}

const pageQuery = graphql`query ($tag: String) {
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(
    limit: 2000
    sort: {frontmatter: {date: DESC}}
    filter: {frontmatter: {tags: {in: [$tag]}}}
  ) {
    nodes {
      fields {
        slug
      }
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        title
        tags
      }
    }
  }
}`

// export { pageQuery }
