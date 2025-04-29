// tailwind.config.cjs
module.exports = {
  // … your content globs …
  theme: {
    extend: {
      fontFamily: {
        // SF Pro is a system font on Apple devices; fallback to system-ui on others
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        heading: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
      },
    },
  },
  // … plugins …
};