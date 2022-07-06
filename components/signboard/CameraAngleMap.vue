<template>
  <div>
    <l-map
      style="height: 246px; width: 100%;"
      :zoom="25"
      :center="computedCameraLocation"
    >
      <template v-for="tileUrl in tileUrls">
        <l-tile-layer :url="tileUrl" :key="tileUrl"></l-tile-layer>
      </template>
      <l-marker :lat-lng="computedCameraLocation" :rotationAngle="carAngle">
        <l-icon :iconSize="[50,50]" icon-url="/camera-angle.svg"> </l-icon>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { apiKey } from "../../constants";
import LMarker from 'vue2-leaflet-rotatedmarker'
import _isEmpty from 'lodash/isEmpty';

export default {
  props: { buildingCoordinates: Array, carAngle: Number, cameraLocation: Array },
  components: {
    LMarker
  },
  data() {
    return {
      tileUrls: [
        `https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`,
        `https://api.hkmapservice.gov.hk/osm/xyz/label-en/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`
      ]
    };
  },
  computed: {
    computedCameraLocation () {
      return !_isEmpty(this.cameraLocation) ? [this.cameraLocation[1], this.cameraLocation[0]] : [22.302711, 114.177216];
    }
  }
};
</script>
