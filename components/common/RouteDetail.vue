<template class="route-detail">
  <transition name="fade">
    <div class="route-detail__container" id="route-detail__container">
      <div id="drag"></div>
      <span class="route-detail__close-btn">
        <v-btn class="mx-2" fab small @click="onCloseButtonClick">
          <CommonArrowRightLightIcon />
        </v-btn>
      </span>
      <v-card width="1200px" class="route-detail__card">
        <v-container>
          <div class="route-detail__data-container">
            <div class="route-detail__detail-container">
              <div class="text text--large route-detail__data-text">
                <v-row>
                  <v-col cols="1">
                    <span class="text text--medium">Batch ID:</span>
                  </v-col>
                  <v-col cols="2"> 
                    <v-text-field type="number" :min=1
                    class="text text--secondary-style text--medium text--bold"
                     outlined dense v-model='lastBatchId' @change="searchBatchId(lastBatchId, 0)"></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <span class="text text--medium">Capture Date:</span>
                  </v-col>
                  <v-col cols="3">
                    <span class="text text--secondary-style text--medium text--bold">{{ captureDate }}</span>
                  </v-col>
                  <v-col cols="1">
                    <span class="text text--medium">Sampling:</span>
                  </v-col>
                  <v-col cols="2">
                    <span class="text text--secondary-style text--medium text--bold">{{ computedIsSampled }}</span>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </v-container>
        <v-container class="angle-details" v-if="tripAnglePhotos.length > 0">
          <div class="angle-details__top-row">
            <v-row>
              <v-col cols="4" v-for="item of upperImageArray" :key="item">
                <CommonImageAnnotationView
                  label="Date of survey:"
                  @onimageclick="onImageClick"
                  :imageSrc="getFieldFromDirection(item, 'lowResPath')"
                  :medResPath="getFieldFromDirection(item, 'mediumResPath')"
                  :imageTitle="getFieldFromDirection(item, 'filename')"
                  :createdAt="getFieldFromDirection(item, 'capturedAt')"
                  :capturedAt="getFieldFromDirection(item, 'capturedAt')"
                  :imgId="getFieldFromDirection(item, '_id')"
                  :canvasName="`tripAngle${item}`"
                  :signboardAnnotationList="getFieldFromDirection(item, 'signboardimages')"
                  :carAngle="getFieldFromDirection(item, 'shootingDirection')"
                  :fromSignboardDetail="false"
                  :width="computedWidth"
                  :height="computedHeight"
                  :widthCss="computedWidth"
                  :isZoom="false"
                >
                </CommonImageAnnotationView>
              </v-col>
            </v-row>
          </div>

          <SignboardCarCanvas></SignboardCarCanvas>
          <div class="angle-details__bottom-row">
            <v-row>
              <v-col cols="4" v-for="item of lowerImageArray" :key="item">
                <CommonImageAnnotationView
                  label="Date of survey:"
                  @onimageclick="onImageClick"
                  :imageSrc="getFieldFromDirection(item, 'lowResPath')"
                  :medResPath="getFieldFromDirection(item, 'mediumResPath')"
                  :imageTitle="getFieldFromDirection(item, 'filename')"
                  :createdAt="getFieldFromDirection(item, 'createdAt')"
                  :capturedAt="getFieldFromDirection(item, 'capturedAt')"
                  :imgId="getFieldFromDirection(item, '_id')"
                  :canvasName="`tripAngle${item}`"
                  :signboardAnnotationList="getFieldFromDirection(item, 'signboardimages')"
                  :carAngle="getFieldFromDirection(item, 'shootingDirection')"
                  :fromSignboardDetail="false"
                  :width="computedWidth"
                  :height="computedHeight"
                  :widthCss="computedWidth"
                  :isZoom="false"
                ></CommonImageAnnotationView>
              </v-col>
            </v-row>
          </div>
          <v-dialog v-model="dialog" content-class="dialog-container">            
            <CommonExpandedImageView
              :imageProps="chosenImageDetails"
              @close-expanded-view="closeExpandedView"
              :fromSignboardDetail="false"
            ></CommonExpandedImageView>
          </v-dialog>
        </v-container>
        <v-container v-else>
          <SignboardCarCanvas></SignboardCarCanvas>
        </v-container>
      </v-card>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import _get from 'lodash/get';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';
import { DEFAULT_PREVIEW_IMAGE_WIDTH, TRIP_DETAIL_MEDIUM_VIEWPORT, DEFAULT_PREVIEW_IMAGE_HEIGHT } from '../../constants';

export default {
  mounted() {
    var isResizing = false;
    let self = this;
    var container = document.getElementById("app"),
        right = document.getElementById("route-detail__container"),
        handle = document.getElementById("drag");

    handle.onmousedown = function(e) {
      e.preventDefault()
      isResizing = true;
    };

    document.onmousemove = function(e) {
      e.preventDefault()
      if (!isResizing) {
        return;
      }

      self.offsetRight = container.clientWidth - (e.clientX - container.offsetLeft) > 1200 ? 1200 : container.clientWidth - (e.clientX - container.offsetLeft);

      right.style.width = self.offsetRight + "px";
    }

    document.onmouseup = function(e) {
      isResizing = false;
    }
  },
  data() {
    return {
      dialog: false,
      chosenImageDetails: "",
      upperImageArray: ['left_back', 'left', 'left_front'],
      lowerImageArray: ['right_back', 'right', 'right_front'],
      offsetRight: 1200,
      lastBatchId: 0,
      lastTripRefId: ""
    };
  },
  watch: {
    batchId(newVal){
      if(this.lastBatchId < 0) {
        // when user input below zero / negative, it will return 0
        this.lastBatchId = 0
      }else{
        this.lastBatchId = this.batchId
      }
    }
  },
  computed: {
    tripAnglePhotos() {
      return this.$store.state.trips.photos;
    },
    batchId() {
      return this.tripAnglePhotos.length > 0 ? this.tripAnglePhotos[0].batchNo : 0;
    },
    captureDate() {
      if(this.tripAnglePhotos.length > 0 && this.tripAnglePhotos[0].capturedAt){
        return moment(this.tripAnglePhotos[0].capturedAt).format("DD-MMM-YYYY hh:MM:ss");
      } else {
        return "";
      }
    },
    computedIsSampled () {
      return this.tripAnglePhotos.length > 0 && this.tripAnglePhotos[0].sampling ? "Sampled" : "Not Sampled";
    },
    computedWidth () {
      if (this.offsetRight <= TRIP_DETAIL_MEDIUM_VIEWPORT) {
        return DEFAULT_PREVIEW_IMAGE_WIDTH / 1.5
      } else {
        return DEFAULT_PREVIEW_IMAGE_WIDTH
      }
    },
    computedHeight () {
      if (this.offsetRight <= TRIP_DETAIL_MEDIUM_VIEWPORT) {
        return DEFAULT_PREVIEW_IMAGE_HEIGHT / 1.5
      } else {
        return DEFAULT_PREVIEW_IMAGE_HEIGHT
      }
    }
  },
  methods: {
    doThis() {
      this.dialog = false;
    },
    onImageClick(imageDetails) {
      const { imgId } = imageDetails;
      const foundImageObject = this.tripAnglePhotos.find((image) => image._id === imgId);

      this.chosenImageDetails = { ...foundImageObject, ...imageDetails, cameraLocation: this.$store.state.trips.selectedPoint };

      let imageAnnotationDetails = {
        imgSrc: foundImageObject.highResPath,
        imgId,
        fromSignboardDetail: true,
        isDefectTool: true,
        signboardAnnotationList: this.chosenImageDetails.signboardAnnotationList,
        carAngle: this.chosenImageDetails.shootingDirection,
        cameraLocation: this.chosenImageDetails.cameraLocation,
        isUsedIn3dModelGen: this.chosenImageDetails.isUsedIn3dModelGen,
        imageTitle: this.chosenImageDetails.filename
      }
      this.setImageAnnotationDetails(imageAnnotationDetails);

      this.dialog = true;
    },
    onCloseButtonClick() {
      this.$emit("closebtnclick");
    },
    changeImages(direction) {
      if(this.tripAnglePhotos.length > 0) {
        this.getPhotoBatch({
          batchNo: this.tripAnglePhotos[0].batchNo,
          direction,
          tripId: this.tripAnglePhotos[0].tripRefId
        });
      }
    },

    searchBatchId(batchId, direction) {
      if(this.tripAnglePhotos.length > 0) {
          this.lastTripRefId = this.tripAnglePhotos[0].tripRefId
      }

      this.getPhotoBatch({
          batchNo: batchId,
          direction,
          tripId: this.lastTripRefId
      });
    },
    
    ...mapActions({
      getPhotoBatch: 'trips/getPhotoBatch',
      downloadTripImages: "trips/downloadTripImages"
    }),
    ...mapMutations({
      setImageAnnotationDetails: "signboard/setImageAnnotationDetails"
    }),
    closeExpandedView() {
      this.dialog = false;
    },
    getField(tripObject, field) {
      return _get(tripObject, field, "");
    },
    getFieldFromDirection(direction, field) {
      let foundPhotoObject = this.tripAnglePhotos.find((photo) => photo.cameraDirection === direction);

      return !_isEmpty(foundPhotoObject) && !_isEmpty(foundPhotoObject[field]) ? foundPhotoObject[field] : "";
    }
  }
};
</script>
