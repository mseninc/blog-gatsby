import * as React from "react"
import {
  GatsbyImage,
  getImage,
  IGatsbyImageData,
  StaticImage,
} from "gatsby-plugin-image"
import * as styles from "./index.module.css"
import { Link } from "gatsby-link"
import { authorToPageUrl } from "utils/author"

type Props = {
  name: string
  github: string
  avatarImage?: IGatsbyImageData | null
  reverse?: boolean
}

export default function AuthorLink(props: Props) {
  const github = props.github
  const name = props.name || props.github
  const avatarImage = props.avatarImage && getImage(props.avatarImage)

  return (
    <Link
      to={authorToPageUrl(github)}
      title={`${github} の記事一覧`}
      className={`author-link ${styles.container} ${
        props.reverse ? styles.reverse : ""
      }`}
    >
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
      <div>{name}</div>
    </Link>
  )
}
