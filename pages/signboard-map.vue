<template>
  <div id="map-wrap" class="d-flex signboard-map">
    <SignboardMap key="map" @markerselected="onMarkerSelected"> </SignboardMap>
    <CommonSignboardDetail
      v-bind:showSignboardDetail="showSignboardDetail"
      @closebtnclick="closeButtonClick"
    ></CommonSignboardDetail>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import _ from 'lodash';

export default {
  data() {
    return {
      selectedSignboard: null,
      images: [{ url: "", id: 1 }, { url: "", id: 2 }],
      needsBuildingAssignmen: false
    };
  },
  methods: {
    async onMarkerSelected(marker) {
      this.setSignboardDetail(false);
      await this.setSelectedSignboard({});
      if (marker && marker.signboardGroup && marker.signboardGroup.length === 1) {
        let signboard = {
          location: marker.location,
          id: marker.signboardGroup[0]._id,
          ...marker.signboardGroup[0]
        };
        this.setResultPanel(false);
        await this.setSelectedSignboard(signboard);
        await this.getBuildingDetails({ structureId: marker.signboardGroup[0].structId });
        await this.getSignboardImage({ signboardId: marker.signboardGroup[0].signboardId });
      } else if (marker && marker.signboardGroup && marker.signboardGroup.length > 1) {
        this.setSelectedSignboard({id: "0"});
        this.setSignboardList(marker.signboardGroup);
      } else if (marker && marker.signboardGroup === null) {
        return ;
      }

      this.setSignboardDetail(true);
      let showResultPanel =
        marker !== null && marker.signboardGroup && marker.signboardGroup.length > 1 ? true : false;
      this.setResultPanel(showResultPanel);
    },
    closeButtonClick() {
      this.setSignboardDetail(false);
    },
    ...mapMutations({
      setSignboardList: "signboard/setSignboardList",
      setSelectedSignboard: "signboard/setSelectedSignboard",
      setResultPanel: "signboard/setResultPanel",
      setSignboardDetail: "signboard/setSignboardDetail"
    }),
    ...mapActions({
      getSignboardImage: "signboard/getSignboardImage",
      getBuildingDetails: "signboard/getBuildingDetails",
      grabSurveyTrips: "signboard/grabSurveyTrips"
    })
  },
  mounted() {
    this.grabSurveyTrips();
  },
  computed: {
    showSignboardDetail () {
      return this.$store.state.signboard.showSignboardDetail;
    }
  }
};
</script>