<template class="expanded-image-view">
  <div class="text">
    <v-card width="861" height="700">
      <v-card-title>
        {{
          fromSignboardDetail
            ? imageProps.originalFilename
            : imageProps.imageTitle
        }}
        <v-spacer></v-spacer>
        <span><v-icon @click="closeTool">mdi-close</v-icon></span>
      </v-card-title>

      <!-- <v-img :src="fromSignboardDetail ?  imageProps.mediumResPath : imageProps.medResPath"> </v-img> -->
      <!-- <v-skeleton-loader width="861" type="image" v-if="loading"/> -->
      <canvas id="expandedImageView"></canvas>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn v-if="fromSignboardDetail && USER_ROLE.SUPER_ADMIN == role" @click="click3DView()">
          3D view
        </v-btn>
        <v-btn v-if="!fromSignboardDetail && USER_ROLE.SUPER_ADMIN == role" @click="clickAllPredictionImage()">
          All prediction Image
        </v-btn>
        <div v-if="fromSignboardDetail">
          <v-btn 
            color="white"
            style="width:150px;"
            solo
            elevation="0"
            @click="goToTripData()"
            :ripple="false">
            <CommonTripDataIcon />
            <span class="text text--bold text--blue">
              Go to Trip Data
            </span>
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              @click="onItemClick()"
              v-show="isUsedIn3dModelGen"
            >
              <template v-if="!fromSignboardDetail">
                SIGNBOARD ANNOTATION
              </template>
              <template v-else>
                DEFECT ANNOTATION
              </template>
            </v-btn>
            <v-col cols="3" id="btn-select--expandimage">
              <v-select
                outlined
                solo
                :menu-props="{ bottom: true, offsetY: true }"
                :elevation="0"
                color="primary"
                v-model="selected"
                :items="itemExport"
                label="Export Image"
                @input="exportselectedImage"
                class="pa-0 ma-0"
              ></v-select>
            </v-col>
          </template>
        </v-menu>
      </v-card-actions>
    </v-card>
    <!-- remove the whole annotation tool after close -->
    <v-dialog
      v-if="annotationDialog" 
      v-model="annotationDialog"
      click:outside="disposeCanvas"
      persistent
    >
      <CommonAnnotationTool
        :imgSrc="imageComputed"
        :imgId="imageProps.imgId"
        :key="imageProps.id"
        :fromSignboardDetail="fromSignboardDetail"
        :isDefectTool="isDefectTool"
        :signboardAnnotationList="imageProps.signboardAnnotationList"
        :carAngle="imageProps.carAngle"
        :cameraLocation="imageProps.cameraLocation"
        :imageTitle="imageProps.imageTitle"
        :dateTime="imageProps.capturedAt"
        @close-tool="closeTool"
      >
      </CommonAnnotationTool>
    </v-dialog>
    <v-overlay :value="isLoading">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import canvasMixin from "../../mixins/canvas.js";
import _isEmpty from "lodash/isEmpty";
import {
  exportImage,
  exportImageOriginal,
  mapCoordinates,
  coordinatesManipulation
} from "../utils/utils";
import { mapActions } from "vuex"
import path from 'path';
import {USER_ROLE} from "../../constants";

export default {
  data() {
    return {
      annotationDialog: false,
      isDefectTool: false,
      items: [
        {
          title: "Defect Annotation Tool",
          id: "defectTool"
        },
        {
          title: "Signboard Annotation Tool",
          id: "annotationTool"
        }
      ],
      selected: "Export Image",
      itemExport: ["Original Image", "Image with Bounding box"],
      isLoading: false,
      exportImage,
      exportImageOriginal,
      coordinatesManipulation,
      USER_ROLE,
    };
  },
  mixins: [canvasMixin],
  props: {
    imageProps: {
      default: "https://cdn.vuetifyjs.com/images/cards/cooking.png",
      imgSrc: String,
      medResPath: String,
      id: String,
      highResPath: String,
      signboardAnnotation: Object,
      signboardAnnotationList: Array,
      defectAnnotations: Array,
      carAngle: Number,
      cameraLocation: Array,
      imageTitle: String,
      tripRefId: String,
      groupId: String
    },
    fromSignboardDetail: Boolean
  },
  computed: {
    imageComputed() {
      if (this.fromSignboardDetail) {
        return this.imageProps.highResPath;
      } else {
        const tripImage = this.$store.state.trips.photos.find(imageObj => {
          return imageObj._id === this.imageProps.imgId;
        });

        return tripImage !== undefined ? tripImage.highResPath : "";
      }
    },
    isUsedIn3dModelGen() {
      return this.$store.state.signboard.imageAnnotation.isUsedIn3dModelGen;
    },
    role() {
      return this.$store.state.user.userRole;
    }
  },
  methods: {
    openAnnotationTool() {
      this.annotationDialog = true;
    },
    disposeCanvas() {
      let canvas = document.getElementById("c").fabric;
      if (typeof canvas !== "undefined") {
        // canvas.clear();
      }
    },
    onItemClick() {
      if (this.fromSignboardDetail) {
        this.openAnnotationTool();
        this.isDefectTool = true;
      } else {
        this.openAnnotationTool();
        this.isDefectTool = false;
      }
    },
    handleOnImageChange(imageObject) {
      const canvasInfo = {
        id: "expandedImageView",
        width: 1920,
        height: 1280
      };
      if (!_isEmpty(imageObject.imageProps.signboardAnnotationList)) {
        let coordinateArray = [];

        coordinateArray = imageObject.imageProps.signboardAnnotationList.map(
          mapCoordinates
        );
        this.drawImageAndAnnotations(
          coordinateArray,
          imageObject.imageProps.highResPath,
          canvasInfo,
          []
        );
      } else if (
        imageObject.imageProps.signboardAnnotation !== undefined &&
        !_isEmpty(
          imageObject.imageProps.signboardAnnotation.location.coordinates[0]
        ) &&
        this.fromSignboardDetail
      ) {
        let signboardRevisionStatus = this.$store.state.signboard
          .selectedSignboard.revisionStatus.signboardIdentificationRevised
          .status;
        let array = [];
        array.push(signboardRevisionStatus);

        const coordinates = this.coordinatesManipulation(imageObject.imageProps.signboardAnnotation.location.coordinates[0])

        this.drawImageAndAnnotations(
          [
            {
              coordinates,
              strokeColor: "yellow"
            }
          ],
          imageObject.imageProps.highResPath,
          canvasInfo,
          array
        );
      } else if (
        _isEmpty(imageObject.imageProps.signboardAnnotationList) &&
        !this.fromSignboardDetail
      ) {
        this.drawImageAndAnnotations(
          [],
          imageObject.imageProps.highResPath,
          canvasInfo,
          []
        );
      }
    },
    closeTool() {
      this.$emit("close-expanded-view");
      this.annotationDialog = false;
    },
    async exportselectedImage() {
      if (this.selected === "Image with Bounding box") {
        exportImage("expandedImageView");
      } else {
        this.isLoading = true;
        await exportImageOriginal(
          this.imageProps.filename,
          this.imageProps.tripRefId,
          { accessToken: window.localStorage.getItem("accessToken") }
        );
        this.isLoading = false;
      }
    },
    ...mapActions({
      getLidarImagePath: 'trips/getLidarImagePath',
      getAllPredictionImagePath: 'trips/getAllPredictionImagePath',
    }),
    async click3DView(){
      const {html, image} = await this.getLidarImagePath({
        refId: this.imageProps.tripRefId, 
        filename: path.basename(this.imageProps.filename, '.jpg'), 
        groupId: this.imageProps.groupId
      });
      window.open(html, '_blank').focus();
      window.open(image, '_blank').focus();
    },
    async clickAllPredictionImage(){
      const imagePath = await this.getAllPredictionImagePath({
        refId: this.imageProps.tripRefId, 
        filename: path.basename(this.imageProps.filename, '.jpg'), 
      });
      window.open(imagePath, '_blank').focus();
    },
    async goToTripData() {
      window.open(`/${this.imageProps.tripRefId}/${this.imageProps.batchNo}/trip-view`, '_blank').focus();
    },
  },
  watch: {
    $props: {
      deep: true,
      handler(object) {
        this.handleOnImageChange(object);
      }
    },
    annotationDialog: {
      handler(val) {
        if (val === false) {
          let canvas = document.getElementById("c").fabric;
          if (typeof canvas !== "undefined") {
          }
        }
      }
    }
  },
  mounted() {
    this.handleOnImageChange(this);
  }
};
</script>
