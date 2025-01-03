const conf = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  experimental: {
    turbo: {
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
    },
  },
};

export default conf;
