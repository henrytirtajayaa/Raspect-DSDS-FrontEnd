<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 text-left mb-0">
      <p>
        All signboards of this survey will be<br />
        reset to <strong class="text--blue">"unverified"</strong> status.
      </p>
      <br />
      <p>
        Continue to overwrite the originally <br />
        assigned teams to this survey?
      </p>
    </v-card-title>
    <v-card-actions>
      <v-btn color="#056694" text @click="$emit('cancel')">
        <span class="body1 text--secondary">Cancel</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="#056694" text @click="$emit('save')">
        <span class="body1 text--bold text--blue">YES</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
};
</script>
