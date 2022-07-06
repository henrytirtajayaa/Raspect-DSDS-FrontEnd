<template>
  <div class="save-signboard-form">
    <div class="signboard-annotation-title">New Signboard ID</div>
    <div>
      <span class='text text--bold'>N/A</span>
    </div>
    <v-divider></v-divider>
    <div class="save-signboard-form__button-container">
      <v-btn elevation="0" color="white" @click="onCancel"><span class="text text--bold text--red" >Cancel</span></v-btn>
      
      <v-btn elevation="0" color="primary" :loading="isLoading" @click="onClick"><span class="text text--bold text--white">Save</span></v-btn>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      signboardId: "",
      isLoading: false
    };
  },
  methods: {
    toggleLoading() {
      this.isLoading = !this.isLoading;
    },
    onClick() {
      this.isLoading = false;
      this.$emit('save-new-signboard', this.signboardId, () => this.toggleLoading());
    },
    onCancel() {
      this.$emit('cancel-new-signboard');
    }
  }
}
</script>