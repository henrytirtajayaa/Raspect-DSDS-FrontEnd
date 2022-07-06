<template>
  <v-app>
    <v-app-bar
      fixed
      app
      :elevation="1"
    >
      <v-img
        max-height="50"
        max-width="60"
        :aspect-ratio="6/4"
        src="/bd-logo.png"
        contain
      ></v-img>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          title: 'Support',
          to: '/support'
        },
        {
          title: 'Logout',
          to: '/logout'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
