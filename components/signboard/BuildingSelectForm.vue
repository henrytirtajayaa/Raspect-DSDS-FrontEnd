<template>
  <div>
    <div class="step-text">STEP 1: Select a building that signboard BO00014 belongs to</div>
    <l-map
      style="width: 235px; height: 244px;"
      :zoom="15"
      :center="selectedResultLocation"
      :bounds="null"
    >
      <template v-for="tileUrl in urls">
        <l-tile-layer :url="tileUrl"></l-tile-layer>
      </template>
    </l-map>
  </div>
</template>
<script>
import { apiKey } from "../../constants"

export default {
  props: [
    "selectedResultLocation"
  ],
  data() {
    return {
      urls: [
        `https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`,
        `https://api.hkmapservice.gov.hk/osm/xyz/label-en/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`
      ]
    };
  }
};
</script>

<style>
  .step-text {
    padding-top: 15px;
    padding-bottom: 15px;
  }
</style>