<template class="signboard-legend">
  <v-card>
    <v-container>
      <div class="text text--bold signboard-legend__title">
        Display on Map
      </div>
      <div class="signboard-legend__container">
        <div
          class="signboard-legend__sub-container"
          @click="$emit('set-filter', 'FILTER_ALL_MARKER')"
        >
          <div v-if="typeFilter !== 'FILTER_ALL_MARKER'">
            <div style="width: 41px; height: 8px; background: #4A4A4A; margin-bottom: 20px;"></div>
          </div>
          <div v-else>
            <CommonSignboardGreyIcon></CommonSignboardGreyIcon>
          </div>
          <div class="text signboard-legend__legend-text">
            All Trips Stored
          </div>
        </div>
        <div class="signboard-legend__container">
          <div
            class="signboard-legend__sub-container"
            @click="$emit('set-filter', 'FILTER_ALL_TRIPS')"
          >
            <div v-if="typeFilter !== 'FILTER_ALL_TRIPS'">
              <img src="/signboard-grey.svg" />
            </div>
            <div v-else>
              <CommonSignboardGreyIcon></CommonSignboardGreyIcon>
            </div>
            <div class="text signboard-legend__legend-text">
              All Signboards Stored
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
  props: ["typeFilter"]
};
</script>
