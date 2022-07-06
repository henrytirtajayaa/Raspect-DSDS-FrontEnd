<template class="image-location-details">
  <div>
    <div class="image-location-details__slider-container">
      <div>
        <v-btn
          elevation="0"
          color="transparent"
          @click="changeImageAnnotation(-1)"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </div>
      <div class="image-location-details__image-text text-center">
        {{ imageTitle }}
      </div>
      <div>
        <v-btn
          elevation="0"
          color="transparent"
          @click="changeImageAnnotation(1)"
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </div> 
    <div>
      <v-btn 
        v-show="this.selectedSignboard.signboardId!=undefined || 
          this.selectedSignboard.signboardId!=''"
        color="white"
        style="width:140px;"
        solo
        elevation="0"
        @click="onOpenSignboardId"
        :ripple="false">
        <CommonFindSignboardIcon />
        <span class="text text--bold text--blue">
          Go to Signboard View
        </span>
      </v-btn>
    </div>
    <div>
      <p class="image-location-details__image-location-text">Image location</p>
    </div>
    <SignboardCameraAngleMap
      :carAngle="carAngle"
      :cameraLocation="cameraLocation"
    ></SignboardCameraAngleMap>
    <div class="image-location-details__date-time-container">
      <div
        class="image-location-details__capture-date-time-text image-location-details__capture-date-time-text--bold"
      >
        Captured Date and Time:
      </div>
      <div
        class="image-location-details__capture-date-time-text image-location-details__capture-date-time-text--space-up"
      >
        {{ computedDateTime }}
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { mapMutations } from "vuex";
export default {
  props: ["carAngle", "cameraLocation", "imageTitle", "dateTime"],
  computed: {
    selectedSignboard() {
      return this.$store.state.signboard.selectedSignboard;
    },
    computedDateTime() {
      return moment(this.dateTime).format("DD MMMM YYYY HH:mm:ss");
    },
    tripAnglePhotos() {
      return this.$store.state.trips.photos;
    }
  },
  methods: {
    changeImageAnnotation(direction) {
      let foundImageObject = [];
      for (let i = 0; i < this.tripAnglePhotos.length; i++) {
        if (this.carAngle === this.tripAnglePhotos[i].shootingDirection) {
          let index = i + direction;
          if (index >= this.tripAnglePhotos.length) {
            index = 0;
          } else if (index < 0) {
            index = this.tripAnglePhotos.length - 1;
          }

          foundImageObject = this.tripAnglePhotos[index];
          let imageAnnotationDetails = {
            imgSrc: foundImageObject.highResPath,
            imgId: foundImageObject._id,
            fromSignboardDetail: true,
            cameraLocation: foundImageObject.cameraLocation.coordinates,
            isDefectTool: true,
            carAngle: foundImageObject.shootingDirection,
            imageTitle: foundImageObject.filename,
            signboardAnnotationList: foundImageObject.signboardimages,
            isUsedIn3dModelGen: foundImageObject.isUsedIn3dModelGen,
          };
          this.setImageAnnotationDetails(imageAnnotationDetails);
          break;
        }
      }
    },
    async onOpenSignboardId() {
      window.open(`/${this.selectedSignboard.signboardId}/selected-signboard-map`, '_blank').focus();
    },
    ...mapMutations({
      setImageAnnotationDetails: "signboard/setImageAnnotationDetails"
    })
  }
};
</script>
