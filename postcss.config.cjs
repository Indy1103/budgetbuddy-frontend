// postcss.config.cjs
module.exports = {
  plugins: {
    'postcss-import': {},       // inline your CSS @imports first
    '@tailwindcss/postcss': {},  // the v4 PostCSS plugin
    autoprefixer: {},            // vendor prefixes
  },
}