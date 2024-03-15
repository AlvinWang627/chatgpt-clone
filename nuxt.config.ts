// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 3000,
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/supabase"],
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
  supabase: {
    // Options
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: undefined,
      exclude: [""],
      cookieRedirect: false,
    },
  },
  runtimeConfig: {
    openaiApiKey: "",
  },
});
