module.exports = {
  content: ["./views/**/*.{html,js}", "./public/**/*.{html,js}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            blockquote: {
              color: theme("colors.gray.400"),
            },
            a: {
              color: theme("colors.yellow.500"),
              textDecoration: "underline",
            },
            strong: {
              color: theme("colors.white"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
