import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - dsds-web',
    title: 'dsds-web',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/css/main.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/plugins.js', mode: 'client' }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'nuxt-leaflet',
  ],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/customVuetifyVariables.scss'],
    theme: {
      options: {
        customProperties: true,
      },
      dark: false,
      themes: {
        light: {
          primary: '#056694',
          accent: '#ED2939',
          secondary: '#F7B500',
          info: '#4A4A4A',
          warning: '#F8E71C',
          error: '#ED2939',
          success: '#6DD400'
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: [/^vue-chartjs3($|\/)/]
  },

  server: {
    host: '0', // default: localhost
    port: 8000
  },

  router: {
    middleware: ['auth']
  },

  env: {
    REPORT_API: (process.env.REPORT_API) ? process.env.REPORT_API : "https://localhost:5488/api/report"
  }

}
