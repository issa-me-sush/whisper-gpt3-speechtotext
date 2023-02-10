const path = require("path");

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.coffee$/,
      use: [
        {
          loader: "coffee-loader",
          options: {
            transpile: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
      include: [path.resolve(__dirname, "node_modules/flac.js")],
    });
    config.module.rules.push({
      test: /\.js$/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      ],
      include: [path.resolve(__dirname, "node_modules/flac.js")],
    });
    return config;
  },
};
