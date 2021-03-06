"use strict"

const fs = require("fs")
const gracefulFs = require("graceful-fs")
gracefulFs.gracefulify(fs)

require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "esnext",
    baseUrl: "src",
  },
})

const {
  createPages,
  onCreateNode,
  createSchemaCustomization,
} = require("./src/gatsby-node/index")

exports.createPages = createPages
exports.onCreateNode = onCreateNode
exports.createSchemaCustomization = createSchemaCustomization
