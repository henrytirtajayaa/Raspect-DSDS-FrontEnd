<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 text-center justify-center mb-5">
      Continue to redistribute the current <br />
      assigned teams to this survey?
    </v-card-title>
    <v-card-actions>
      <v-btn color="#056694" text @click="$emit('cancel')">
        <span class="text text--bold text--blue">Cancel</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" elevation="0" @click="$emit('redistribute')">
        <span class="text text--bold text--white">YES</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
};
</script>
