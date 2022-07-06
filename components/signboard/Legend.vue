<template class="signboard-legend">
  <v-card>
    <v-container>
      <div class="text text--bold signboard-legend__title">
        Display on Map
      </div>
      <div class="signboard-legend__container">
        <div
          class="signboard-legend__sub-container"
          @click="$emit('set-marker-filter', 'NORMAL_ONLY')"
        >
          <div v-if="markerFilter !== 'NORMAL_ONLY'">
            <img src="/signboard-defective.svg" />
          </div>
          <div v-else>
            <CommonSignboardGreyIcon></CommonSignboardGreyIcon>
          </div>
          <div class="text signboard-legend__legend-text">
            Defective Signboard
          </div>
        </div>
        <div class="signboard-legend__container">
          <div
            class="signboard-legend__sub-container"
            @click="$emit('set-marker-filter', 'DEFECT_ONLY')"
          >
            <div v-if="markerFilter !== 'DEFECT_ONLY'">
              <img src="/signboard-normal.svg" />
            </div>
            <div v-else>
              <CommonSignboardGreyIcon></CommonSignboardGreyIcon>
            </div>
            <div class="text signboard-legend__legend-text">
              Normal Signboard
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </v-card>
</template>

<style scoped>
.legend-container {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  padding-bottom: 10px;
}
</style>

<script>
export default {
  props: ["markerFilter"]
};
</script>
