import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <h1>Not Found</h1>
      <p>ページが見つかりませんでした。</p>
    </Layout>
  )
}

export default NotFoundPage

export const Head = () => {
  return <Seo title="404: Not Found" />
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
