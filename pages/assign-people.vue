<template>
  <div class="survey d-flex" id="map-wrap">
    <client-only>
      <l-map
        ref="map"
        style="z-index: 0;"
        attributionControl="false"
        :center="[22.3193, 114.1694]"
        :options="{ zoomControl: false, minZoom: 11 }"
        :zoom="15"
        @ready="onMapReady"
        @update:bounds="boundsUpdated"
      >
        <template v-for="tileUrl in tileUrls">
          <l-tile-layer
            :url="tileUrl"
            :options="{ maxNativeZoom: 20, maxZoom: 21 }"
          ></l-tile-layer>
        </template>
        <CommonSearchPanelSurveyId
          @toggleSearch="toggleSearch"
          @onFilterResult="onFilterResult"
          @clearSearch="clearSearch"
          :minimizeSearch="minimizeSearch"
          :surveyIds="surveyIds"
        />
      <l-control position="bottomleft">
        <v-alert v-model="alert" type="error" dismissible>
          {{ alertText }}
        </v-alert>
      </l-control>
      </l-map>
    </client-only>
    <TeamDetail
      :showPeopleDetail="computedShowPeopleDetail"
      :isLoadingCard="isLoadingCard"
      @closebtnclick="onTabClose"
      @deselect-layers="deselectLayers"
    ></TeamDetail>
  </div>
</template>
<script>
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import { apiKey, FILTER_ALL_MARKER, FILTER_ALL_TYPES } from "../constants";
import { mapActions, mapMutations } from "vuex";
import commonMapUtilMixin from "../mixins/common-map-util.js";
import surveyMixin from "../mixins/survey.js";
import _isEmpty from 'lodash/isEmpty';

export default {
  data() {
    return {
      tileUrls: [
        `https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`,
        `https://api.hkmapservice.gov.hk/osm/xyz/label-en/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`
      ],
      polygons: [],
      editableLayers: {},
      isEditing: false,
      showPeopleDetail: false,
      surveyAreas: [],
      bounds: [],
      typeFilter: FILTER_ALL_TYPES,
      showOnly: false,
      isLoadingCard: false,
    };
  },
  async mounted() {
    await this.getUsersPost({
      searchString: "."
    });
    await this.getSurveys({
      accessToken: window.localStorage.getItem("accessToken")
    });
    const self = this;
    const surveyAreas = [];
    for (let i = 0; i < self.surveyArea.length; i++) {
      if (self.surveyArea[i].boundaryPoints && self.surveyArea[i].boundaryPoints.coordinates.length > 1) {
        const surveyArea = {
          "type": "Feature", 
          "geometry" : {
            "type": "Polygon",
            "coordinates" : [ self.surveyArea[i].boundaryPoints.coordinates.map(pair => {
                              return [pair[0], pair[1]];
                            })]
          },
          "properties": { "surveyId": self.surveyArea[i].surveyId, "id": self.surveyArea[i]._id },
          };

          surveyAreas.push(surveyArea);
      };
    };

    this.surveyAreas = surveyAreas;

    const features = window.L.geoJSON(surveyAreas, {
      style : {
        fillColor: '#333333',
        color: '#333333',
        weight: 2.5,
        opacity: .9,
        fillOpacity: .3
      },
      onEachFeature : colorChanging
    })
    .addTo(this.$refs.map.mapObject);

    function colorChanging (feature, layer) {
      layer.on('mouseover', (e) => {
          layer.setStyle({
              fillOpacity: .4
          });
      });
      layer.on('mouseout', (e) => {
          layer.setStyle({
              fillOpacity: .3
          });
      });
      layer.on('add', (e) => {
          if (feature.properties.surveyId === self.selectedSurvey.surveyId) {
            layer.setStyle({
              fillColor: '#3388ff',
              color: '#3388ff'
            })
          }
      });
      layer.on('click', (e) => {
          features.resetStyle();
          layer.setStyle({
              fillColor: '#3388ff',
              color: '#3388ff'
          });
          self.onClick(e);
      });
    }

    (_isEmpty(this.selectedSurvey)) ? this.showPeopleDetail = false : this.showPeopleDetail = true;
  },
  mixins: [commonMapUtilMixin, surveyMixin],
  methods: {
    onClick (e) {
      this.showTabDetail(e.target)
    },
    onTabClose() {
      this.showPeopleDetail = false;
      this.resetSelectedSurvey();
    },
    ...mapActions({
      getSurveys: "survey/getSurveys",
      searchSignboard: "signboard/searchSignboards",
      deleteSurvey: "survey/deleteSurvey",
      getSelectedSurvey: "survey/getSelectedSurvey",
      resetSelectedSurvey: "survey/resetSelectedSurvey",
      getUsersPost: "user/getUsersPost"
    }),
    setTypeFilter(filter) {
      if (filter === this.typeFilter) {
        this.typeFilter = FILTER_ALL_TYPES;
      } else {
        this.typeFilter = filter;
      }
    },
    onMapReady() {
      this.bounds = [
        [
          this.$refs.map.mapObject.getBounds().getNorthWest().lat,
          this.$refs.map.mapObject.getBounds().getNorthWest().lng
        ],
        [
          this.$refs.map.mapObject.getBounds().getSouthEast().lat,
          this.$refs.map.mapObject.getBounds().getSouthEast().lng
        ]
      ];

      this.beforeSearchSignboard(this.$refs.map.mapObject._zoom, true);
    },
    async showTabDetail(layer) {
      this.showPeopleDetail = true;
      this.showOnly = true;
      this.isLoadingCard = true;
      await this.getSelectedSurvey({surveyId: layer.feature.properties.surveyId});
      this.isLoadingCard = false;
    }
  },
  computed: {
    surveyArea() {
      return this.$store.state.survey.surveyArea;
    },
    computedShowPeopleDetail() {
      return this.showPeopleDetail;
    },
    selectedSurvey() {
      return this.$store.state.survey.selectedSurvey;
    },
    selectedSurvey() {
      return this.$store.state.survey.selectedSurvey;
    }
  }
};
</script>
