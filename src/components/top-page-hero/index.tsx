import { StaticImage } from "gatsby-plugin-image"
import React from "react"

type Props = {}

export default function TopPageHero(props: Props) {
  return (
    <div className={`top-page-hero`}>
      <StaticImage
        src="../../images/top-page-hero.jpg"
        alt=""
        transformOptions={{ fit: "contain", cropFocus: "attention" }}
      />
      <div className={`top-page-hero-copy top-page-hero-copy-1`}>
        Beyond our knowledge
      </div>
      <div className={`top-page-hero-copy top-page-hero-copy-2`}>
        知識の向こう側へ
      </div>
    </div>
  )
}
