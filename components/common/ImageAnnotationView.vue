<template>
  <div :style="{ width: `${widthCss}px` }" class="card">
    <div v-show="!isLoading">
      <div class="card__title-container" v-if="!hideHeader" >
        <div class="text text--medium card__title">
          {{ imageTitle }}
        </div>
        <div
          style="cursor: pointer"
          @click="$emit('onimageclick', { medResPath, imageTitle, imgId, signboardAnnotationList, carAngle })"
        >
          <CommonViewIcon></CommonViewIcon>
        </div>
      </div>
      <v-card class="card__container" elevation="0" @click="$emit('onimageclick', { medResPath, imageTitle, imgId, signboardAnnotationList, carAngle })">
        <canvas :id="canvasName" :width="width" :height="height"></canvas>
      </v-card>
      <div class="card__bottom-text" v-if="!hideBottomText">
        <div class="text text--extra-small" v-show="createdAt !== undefined">{{ label }}</div>
        <div class="text text--extra-small">{{ dateOfSurvey }}</div>
      </div>
    </div>
    <template v-if="isLoading">
      <v-sheet
        :color="`grey lighten-4`"
        class="pa-3"
      >
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="card"
        ></v-skeleton-loader>
      </v-sheet>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import canvasMixin from '../../mixins/canvas.js';
import _isEmpty from "lodash/isEmpty";
import { mapCoordinates } from '../utils/utils';

export default {
  props: {
    label: String,
    width: Number,
    height: Number,
    imageSrc: {
      default: "https://cdn.vuetifyjs.com/images/cards/cooking.png"
    },
    imageTitle: {
      default: "RANDOM IMAGE TITLE"
    },
    imgId: String,
    medResPath: String,
    createdAt: String,
    annotation: Array,
    canvasName: String,
    coordinates: Array,
    signboardAnnotationList: {
      default: ()=>[]
    },
    carAngle: {
      default: ()=>[]
    },
    signboardRevisionStatus: String || Array,
    fromSignboardDetail: Boolean,
    hideHeader: {
      default: false
    },
    hideBottomText: {
      default: false
    },
    isZoom: {
      default: false
    },
    widthCss: {
      default: "320"
    }
  },
  computed: {
    dateOfSurvey() {
      return this.createdAt !== undefined ? moment(this.createdAt).format("D MMM YYYY HH:mm:ss") : '';
    }
  },
  methods: {
    handleImageChange(imageObject) {

      const canvasInfo = {
        id: this.canvasName,
        width: this.width,
        height: this.height
      }

      if(!this.fromSignboardDetail) {
        let coordinateArray = [];

        coordinateArray = this.signboardAnnotationList.length > 0 ? this.signboardAnnotationList.map(mapCoordinates) : [];

        this.drawImageAndAnnotations(coordinateArray, imageObject.imageSrc, canvasInfo, [], this.isZoom, []);
      } else if (this.fromSignboardDetail) {
        let signboardRevisionStatus = this.$store.state.signboard.selectedSignboard.revisionStatus.signboardIdentificationRevised.status;
        let array = [];
        array.push(signboardRevisionStatus);
        this.drawImageAndAnnotations([{ coordinates: imageObject.coordinates, strokeColor: "yellow" }], imageObject.imageSrc, canvasInfo, array, this.isZoom);
      } else {
        this.drawImageAndAnnotations([{ coordinates: imageObject.coordinates, strokeColor: "yellow" }], imageObject.imageSrc, canvasInfo, [], this.isZoom);
      }
    }
  },
  mixins: [canvasMixin],
  watch: {
    "$props": {
      deep: true,
      handler(object) {

        this.handleImageChange(object);
      }
    }
  },
  mounted() {
    this.handleImageChange(this);
  }
};
</script>
