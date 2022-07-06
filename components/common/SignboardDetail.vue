<template>
  <transition name="fade">
    <div class="signboard-detail__container" v-show="showSignboardDetail">
      <span class="close-btn">
        <v-btn class="mx-2" fab small @click="onCloseButtonClick">
          <v-icon dark>
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </span>
      <CommonSignboardListPanel
        v-show="computedShowResultPanel"
      ></CommonSignboardListPanel>
      <div
        v-if="
          storeSelectedSignboard &&
            storeSelectedSignboard.hasOwnProperty('id') &&
            storeSelectedSignboard.id !== '0'
        "
        key="test"
        class="signboard-detail__card-container"
      >
        <v-card class="signboard-detail__card">
          <v-container>
            <v-row>
              <v-col>
                <div v-if="storeSelectedSignboard &&
                      storeSelectedSignboard.images && 
                      storeSelectedSignboard.images.length > 0" class="signboard-detail__image-annotation-container">
                  <CommonImageAnnotationView
                    @onimageclick="onImageClick(storeSelectedSignboard.images[0]._id)"
                    canvasName="mainPic"
                    label="Image Captured"
                    :createdAt="storeSelectedSignboard.images[0].capturedAt"
                    :width="320"
                    widthCss="320"
                    :height="213"
                    :isZoom="true"
                    :imageTitle="storeSelectedSignboard.images[0].filename"
                    :imageSrc="storeSelectedSignboard.images[0].highResPath"
                    showViewIcon
                    :coordinates="coordinatesManipulation(this.storeSelectedSignboard.images[0].signboardAnnotation.location.coordinates[0])"
                    :fromSignboardDetail="true"
                    :signboardRevisionStatus="signboardRevisionStatus"
                  ></CommonImageAnnotationView>
                  <v-dialog v-model="dialog" content-class="dialog-container">
                    <CommonExpandedImageView
                      :imageProps="chosenImageDetails"
                      :fromSignboardDetail="true"
                      @close-expanded-view="closeExpandedView"
                    ></CommonExpandedImageView>
                  </v-dialog>
                </div>
              </v-col>
            </v-row>
            <SignboardFields :initialBuildingLocation="initialBuildingLocation"></SignboardFields>
          </v-container>
          <v-divider></v-divider>
          <v-container>
            <v-row>
              <v-col>
                <div class="other-angle-wrapper" v-if="storeSelectedSignboard &&
                      storeSelectedSignboard.images && 
                      storeSelectedSignboard.images.length > 0">
                  <CommonImageAnnotationView
                      v-for="imageElement of sImages"
                      :key="imageElement._id"
                      @onimageclick="onImageClick(imageElement._id)"
                      :canvasName="`angle${imageElement._id}`"
                      label="Image Captured"
                      :createdAt="imageElement.capturedAt"
                      :width="240"
                      :height="160"
                      widthCss="240"
                      :isZoom="true"
                      :imageSrc="imageElement.highResPath"
                      :imageTitle="imageElement.filename"
                      :coordinates="coordinatesManipulation(imageElement.signboardAnnotation.location.coordinates[0])"
                      :fromSignboardDetail="true"
                      :signboardRevisionStatus="signboardRevisionStatus"
                    ></CommonImageAnnotationView>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </div>
    </div>
  </transition>
</template>
<script>
import { apiKey } from "../../constants";
import { mapMutations, mapActions } from "vuex";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import moment from "moment";
import {DEFECT_TYPES} from '../../constants';
import {coordinatesManipulation} from '../utils/utils'

export default {
  props: [
    "selectedSignboard",
    "images",
    "showSignboardDetail",
    "needsBuildingAssignment",
    "fromSingleMap"
  ],
  data() {
    return {
      urls: [
        `https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`,
        `https://api.hkmapservice.gov.hk/osm/xyz/label-en/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`
      ],
      dialog: false,
      chosenImageDetails: {},
      isEditButtonClicked: false,
      buildingName: "14 Argyle Street",
      buildingItems: ["Building Z", "Building Y", "Building X"],
      isBuildingModalOpen: false,
      checkbox: false,
      showLess: true,
      currentStructureId: {struct_id: "", english_address: ""},
      panel: [0],
      select: {
        englishAddress: "",
        structId: "",
      },
      nearestBuildings: [],
      defectTypes: DEFECT_TYPES.reduce((acc,curr)=> ({...acc, [curr.id]: curr }),{}),
      coordinatesManipulation
    };
  },
  computed: {
    storeSelectedSignboard() {
      return !_isEmpty(this.$store.state.signboard.selectedSignboard.location)
        ? this.$store.state.signboard.selectedSignboard
        : [];
    },
    computedShowResultPanel () {
      return this.$store.state.signboard.showResultPanel;
    },
    initialBuildingLocation() {
      return {
        englishAddress: this.storeSelectedSignboard.buildingDetails.englishAddress,
        structId: this.storeSelectedSignboard.buildingDetails.structId
      }
    },
    signboardRevisionStatus() {
      return _get(this.$store.state, "signboard.selectedSignboard.revisionStatus.signboardIdentificationRevised.status", "");
    },
    hasSecondPhotoAngle() {
      return this.storeSelectedSignboard.images.length > 2 ? true : false;
    },
    hasFirstPhotoAngle() {
      return this.storeSelectedSignboard.images.length > 1 ? true : false;
    },
    sImages() {
      return this.storeSelectedSignboard.images ? this.storeSelectedSignboard.images.slice(1,3) : []
    }
  },
  methods: {
    ...mapMutations({
      setSelectedSignboardToEmpty: "signboard/setChosenSignboardToEmpty",
      setImageAnnotationDetails: "signboard/setImageAnnotationDetails"
    }),
    ...mapActions({
      getBuildings: "signboard/getBuildings",
      getSignboardData: "signboard/getSignboardData",
    }),
    onCloseButtonClick() {

      if(!_isEmpty(this.fromSingleMap)) {
        this.setSelectedSignboardToEmpty();
      }
      
      this.$emit("closebtnclick");
    },
    onImageClick(selectedImageId) {
      const foundImageObject = this.storeSelectedSignboard.images.find((image) => image._id === selectedImageId);
      
      this.chosenImageDetails = {...foundImageObject, 
        medResPath: foundImageObject.mediumResPath, 
        imgId: selectedImageId,
        tripRefId: this.storeSelectedSignboard.tripRefId,
        groupId: this.storeSelectedSignboard.groupId
      };
      
      let imageAnnotationDetails = {
        imgSrc: foundImageObject.highResPath,
        imgId: selectedImageId,
        fromSignboardDetail: true,
        isDefectTool: true,
        signboardAnnotationList: this.chosenImageDetails.coordinates,
        cameraLocation: this.chosenImageDetails.cameraLocation,
        isUsedIn3dModelGen: this.chosenImageDetails.isUsedIn3dModelGen
      }
      this.setImageAnnotationDetails(imageAnnotationDetails);

      this.dialog = true;
    },
    async onOpen(e) {
      await this.getBuildings({lat: this.storeSelectedSignboard.buildingDetails.lat, long: this.storeSelectedSignboard.buildingDetails.lon, precision: 10.0});
      this.nearestBuildings = this.$store.state.signboard.nearestBuildings
    },
    async closeExpandedView() {
      this.dialog = false;
      if(this.storeSelectedSignboard?.signboardId){
        await this.getSignboardData({ accessToken: window.localStorage.getItem('accessToken'), signboardId: this.storeSelectedSignboard.signboardId});
      }
    },
  },
  mounted() {
    this.buildingItems.push(this.buildingName);
  }
};
</script>
