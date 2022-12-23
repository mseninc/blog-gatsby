import React from "react"
import { Helmet } from "react-helmet"

// NOTE: [Webフォント読み込み戦略（2021年） - MOL](https://t32k.me/mol/log/optimize-webfont-loading/)

const webFontUrl =
  "https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap"

export default function WebFont() {
  return (
    <>
      <Helmet>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link rel="preload" as="style" href={webFontUrl} />
        <link
          rel="stylesheet"
          href={webFontUrl}
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          {`<link
            rel="stylesheet"
            href="${webFontUrl}"
          />`}
        </noscript>
      </Helmet>
    </>
  )
}
