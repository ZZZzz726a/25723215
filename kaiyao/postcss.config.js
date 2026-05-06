export default {
  plugins: {
    tailwindcss: {},
    "postcss-pxtorem": {
      rootValue: 16,
      propList: ["*"],
      minPixelValue: 2,
      selectorBlackList: [/^html$/],
    },
    autoprefixer: {},
  },
};
