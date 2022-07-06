<template >
  <client-only class="map">
    <l-map
      style="z-index: 0;"
      :zoom="15"
      :center="initialCenter"
      ref="map"
      attributionControl="false"
      @ready="onMapReady"
      @update:bounds="boundsUpdated"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      :options="{zoomControl: false, minZoom: 11}"
    >
      <template v-for="tileUrl in tileUrls">
        <l-tile-layer :url="tileUrl" :options="{maxNativeZoom: 20, maxZoom: 21}"></l-tile-layer>
      </template>
      <MapSearchControl
        :apiKey="apiKey"
        ref="locationSearch"
        @searchSignboard="beforeSearchSignboard"
        :bounds="bounds"
        @setText="setText"
        @setRef="setRef"
      ></MapSearchControl>
      <l-control position="topleft" class='map__control-container'>
        <v-btn @click="toggleMinimizeFields" class='map__minimize-btn' outlined height="40">
          <template v-if='minimizeFields'>
            <v-icon>mdi-magnify</v-icon>
          </template>
          <template v-else>
            <v-icon>mdi-chevron-up</v-icon>
          </template>
        </v-btn>
      </l-control>
      <l-control position="topleft" style="order: 2;">
        <div class='map__search-container'>
          <template v-if="!minimizeFields">
            <v-autocomplete id="test" background-color="white" dense outlined label="Search by Signboard" append-icon="mdi-magnify" class="map__autocomplete-field text text--small"  :items="signboardIdList" @keyup="handleSearchSignboardById" @change="filterBySignboardId" return-object v-model="acSignboard"></v-autocomplete>
            <v-autocomplete id="test" background-color="white" dense outlined label="Search by File Reference No." append-icon="mdi-magnify" class="map__autocomplete-field text text--small"  :items="fileRefList" @keyup="searchFileReference" @change="filterByFileRef" v-model="acRef"></v-autocomplete>
            <v-autocomplete id="test" background-color="white" dense outlined label="Search by Trip ID" append-icon="mdi-magnify" clearable @click:clear="resetFilterTrip()" class="map__autocomplete-field text text--small"  :items="tripIdList" @change="setTripIdFilter" v-model="filterByTripId"></v-autocomplete>
            <v-btn outlined color="primary" class='map__clear-btn' @click="clearSearch">Clear Search</v-btn>
          </template>
        </div>
      </l-control>
      
      <l-control position="bottomleft">
        <v-alert v-model="alert" type="error" dismissible>
          {{ alertText }}
        </v-alert>
        <SignboardLegend @set-marker-filter="setMarkerFilter" :markerFilter="markerFilter"></SignboardLegend>
      </l-control>
      <template v-for="marker in filteredMarkers">
        <template v-if="getSignboardLength(marker) > 1">
          <template
            v-if="selectedMarker && selectedMarker.markerId === marker.markerId"
          >
            <l-marker
              :lat-lng="marker.location"
              @click="onMarkerClick($event, marker)"
              :zIndexOffset="300"
            >
              
              <template v-if="selectedSignboard.signboardId">
                <l-tooltip :options="{direction: 'top'}">
                  {{
                    selectedSignboard.signboardId
                  }}
                </l-tooltip>
              </template>
              
              <l-icon :iconSize="[50,50]" :icon-url="getColor(selectedMarker) === '#f5a623'? '/marker-yellow.svg' : '/marker-blue.svg'" className="marker"> </l-icon>
                
            </l-marker>
          </template>

          <l-marker
            :lat-lng="marker.location"
            @click="onMarkerClick($event, marker)"
            :key="marker.markerId"
          >
            <l-icon>
              <v-avatar
                :color="getColor(marker)"
                size="29"
                :class="`number-avatar ${$refs.map && $refs.map.mapObject._zoom >= 20 ? 'cursor--pointer' : 'cursor--default'}`"
              >
                <span>{{ getSignboardLength(marker) }}</span>
              </v-avatar>
            </l-icon>
          </l-marker>
        </template>
        <template v-else>
          <template
            v-if="selectedMarker && selectedMarker.markerId === marker.markerId"
          >
            <l-marker
              :lat-lng="marker.location"
              @click="onMarkerClick($event, marker)"
            >
              <l-icon
                :iconSize="[50,50]"
                :icon-url="
                  getColor(marker) === '#f5a623'? '/marker-yellow.svg' : '/marker-blue.svg'
                "
                className="icon-svg"
              >
              </l-icon>
              <template v-if="selectedSignboard.signboardId">
                <l-tooltip :options="{ direction: 'top'}">{{
                  selectedSignboard.signboardId
                }}</l-tooltip>
              </template>
            </l-marker>
          </template>
          <l-marker
            :lat-lng="marker.location"
            @click="onMarkerClick($event, marker)"
          >
            <l-icon
              :iconSize="[25,25]"
              :icon-url="
                marker.signboardType === 'defective'
                  ? '/signboard-defective.svg'
                  : '/signboard-normal.svg'
              "
              :className="`icon-style ${$refs.map && $refs.map.mapObject._zoom >= 20 ? 'cursor--pointer' : 'cursor--default'}`"
            >
            </l-icon>
          </l-marker>
        </template>
      </template>
    </l-map>
  </client-only>
</template>

<script>
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import { mapActions, mapMutations } from "vuex";
import { apiKey, MARKER_FILTER_ALL, MARKER_FILTER_DEFECT_ONLY, MARKER_FILTER_NORMAL_ONLY, DEFAULT_BOUNDARY, SIGN_FILTER_MAP } from "../../constants";
import commonMapUtilMixin from '../../mixins/common-map-util.js';

export default {
  data() {
    return {
      apiKey: apiKey,
      geosearchOptions: {
        provider: null
      },
      bounds: [],
      keyword: "",
      suggestionText: "",
      tileUrls: [
        `https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`,
        `https://api.hkmapservice.gov.hk/osm/xyz/label-en/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`
      ],
      markers: [
        {
          markerId: "1",
          location: [22.302711, 114.177216],
          isDefective: true,
          label: "<b>Hello</b><br/>DestinationAddress",
          needsBuildingAssignment: true,
          result: 2,
          signboardName: "BO00014",
          image:
            "https://www.voguehk.com/media/2019/06/8.-Tung-Cheung-Pawn-Shop-1800x1200.jpg"
        },
        {
          markerId: "2",
          location: [22.332711, 114.187216],
          isDefective: false,
          label: "<b>Hello2</b><br/>DestinationAddress",
          needsBuildingAssignment: false,
          result: 1,
          signboardName: "BO00016",
          image:
            "https://cdn1.i-scmp.com/sites/default/files/styles/1200x800/public/images/methode/2019/01/11/909d0d92-156e-11e9-bd68-61a0d0b9ce58_image_hires_164107.JPG?itok=8r_PTGva&v=1547196073"
        },
        {
          markerId: "3",
          location: [22.3185, 114.1755],
          isDefective: true,
          label: "<b>Hello</b><br/>DestinationAddress",
          needsBuildingAssignment: false,
          result: 1,
          signboardName: "BO00069",
          image:
            "https://cdn1.i-scmp.com/sites/default/files/styles/1920x1080/public/images/methode/2017/12/23/88122270-e563-11e7-8ff5-d91dc767c75e_image_hires_145156.JPG?itok=s8aiNLiB"
        }
      ],
      items: [
        { title: "Islands" },
        { title: "Yau Tsim Mong" },
        { title: "Kwai Tsing" },
        { title: "Sha Tin" }
      ],
      closeContent: false,
      selectedMarker: null,
      markerFilter: MARKER_FILTER_ALL,
      acSignboard: [],
      acRef: "",
      searchRef: {},
      filterByTripId: '',
      alert: false,
      alertText: '',
      constantBoundary: DEFAULT_BOUNDARY,
      SIGN_FILTER_MAP
    };
  },
  mixins: [commonMapUtilMixin],
  methods: {
    onMarkerClick(event, marker) {
      if (this.$refs.map.mapObject._zoom < 20) {
        return;
      }

      this.selectedMarker = marker === null ? null : marker;
      this.$emit("markerselected", this.selectedMarker);
    },
    onCloseContentClick() {
      this.closeContent = true;
    },
    pan(coords) {
      this.map = this.$refs.map.mapObject.flyTo(
        { lat: coords[1], lng: coords[0] },
        15
      );
    },
    zoomUpdated(e) {
      // console.log('zoom level', e);
    },
    centerUpdated(e) {
      // console.log('events found', e)
    },
    setText(text) {
      this.keyword = text;
    },
    setRef(ref) {
      this.searchRef = ref;
    },
    setMarkerFilter(filter) {
      if (filter === this.markerFilter) {
        this.markerFilter = MARKER_FILTER_ALL;
      } else {
        this.markerFilter = filter;
      }
    },
    getColor(marker) {
      let hasDefectinGroup = marker.signboardType === "defective";

      if(hasDefectinGroup) {
        return '#f5a623';
      } else {
        return '#4DB7E3';
      }
    },
    ...mapActions({
      searchSignboard: "signboard/searchSignboards",
      searchSignboardId: "signboard/searchSignboardId",
      searchFileReference: "signboard/searchFileReference",
      generateSingleMarker: "signboard/generateSingleMarker",
      generateSingleMarkerFromFileRef: "signboard/generateSingleMarkerFromFileRef",
      getInitialCenter: "signboard/getInitialCenter",
      getTrips: 'trips/getTrips',
      getLatestTrips: 'trips/getLatestTrips',
      filterRecords: "record/filterRecords"
    }),
    ...mapMutations({
      getUserRole: "user/getUserRole",
      setFilteringFileRef: "signboard/setFilteringFileRef",
      setFilteringId: "signboard/setFilteringId",
      setFilteringByTrip: "signboard/setFilteringByTrip",
      resetFilteringTripId: "signboard/resetFilteringTripId",
      resetFilteringId: "signboard/resetFilteringId",
    }),
    onMapReady() {
      this.getSignboardIds();

      this.bounds = [
        [this.$refs.map.mapObject.getBounds().getNorthWest().lat, this.$refs.map.mapObject.getBounds().getNorthWest().lng],
        [this.$refs.map.mapObject.getBounds().getSouthEast().lat, this.$refs.map.mapObject.getBounds().getSouthEast().lng]
      ];
      
    },
    handleSearchSignboardById(e) {
      if(e.target) {
        this.searchSignboardId({ searchString: [e.target.value] })
      }
    },
    filterBySignboardId(e) {
      this.generateSingleMarker({signboardId: e, mapObject: this.$refs.map.mapObject });
      this.resetFilteringTripId();
    },
    filterByFileRef(e) {
      this.generateSingleMarkerFromFileRef({ fileRef: e, mapObject: this.$refs.map.mapObject })
    },
    clearSearch() {
      this.beforeSearchSignboard(this.$refs.map.mapObject._zoom);
      this.acRef = "";
      this.acSignboard = [];
      this.filterByTripId = "";
      this.setFilteringFileRef({ filteringFileRef: '' });
      this.setFilteringId({ filteringId: '' });
      this.resetFilterTrip();
      document.getElementsByClassName('geocoder-control-input')[0].value = ""
    },
    resetFilterTrip() {
      this.setFilteringByTrip({});
      this.alert = false;
    },
    async getSignboardIds(){
      if(this.filteringId.length <= 0 && this.filteringFileRef === '' && this.$route.params.signboardId===undefined) {
        if (this.isTripFilter) {
          this.onFilterId();
        }
        else {
          this.beforeSearchSignboard(this.$refs.map.mapObject._zoom, true);
          this.getInitialCenter();
        }
        this.$emit("settags", this.$store.state.record.filter);
        this.filterRecords({filter: this.$store.state.record.filter, sort: this.$store.state.record.sort, ignoreProcessing: false, applyFilter: true});
      }else{
        if(this.$route.params.signboardId){
          var signboardId = await this.$route.params.signboardId;
          await this.onSelectedSignboardMap(signboardId);
        }
      }
    },
    async onSelectedSignboardMap(signboardId) {
      this.generateSingleMarker({signboardId: signboardId, mapObject: this.$refs.map.mapObject });
      this.resetFilteringTripId();
    },
    async onFilterId() {
      await this.$refs.map.mapObject.flyTo(
        { lat: this.filterByTrip.centerPoint.coordinates[1], lng: this.filterByTrip.centerPoint.coordinates[0] },
        20
      );
    },
    async setTripIdFilter(e) {
      this.alert = false;
      let trip = '';
      await this.latestTrips.map((v, i) => { 
        if (this.latestTrips[i].refId === e && !isEmpty) {
          trip = this.latestTrips[i];
        }
      });
      const isEmpty = (trip.defectiveSignbaordCount + trip.normalSignbaordCount === 0) ? true : false;
      this.trips.map((v, i) => {
        if (this.trips[i].refId === e) {
          if (this.trips[i].centerPoint && !isEmpty) {
            this.setFilteringByTrip({ 
              centerPoint: this.trips[i].centerPoint,
              tripRefId: this.trips[i].refId
            })
            this.onFilterId();
          }
          else {
            this.setFilteringByTrip({})
            if (!isEmpty) {
              this.alertFunction('Center point undefined')
            }
            else {
              this.alertFunction('Signboard undefined')
            }
          }
        }
      })
      this.resetFilteringId();
    },
    alertFunction(text) {
      this.alert = true;
      this.alertText = text;
    }
  },
  mounted() {
    let geosearch = require("leaflet-geosearch");
    this.geosearchOptions.provider = geosearch.OpenStreetMapProvider();
    this.$nextTick(()=> {
      this.getUserRole();
    });
    this.isTripFilter ? this.filterByTripId = this.filterByTrip.tripRefId : {};
    this.getTrips({boundary: this.constantBoundary, startDate: "", endDate: ""});
    this.getLatestTrips();
  },
  computed: {
    selectedSignboard() {
      return this.$store.state.signboard.selectedSignboard;
    },
    filteredMarkers() {
      return this.markersFromStore.filter((marker)=> {
          if(this.markerFilter !== MARKER_FILTER_ALL) {
            if (this.isTripFilter && marker.signboardGroup !== null) {
              return marker.signboardGroup[0].tripRefId === this.filterByTrip.tripRefId && marker.signboardType === this.SIGN_FILTER_MAP[this.markerFilter];
            }
            else {
              return marker.signboardType === this.SIGN_FILTER_MAP[this.markerFilter];
            }
          }
          else {
            if (this.isTripFilter && marker.signboardGroup !== null) {
              return marker.signboardGroup[0].tripRefId === this.filterByTrip.tripRefId;
            }
            else {
              return true;
            } 
          }
      })
    },
    userRole() {
      return this.$store.state.user.userRole;
    },
    signboardIdList() {
      return this.$store.state.signboard.signboardIdList;
    },
    fileRefList() {
      return this.$store.state.signboard.fileRefList;
    },
    filteringId() {
      return this.$store.state.signboard.filteringId;
    },
    filteringFileRef() {
      return this.$store.state.signboard.filteringFileRef;
    },
    showResultPanel() {
      return this.$store.state.signboard.showResultPanel;
    },
    initialCenter() {
      return this.$store.state.signboard.initialCenter;
    },
    filterByTrip() {
      return this.$store.state.signboard.filterByTrip;
    },
    trips() {
      return this.$store.state.trips.trips;
    },
    isTripFilter() {
      return (Object.keys(this.filterByTrip).length > 0) ? true : false
    },
    tripIdList() {
      const tripIdList = []
      
      if (this.trips) {
        this.trips.map((v, i) => {
            tripIdList.push(v.refId)
        })
      }
      return tripIdList;
    },
    latestTrips() {
      return this.$store.state.trips.latestTrips;
    }
  }
};
</script>
<style>
.leaflet-tooltip {
  position: absolute;
  padding: 6px;
  background-color: #000;
  color: #ffffff;
  font-family: "Avenir Next";
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 19px;
  white-space: nowrap;
}
</style>