import * as React from "react"
import {
  GatsbyImage,
  getImage,
  IGatsbyImageData,
  StaticImage,
} from "gatsby-plugin-image"
import * as styles from "./index.module.css"

type Props = {
  name: string
  github: string
  avatarImage: IGatsbyImageData
  reverse?: boolean
}

export default function AuthorLink(props: Props) {
  const github = props.github
  const name = props.name || props.github
  const avatarImage = getImage(props.avatarImage)

  return (
    <div
      className={`author-link ${styles.container} ${
        props.reverse ? styles.reverse : ""
      }`}
    >
      {props.reverse ? <div>{name}</div> : null}
      {avatarImage ? (
        <GatsbyImage
          image={avatarImage}
          className={styles.avatar}
          alt={github}
        />
      ) : (
        <StaticImage
          src="https://www.gravatar.com/avatar/?d=mp&s=50"
          className={styles.avatar}
          width={25}
          height={25}
          layout="fixed"
          alt={`${github} - GitHub`}
        />
      )}
      {!props.reverse ? <div>{name}</div> : null}
    </div>
  )
}
