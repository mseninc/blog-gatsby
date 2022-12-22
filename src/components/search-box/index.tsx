import React from "react"
import { Helmet } from "react-helmet"

export default function SearchBox() {
  return (
    <>
      <Helmet>
        <script
          async
          src="https://cse.google.com/cse.js?cx=e58962d21dcb441fb"
        ></script>
      </Helmet>
      <div className="gcse-search"></div>
    </>
  )
}
