import * as React from "react"
import {
  GatsbyImage,
  getImage,
  IGatsbyImageData,
  StaticImage,
} from "gatsby-plugin-image"
import * as styles from "./index.module.css"

type Props = {
  bio: string
  github: string
  name: string
  avatarImage: IGatsbyImageData
}

const Bio = (props: Props) => {
  const bio = props.bio || null
  const github = props.github
  const name = props.name || "名無しの権兵衛"
  const githubUrl = `https://github.com/${github}`
  const avatarImage = getImage(props.avatarImage)

  return (
    <div className={`${styles.bio} bio`}>
      {avatarImage ? (
        <GatsbyImage
          image={avatarImage}
          className={`${styles.avatar} bio-avatar`}
          alt={github}
        />
      ) : (
        <StaticImage
          src="https://www.gravatar.com/avatar/?d=mp&s=50"
          className={`${styles.avatar} bio-avatar`}
          width={50}
          height={50}
          layout="fixed"
          alt={`${github} - GitHub`}
        />
      )}
      <div className={`${styles.main} bio-main`}>
        <div className={`${styles.nameInfo} bio-name-info`}>
          <strong>{name}</strong>
          <a href={githubUrl} target="_blank" rel="noreferrer" title={github}>
            <StaticImage
              src="../../images/github-icon-light.png"
              width={20}
              height={20}
              imgClassName="github-icon"
              alt={`${github} - GitHub`}
            />
            <span>{github}</span>
          </a>
        </div>
        <p className={`bio-bio-text`}>{bio}</p>
      </div>
    </div>
  )
}

export default Bio
