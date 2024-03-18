module.exports = {
  apps: [
    {
      name: "nuxt-ai",
      port: "3000",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
};
