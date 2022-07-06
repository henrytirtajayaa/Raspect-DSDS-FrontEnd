<template>
  <div id="map-wrap" class="d-flex inspect-route">
    <MapTripRoute key="map" @routepoint="onRoutePointClicked">
    </MapTripRoute>
    <CommonRouteDetail v-show="showRouteDetail" @closebtnclick="closeButtonClick">
    </CommonRouteDetail>
  </div>
</template>

<script>

export default {
  data(){
    return {
      showRouteDetail: false
    };
  },
  destroyed() {
    this.showRouteDetail = false;
  },
  methods: {
    onRoutePointClicked() {
      this.showRouteDetail = true;
    },
    closeButtonClick() {
      this.showRouteDetail = false;
    }
  }
}
</script>