/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["AUTO", "WEBP", "AVIF"]}
        src="../images/profile-pic.jpg"
        width={60}
        height={60}
        quality={95}
        alt="Profile picture"
      />
      <div>
        {author?.name && (
          <p>
            Written by <strong>{author.name}.</strong> {author?.summary || null}
            {` `}
          </p>
        )}
        <div>
          <a href={`https://twitter.com/${social?.twitter || ``}`} target="blank">
            <FontAwesomeIcon
              style={{ height: "1.5em", width: "1.5em", marginRight: "5" }}
              color="#3eaded"
              icon={faTwitter}
            />
          </a>
          <a href="https://github.com/kouta1612" target="blank">
            <FontAwesomeIcon
              style={{ height: "1.5em", width: "1.5em", marginRight: "5" }}
              color="#333"
              icon={faGithub}
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Bio
