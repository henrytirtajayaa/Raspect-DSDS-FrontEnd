<template class="location-modal">
  <v-menu
    v-model="buildingLocationModal"
    :close-on-content-click="false"
    min-width="362"
    absolute
    left
    top
    :position-y="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon small color="gray" @click="onMapIconClick" v-on="on">
        mdi-map-marker
      </v-icon>
    </template>
    <v-card width="362">
      <v-card-title>
        <span class="text text--extra-large text--dark">
          Building Location
        </span>
      </v-card-title>
      <v-divider></v-divider>
      <v-container>
        <v-row>
          <v-col>
            <template v-if="selectedBuilding">
              <div class="text text--bold">
                New building location assigned. 
              </div>
            </template>
            <template v-else>
              <div class="text text--bold">
                Assign signboard
                <span class="text text--bold text--yellow">{{
                  selectedMarker.signboardId
                }}</span>
                to other building by clicking
                <v-icon small color="gray">
                  mdi-map-marker
                </v-icon>
              </div>
            </template>
          </v-col>
        </v-row>
      </v-container>
      <template v-if="!isLoading">
        <l-map
          :zoom="20"
          :center="selectedResultLocation"
          ref="map"
          @ready="doSomethingOnReady()"
          @update:zoom="center()"
          style="width: 100%; height: 352px;"
        >
          <template v-for="tileUrl in urls">
            <l-tile-layer :url="tileUrl"></l-tile-layer>
          </template>
          <template v-for="building in nearestBuildings">
            <template v-if="selectedBuilding !== '' && selectedBuilding.structId === building.structId && building.structId !== computedStructureId">
              <l-marker
                :lat-lng="[building.y, building.x]"
                :key="building.object_id"
              >
                <l-icon :iconSize="[40,40]" icon-url="/marker-green.svg"> </l-icon>
              </l-marker>
            </template>
            <template v-else-if="computedStructureId !== null && building.structId !== computedStructureId">
              <l-marker
                :lat-lng="[building.y, building.x]"
                :key="building.object_id"
                @click="onMarkerSelected(building)"
              >
              </l-marker>
            </template>
            <template v-else-if="computedStructureId !== null && building.structId === computedStructureId">
              <l-marker
                :key="building.object_id"
                :lat-lng="[building.y, building.x]"
              >
                <l-icon :iconSize="[50,50]" icon-url="/marker-yellow.svg"> </l-icon>
              </l-marker>
            </template>
          </template>
          
        </l-map>
      </template>
      <div class="location-modal__save-btn-container">
        <v-btn color="primary" elevation="0" class="text" @click="save">Save</v-btn>
      </div>
    </v-card>
  </v-menu>
</template>
<script>
import { apiKey } from "../../constants";
import { mapActions, mapMutations } from "vuex";

export default {
  props: ["selectedResultLocation", "isModalOpen", "structureId"],
  data() {
    return {
      isLoading: false,
      urls: [
        `https://api.hkmapservice.gov.hk/osm/xyz/basemap/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`,
        `https://api.hkmapservice.gov.hk/osm/xyz/label-en/WGS84/tile/{z}/{x}/{y}.png?key=${apiKey}`
      ],
      buildingLocationModal: false,
      map: {},
      selectedBuilding: ""
    };
  },
  mounted() {},
  methods: {
    doSomethingOnReady() {
      this.map = this.$refs.map.mapObject;
      this.map.invalidateSize();
    },
    center() {
      this.map = this.$refs.map.mapObject;
      this.map.invalidateSize();
    },
    async onMapIconClick () {
      this.isLoading = true;
      await this.getBuildings({lat: this.selectedResultLocation[0], long: this.selectedResultLocation[1], precision: 10.0});
      this.isLoading = false;
    },
    ...mapActions({
      getBuildings: "signboard/getBuildings",
      updateBuilding: "signboard/updateBuilding"
    }),
    ...mapMutations({
      updateSignboardLocation: "signboard/updateSignboardLocation",
      updateStructureId: "signboard/updateStructureId"
    }),
    onMarkerSelected(building) {
      this.selectedBuilding = {...building, structureId: building.structId};
    },
    async save() {
      await this.updateBuilding({signboardId: this.selectedMarker.signboardId, building: {...this.selectedBuilding, lon: this.selectedBuilding.x, lat: this.selectedBuilding.y} });
      this.selectedBuilding = {};
    }
  },
  computed: {
    nearestBuildings() {
      return this.$store.state.signboard.nearestBuildings;
    },
    selectedMarker() {
      return this.$store.state.signboard.selectedSignboard;
    },
    computedStructureId() {
      return this.structureId;
    }
  },
  watch: {
    buildingLocationModal(newVal) {
      if(!newVal) {
        this.selectedBuilding = ""
      }
    }
  }
};
</script>
