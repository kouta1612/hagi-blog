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

  const author = data.site.siteMetadata.author
  const social = data.site.siteMetadata.social

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["AUTO", "WEBP", "AVIF"]}
        src="../images/cat.jpg"
        width={60}
        height={60}
        quality={95}
        alt="avator"
      />
      <div>
        <div>
          <p>{author.summary}</p>
        </div>
        <div>
          <a href={`https://twitter.com/${social.twitter}`} target="blank" aria-label="Twitter">
            <FontAwesomeIcon
              style={{ height: "1.5em", width: "1.5em", marginRight: "5" }}
              color="#3eaded"
              icon={faTwitter}
            />
          </a>
          <a href="https://github.com/kouta1612" target="blank" aria-label="GitHub">
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
