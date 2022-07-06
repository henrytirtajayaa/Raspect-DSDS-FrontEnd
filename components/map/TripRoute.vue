<template class="trip-route">
  <client-only>
    <l-map style="z-index: 0;" :zoom="15" :center="mapCenter" ref="myMap" :options="{zoomControl: false}">
      <template v-for="tileUrl in tileUrls">
        <l-tile-layer :url="tileUrl" :options="{maxNativeZoom: 20, maxZoom: 21}" :key="tileUrl.id"></l-tile-layer>
      </template>
      <l-marker v-if="selectedPoint" :lat-lng="[selectedPoint[1], selectedPoint[0]]"></l-marker>
      <template v-for="trip in trips">
        <template v-if="filterSurveyId.length !== 0 && filterTripId !== ''">
          <template v-if="tripColors[trip.refId]">
            <l-polyline :key="trip.refId" @click="onRouteClick($event)" :options="{refId: trip.refId, sampled: false}" :weight="5" :lat-lngs="[...trip.waypoints]" :color="tripColors[trip.refId].color" dashArray="5,8">
            </l-polyline>
          </template>
        </template>
        <template v-else-if="filterSurveyId.length !== 0 && filterTripId === ''">
          <template v-if="tripColors[trip.refId]">
            <l-polyline :key="trip.refId" @click="onRouteClick($event)" :options="{refId: trip.refId, sampled: false}" :weight="5" :lat-lngs="[...trip.waypoints]" :color="tripColors[trip.refId].color" dashArray="5,8">
            </l-polyline>
          </template>
        </template>
        <template v-else>
          <l-polyline :key="trip.refId" @click="onRouteClick($event)" :options="{refId: trip.refId, sampled: false}" :weight="5" :lat-lngs="[...trip.waypoints]" :color="getSurveyColor(trip.surveyId)">
          </l-polyline>
        </template>
        <template v-if="trip.sampledWaypoints.length  > 0">
          <l-polyline :key="`${trip.refId}-sampled`" @click="onRouteClick($event)" :options="{refId: trip.refId, sampled: true}" :weight="5" :lat-lngs="[...trip.sampledWaypoints]" color="black">
          </l-polyline>
        </template>
      </template>
      <l-control-scale position="topright" :imperial="true" :metric="true"></l-control-scale>
      <l-control position="topleft" style='order: 1;'>
        <template v-if="!minimizeFields">
          <CommonSearchPanel v-bind:fromTripRoute="true" v-bind:userDefinedWidth="1000" @panTo="pan"></CommonSearchPanel>
        </template>
      </l-control>
      <l-control position="topleft" style="order: 3;">
         <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
          <template v-if="!minimizeFields" v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="dateRangeText"
                label="Trip Date Range"
                readonly
                v-bind="attrs"
                v-on="on"
                solo
                dense
                class="text text--small trip-route__date-range-field"
                outlined
                flat
            ></v-text-field>
          </template>
          <v-date-picker v-model="dates" no-title scrollable range>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">
                Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">
                OK
            </v-btn>
          </v-date-picker>
         </v-menu>
      </l-control>
      <l-control position="topleft" style="order: 4;">
        <template v-if="!minimizeFields">
          <v-btn @click="resetFilter" outlined color="primary" class="trip-route__clear-search-btn">
              Clear Search
          </v-btn>
        </template>
      </l-control>
      <l-control position="topleft" style="order: 0;">
        <v-btn @click="toggleMinimizeFields" outlined class="trip-route__minimize-btn">
          <template v-if='minimizeFields'>
            <v-icon>mdi-magnify</v-icon>
          </template>
          <template v-else>
            <v-icon>mdi-chevron-up</v-icon>
          </template>
        </v-btn>
      </l-control>
      <l-control position="bottomleft">
        <v-alert v-model="alert" type="error" dismissible>
          Center point undefined
        </v-alert>
        <MapRouteLegend @on-trip-click="onTripClick"></MapRouteLegend>
      </l-control>
      <MapSearchControl
          :apiKey="apiKey"
          ref="locationSearch"
      ></MapSearchControl>
    </l-map>
  </client-only>
</template>

<script>
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
import { apiKey, DEFAULT_BOUNDARY } from "../../constants"
import { mapActions, mapState, mapMutations } from "vuex";
import moment from 'moment';
import _ from 'lodash';
import commonMapUtilMixin from '../../mixins/common-map-util.js';
import { mapFields } from 'vuex-map-fields';

export default {
  data() {
    return {
      apiKey: apiKey,
      geosearchOptions: { // Important part Here
        provider: null
      },
      tileUrls: [
        `https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`,
        `https://api.hkmapservice.gov.hk/osm/xyz/label-en/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`
      ],
      routes: [
        { latlngs:[[22.302711,114.177216], [22.302811,114.177516], [22.303711,114.179216],[22.313711,114.199216]]},
      ],
      dates: [],
      menu: '',
      date: '',
      alert: false,
      surveyColor: {},
      ConstantBoundary: DEFAULT_BOUNDARY
    }
  },
  mixins: [commonMapUtilMixin],
  computed: {
    trips() {
        return this.$store.state.trips.trips.filter((trip) => {
          if(!_.isEmpty(this.filterSurveyId)) {
            if (this.filterTripId !== "" && !_.isEmpty(this.filterDateRange)) {
              let startTime = moment(this.filterDateRange[0]);
              let endTime = moment(this.filterDateRange[1]);
              return trip.surveyId && this.filterSurveyId.includes(trip.surveyId) && this.filterTripId.includes(trip.refId) && moment(trip.startTime).isBetween(startTime, endTime);
            } else if (this.filterTripId === "") {
              return trip.surveyId && this.filterSurveyId.includes(trip.surveyId)
            } else if (this.filterTripId !== "") {
              return trip.surveyId && this.filterSurveyId.includes(trip.surveyId) && this.filterTripId.includes(trip.refId)
            }
          }

          return true;
        });
    },
    mapCenter() {
      return this.$store.state.trips.currentTripMapCenter;
    },
    filterSurveyId () {
      return this.$store.state.trips.filter.surveyId;
    },
    filterTripId () {
      return this.$store.state.trips.filter.tripId;
    },
    tripColors () {
      return this.$store.state.trips.tripColors
    },
    filterDateRange() {
      return this.$store.state.trips.filter.tripDateRange;
    },
    selectedPoint() {
      return this.$store.state.trips.selectedPoint;
    },
    surveyIds(){
      return this.$store.state.record.surveyIds;
    },
    ...mapFields({
      filterSurveyId: "trips.filter.surveyId",
      filterTripId: 'trips.filter.tripId',
      tripDateRange: "trips.filter.tripDateRange"
    }),
    dateRangeText() {
      return this.dates.join(" to ");
    }
  },
  methods: {
    ...mapActions({
      getTrips: 'trips/getTrips',
      getDistricts: 'trips/getDistricts',
      getTripPhotos: 'trips/getTripPhotos',
      getPhotoBatch: 'trips/getPhotoBatch',
      getSurveysIds: 'record/getSurveysIds'
    }),
    ...mapMutations({
      setSelectedPoint: 'trips/setSelectedPoint',
      setTripColors: "trips/setTripColors",
      setDateRange: "trips/setDateRange"
    }),
    async zoomCoordinateMap(){
      if(this.$route.params.batchNo != undefined || this.$route.params.tripRefId != undefined){
        await this.getPhotoBatch({
          batchNo: this.$route.params.batchNo,
          direction: 0,
          tripId: this.$route.params.tripRefId
      });

      const coordinates = this.$store.state.trips.photos[0].location.coordinates;

      this.$refs.myMap.mapObject.flyTo(
          { lng: coordinates[0] , lat: coordinates[1] },
          18
        );
      }
    },
    onRouteClick(event) {
      if (event.latlng) {
        this.setSelectedPoint([event.latlng.lng, event.latlng.lat]);
        this.$emit('routepoint');
        this.getTripPhotos({refId: event.target.options.refId, coordinates: [event.latlng.lng, event.latlng.lat] });
      }
    },
    pan(coords) {
      this.map = this.$refs.myMap.mapObject.flyTo({lat: coords[1], lng: coords[0]}, 15);
    },
    getSurveyColor (surveyId) {
      for (const [key, value] of Object.entries(this.tripColors)) {
        this.surveyColor[key] = value.color
      }
      
      if(surveyId === undefined) {
        return 'blue';
      } else {
        return this.surveyColor['Survey ' + surveyId];
      }
    },
    onTripClick(centerPoint) {
      if (centerPoint === null) {
        this.alert = true
      } else {
        this.alert = false
        this.$refs.myMap.mapObject.flyTo(
          { lng: centerPoint.coordinates[0] , lat: centerPoint.coordinates[1] },
          18
        );
      }
    },
    resetFilter() {
      this.filterSurveyId = []
      this.filterTripId = []
      this.dates = []
      document.getElementsByClassName('geocoder-control-input')[0].value = ""
    }
  },
  async mounted() {
    await this.getTrips({boundary: this.ConstantBoundary, startDate: "", endDate: ""});

    if(this.filterSurveyId.length <= 0){
      await this.getSurveysIds();
      let lastSurveyId = _.last(this.surveyIds);
      this.filterSurveyId = [lastSurveyId]
    }
    
    let geosearch = require('leaflet-geosearch');
    this.geosearchOptions.provider = geosearch.OpenStreetMapProvider();
    
    this.$nextTick(() => {
      if (!_.isEmpty(this.filterTripId)) {
        if(!_.isEmpty(this.trips[0].centerPoint)) {
          this.onTripClick(this.trips[0].centerPoint)
        } else {
          this.filterSurveyId = []
          this.filterTripId = []
          this.setTripColors()
        }
      }else{
        this.zoomCoordinateMap()
      }
    });
    
  },
  destroyed() {
    this.filterSurveyId = []
    this.filterTripId = []
    this.setTripColors()
  },
  watch: {
    dates: {
      handler(val) {
        if(val.length > 1) {
          this.setDateRange(val);
        }
      }
    }
  }
}
</script>