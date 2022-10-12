const path = require(`path`)

module.exports = {
  webpack: {
    alias: {
      react: path.resolve('./node_modules/react')
    }
  },
  babel: {
    plugins: [
        "@babel/plugin-proposal-logical-assignment-operators"
    ]
  }
}
