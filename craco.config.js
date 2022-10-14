const path = require('path')
const WorkerLoaderPlugin = require("craco-worker-loader")

module.exports = {
  webpack: {
    alias: {
      react: path.resolve('./node_modules/react')
    },
  },
  babel: {
    plugins: [
        "@babel/plugin-proposal-logical-assignment-operators"
    ]
  },
  plugins: [{
    plugin: WorkerLoaderPlugin
  }]
}
