<template>
  <div id="map-wrap" class="settings">
    <v-tabs
      height="60px"
      background-color="grey lighten-2 accent-4"
      center-active
      v-model="tab"
    >
      <v-tab key="account" href="#account">Account Setting</v-tab>
      <template v-if="userRole !== USER_ROLE_NAME[USER_ROLE.STANDARD]">
        <v-tab href="#pendingItems">Pending Items</v-tab>
      </template>
    </v-tabs>
    <v-tabs-items :value="tab">
      <v-tab-item value="account">
        <SettingsUserTab></SettingsUserTab>
      </v-tab-item>
      <template v-if="userRole !== USER_ROLE_NAME[USER_ROLE.STANDARD]">
        <v-tab-item value="sample">
          <SettingsSampleTab></SettingsSampleTab>
        </v-tab-item>
        <v-tab-item value="pendingItems">
          <SettingsPendingItemsTab></SettingsPendingItemsTab>
        </v-tab-item>
      </template>
    </v-tabs-items>
  </div>
</template>
<script>
import { USER_ROLE_NAME, USER_ROLE } from "../constants";
export default {
  data() {
    return {
      items: [
        { tab: "Account Settings", content: <SampleSettingsTab /> },
        { tab: "Sample Settings", content: "Tab 2 Content" },
        { tab: "Pending Items", content: <PendingItemsTab /> }
      ],
      USER_ROLE_NAME,
      USER_ROLE
    };
  },
  computed: {
    tab: {
      set(tab) {
        this.$router.replace({ query: { ...this.$route.query, tab } });
      },
      get() {
        return this.$route.query.tab;
      }
    },
    userRole() {
      return USER_ROLE_NAME[this.$store.state.user.userRole];
    }
  }
};
</script>
