<template>
  <div
    class="signboard-list-card__result-card"
    v-bind:class="{ 'signboard-list-card__result-card--selected': isSelected }"
    @click="onClick(signboard)"
  >
    <v-container fluid>
      <v-row :align="'center'">
        <v-col cols="12">
          <div
            class="signboard-list-card__detail-container"
          >
            <div class="text text--medium text--bold signboard-list-card__custom-text">
              {{ signboard.signboardId }}
            </div>
            <div v-if="isDefective">
              <img src="/signboard-defective.svg" />
            </div>
            <div v-else>
              <img src="/signboard-normal.svg" />
            </div>
          </div>
          <div style="margin-top: 10px;">
            <div class="text text--medium">Survey Id: {{signboard.surveyId}}</div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["isSelected", "signboard", "isDefective"],
  methods: {
    onClick(signboard) {
      this.$emit("onsignboardselect", signboard);
    }
  }
};
</script>
