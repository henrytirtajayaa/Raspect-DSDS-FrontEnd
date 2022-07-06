<template>
  <div class="homepage">
    <v-container >
      <div class="d-flex justify-space-between mt-5">
        <span class="text--bold">Defective Signboards Diagnostics System</span>
        <span>{{ date }}</span>
      </div>
      <div class="mt-5">
        <v-row>
          <v-col cols="6" lg="3" class="d-flex flex-column" v-for="content in contentList" :key="content.id">
            <v-card class="pa-2 text-center flex d-flex flex-column" @click="openContent(content.to)" :disabled="(content.title === 'Define Survey Area' && userRole === 'standard') || (content.title === 'Assign Officer' && userRole === 'standard')">
              <component class="mx-auto" :is="content.icon" />
              <v-card-title class="justify-center text--blue">
                {{ content.title }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div class="mt-5">
        <span>Latest Trips</span>
        <HomepageLatestTrip class="mt-3"/>
      </div>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
import { CONTENT_LIST } from "../constants";

export default {
  data () {
    return {
      contentList: CONTENT_LIST,
      date: ''
    }
  },
  computed: {
    userRole() {
      return this.$store.state.user.userRole
    },
  },
  methods: {
    openContent(path) {
      this.$router.push(path) 
    },
    realTimeClock() {
      setInterval(() => {
        this.date = moment().format('h:mm A Do MMMM YYYY')
      }, 1000)
    }
  },
  mounted() {
    this.realTimeClock()
  }
}
</script>