module.exports = {
  presets: [
    {
      presets: ["@babel/preset-env", "@babel/preset-react"],
    },

    //   [
    //     "@babel/preset-env",
    //     {
    //       targets: {
    //         node: "current",
    //       },
    //     },
    //   ],
    // ],
    // ignore: [
    //   // Ignore built-in node_modules (if not explicitly stated)
    //   // but allow axios or other ES modules
    //   /node_modules\/(?!axios)/,
  ],
};
