import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const Bio = (props) => {
  const bio = props.bio || null;
  const github = props.github;
  const name = props.name || '名無しの権兵衛';
  const githubUrl = github ? `https://github.com/${github}` : null;
  const avatarImage = getImage(props.avatarImage)

  return (
    <div className="bio">
      <GatsbyImage
        image={avatarImage}
        className="bio-avatar"
        width={50}
        height={50}
        alt={github}
        />
      <div>
        <p>
          <strong>{name}</strong>
          { github ? <> (<a href={githubUrl} target="_blank" rel="noreferrer">{github}</a>)</> : null }
        </p>
        <p>{bio}</p>
      </div>
    </div>
  )
}

export default Bio
