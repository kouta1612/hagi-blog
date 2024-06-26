import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import ogp_image from "../images/cat.jpg"

const Seo = ({ title, description, image }) => {
  const { site } = useStaticQuery(graphql`
    query SeoQuery {
      site {
        siteMetadata {
          title
          description
          social {
            twitter
          }
          lang
          siteUrl
        }
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata.title
  const lang = site.siteMetadata.lang
  const siteUrl = site.siteMetadata.siteUrl
  const defaultImage = `${siteUrl}${ogp_image}`

  return (
    <>
      <html lang={lang} />
      <title>{title} | {defaultTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={site.siteMetadata.social.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
    </>
  )
}

export default Seo
