import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import JumpButton from "./jump-button"

type Props = {
  location: { pathname: string }
  title: string
  children: any
}

const Layout = ({ location, title, children }: Props) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  const headerLogo = (
    <StaticImage
      src="../images/mseeeen-logo-light.png"
      width={180}
      layout="fixed"
      placeholder="none"
      alt={title}
    />
  )

  let header
  if (isRootPath) {
    header = (
      <h1>
        <Link className="header-link-home" to="/">
          {headerLogo}
        </Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {headerLogo}
      </Link>
    )
  }

  return (
    <>
      <div className="global-header">
        <div className="global-header-wrapper">{header}</div>
      </div>
      <div className={isRootPath ? '' : `global-wrapper`} data-is-root-path={isRootPath}>
        {children}
        <footer>
          © {new Date().getFullYear()}, MSEN Inc.
        </footer>
      </div>
      <JumpButton />
    </>
  )
}

export default Layout
