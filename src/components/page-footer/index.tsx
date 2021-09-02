import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

type Props = {
}

const logoImage = (
  <>
    <StaticImage
      src="../../images/mseeeen-logo-dark.png"
      width={240}
      layout="fixed"
      placeholder="none"
      alt={''}
    />
  </>
)

export default function PageFooter(props: Props) {

  return (
    <div className={`page-footer`}>
      <div className={`page-footer-logo`}>
        { logoImage }
      </div>
      <div className={`page-footer-copyright`}>
          MSeeeeN © {new Date().getFullYear()}, MSEN Inc.
      </div>
    </div>
  )
}
