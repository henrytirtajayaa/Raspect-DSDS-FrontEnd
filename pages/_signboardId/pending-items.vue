<template>
  <div id="map-wrap" class="d-flex signboard-map">
    <template v-if="signboardLocation">
      <SingleMap :location="signboardLocation" @markerselected="onMarkerSelected" />
    </template>
    <v-dialog v-model="dialog">
      <CommonAnnotationTool
        :imgSrc="imageSelect.highResPath"
        :imgId="imageSelect._id"
        :key="imageSelect._id"
        :fromSignboardDetail="true"
        :signboardAnnotationList="imageSelect.signboardAnnotation"
        @close-tool="closeTool"
      />
    </v-dialog>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import _isEmpty from "lodash/isEmpty";

export default {
  data() {
    return {
      showSignboardDetail: false,
      fromSignboardDetail: true,
      isDefectTool: true,
      dialog: false,
      imageSelect: {}
    }
  },
  methods: {
    onMarkerSelected() {
      this.dialog = true;
    },
    ...mapActions({
      getSignboardData: "signboard/getSignboardData",
      getSignboardImage: "signboard/getSignboardImage"
    }),
    ...mapMutations({
      setSignboardDetail: "signboard/setSignboardDetail",
      setImageAnnotationDetails: "signboard/setImageAnnotationDetails"
    }),
    closeButtonClick() {
      this.showSignboardDetail = false;
    },
    closeTool() {
      this.dialog = false;
    },
  },
  async mounted() {
    await this.getSignboardData({ accessToken: window.localStorage.getItem('accessToken'), signboardId: this.$route.params.signboardId});
    this.imageSelect = this.selectedSignboard.images[0];
    
    let imageAnnotationDetails = {
      imgSrc: this.imageSelect.highResPath,
      imgId: this.imageSelect._id,
      fromSignboardDetail: true,
      signboardAnnotationList: this.imageSelect.signboardAnnotation.location.coordinates,
      cameraLocation: this.imageSelect.cameraLocation.coordinates,
      imageTitle: this.imageSelect.filename,
    }
    this.setImageAnnotationDetails(imageAnnotationDetails);
    
    this.setSignboardDetail(true);   
    this.dialog = true;
  },
  computed: {
    selectedSignboard() {
      return this.$store.state.signboard.selectedSignboard;
    },
    signboardLocation() {
      return this.$store.state.signboard.selectedSignboard && this.$store.state.signboard.selectedSignboard.location && this.$store.state.signboard.selectedSignboard.location.coordinates ?  [this.$store.state.signboard.selectedSignboard.location.coordinates[1], this.$store.state.signboard.selectedSignboard.location.coordinates[0]] : "";
    }
  },
  watch: {
    dialog: {
      handler(val) {
        if (val === false) {
          let canvas = document.getElementById("c").fabric;
          if (typeof canvas !== "undefined") {
          }
        }
      }
    }
  },
  destroyed() {
    this.setSignboardDetail(false); 
  }
}
</script>