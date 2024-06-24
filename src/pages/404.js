import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Header from "../components/header"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <Header title="404: Not Found" />
      <h1>Not Found</h1>
      <p>ページが見つかりませんでした。</p>
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
