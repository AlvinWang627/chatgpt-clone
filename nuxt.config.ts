// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/supabase",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "nuxt-icon",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: "",
  },
  supabase: {
    // Options
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
    },
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
    },
    openaiApiKey: "",
  },
});
