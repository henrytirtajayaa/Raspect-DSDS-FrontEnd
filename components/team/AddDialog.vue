<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 mb-5">
      Add New Team
    </v-card-title>
    <v-card-text>
      <v-autocomplete :items="userPost" append-icon="" prepend-inner-icon="mdi-magnify" outlined v-model="seniorPro" placeholder="Senior Pro" label="Senior Pro"></v-autocomplete>
      <v-autocomplete :items="userPost" append-icon="" prepend-inner-icon="mdi-magnify" outlined v-model="caseOfficer" placeholder="Case Officer" label="Case Officer"></v-autocomplete>
      <v-autocomplete :items="userPost" append-icon="" prepend-inner-icon="mdi-magnify" outlined v-model="caseAssistant" placeholder="Case Assistant" label="Case Assistant"></v-autocomplete>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
      <v-btn color="#056694" class="mr-4" text @click="onCancel">
        <span class="text text--bold text--blue">Cancel</span>
      </v-btn>
      <v-btn color="primary" elevation="0" @click="onSave">
        <span class="text text--bold text--white">YES</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      seniorPro: '',
      caseOfficer: '',
      caseAssistant: ''
    }
  },
  methods: {
    ...mapActions({
      createTeam: "team/createTeam"
    }),
    async onSave() {
      this.$emit('save');
      await this.createTeam({
        seniorPro: this.seniorPro,
        caseOfficer: this.caseOfficer,
        caseAssistant: this.caseAssistant
      })
      this.$emit('notification');
      this.resetFields();
    },
    onCancel() {
      this.$emit('cancel');
      this.resetFields();
    },
    resetFields() {
      this.seniorPro = '';
      this.caseAssistant = '';
      this.caseOfficer = '';
    }
  },
  computed: {
    userPost() {
      return this.$store.state.user.userPost;
    }
  }
};
</script>