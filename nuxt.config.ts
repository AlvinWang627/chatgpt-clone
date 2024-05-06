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
    "@unlok-co/nuxt-stripe",
  ],
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
      stripePublishKey: "",
    },
    openaiApiKey: "",
    stripeWebhookKey: "",
  },
  stripe: {
    // Server
    server: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {
        // your api options override for stripe server side
        // https://github.com/stripe/stripe-node?tab=readme-ov-file#configuration
      },
      // CLIENT
    },
    client: {
      key: process.env.PUBLIC_STRIPE_PUBLISH_KEY,
      // your api options override for stripe client side https://stripe.com/docs/js/initializing#init_stripe_js-options
      options: {},
    },
  },
  // shadcn: {
  //   /**
  //    * Prefix for all the imported component
  //    */
  //   prefix: "",
  //   /**
  //    * Directory that the component lives in.
  //    * @default "./components/ui"
  //    */
  //   componentDir: "./components/ui",
  // },
});
