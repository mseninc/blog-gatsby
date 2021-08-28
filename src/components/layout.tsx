import * as React from "react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"

type Props = {
  location: { pathname: string }
  title: string
  children: any
}

const Layout = ({ location, title, children }: Props) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <Helmet>
      <link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP" rel="stylesheet" />
      </Helmet>
      <div className="global-header">{header}</div>
      {children}
      <footer>
        © {new Date().getFullYear()}, MSEN Inc.
      </footer>
    </div>
  )
}

export default Layout
