<template>
  <v-app>
    <v-app-bar
      fixed
      app
      clipped-left
    >
      <v-img
        max-height="50"
        max-width="60"
        :aspect-ratio="6/4"
        src="/bd-logo.png"
        contain
      ></v-img>
      <v-spacer />
      <v-menu offset-y offset-x right close-on-click max-width="20em">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            text
            class="text-none"
          >
            <span class="text">Buildings Department</span>
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        
        <v-list rounded>
          <v-list-item>
            <v-avatar color='grey'>
              <v-icon>mdi-account</v-icon>
            </v-avatar>
            <v-list-item-content>
              <v-list-item-title class="pa-4 text-capitalize">{{userRole}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$router.push('/support')">
            <v-list-item-title class="text">Support</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logoutWithPayload">
            <v-list-item-title class="text">Log out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer app clipped mini-variant permanent mini-variant-width="80" class="default-sidebar">
      <v-list flat>
        <v-list-item
          v-for="(item, i) in navigationItems"
          :key="i"
          :to="item.to"
          router
          exact
          :disabled="userRole === USER_ROLE_NAME[USER_ROLE.STANDARD] && (item.to === '/survey' || item.to === '/assign-people')"
          :class="{ 'tab-selected': selected === item.to }"
          @click="selectModule(item.to)"
        >
          <v-list-item-action >
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" class="icon--sidebar-navigation pa-b-2">
                  <component :is="item.icon"/>
                </span>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-avatar>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { USER_ROLE_NAME, USER_ROLE } from "../constants";

export default {
  data () {
    return {
      selected: "",
      clipped: false,
      drawer: false,
      fixed: false,
      selectedItem: 1,
      menuItems: [
        {
          title: 'Support',
          to: '/support'
        },
        {
          title: 'Logout',
          to: '/logout'
        },
      ],
      navigationItems: [
        {
          icon: 'CommonHomepageIcon',
          title: 'Homepage',
          to: '/home'
        },
        {
          icon: 'CommonSurveyIcon',
          title: 'Define Survey Area',
          to: '/survey'
        },
        {
          icon: 'CommonFindSignboardIcon',
          title: 'Signboard Map',
          to: '/signboard-map'
        },
        {
          icon: 'CommonTripDataIcon',
          title: 'Trip Data',
          to: '/inspect-route'
        },
        {
          icon: 'CommonSignboardListIcon',
          title: 'Signboard List',
          to: '/record-list'
        },
        {
          icon: 'CommonAssignPeopleIcon',
          title: 'Assign Officer',
          to: '/assign-people'
        },
        {
          icon: 'CommonPerformanceIcon',
          title: 'Performance',
          to: '/performance'
        },
        {
          icon: 'CommonSettingIcon',
          title: 'Setting',
          to: '/settings'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      USER_ROLE_NAME,
      USER_ROLE
    }
  },
  methods: {
    ...mapActions({
      logout: "user/logout"
    }),
    ...mapMutations({
      getUserRole: "user/getUserRole"
    }),
    logoutWithPayload() {
      this.logout({userId: window.localStorage.getItem("userId"), refreshToken: window.localStorage.getItem("refreshToken"), accessToken: window.localStorage.getItem("accessToken")});
    },
    selectModule(id) {
      this.selected = id; 
    }
  },
  mounted() {
    this.selected = this.$route.path;
    this.getUserRole()
  },
  watch: {
    $route(to, from){
      this.selectModule(to.path)
    }
  },
  computed: {
    userRole() {
      return USER_ROLE_NAME[this.$store.state.user.userRole]
    },
  },
}
</script>
