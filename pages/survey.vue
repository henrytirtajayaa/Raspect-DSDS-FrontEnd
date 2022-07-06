<template>
    <div class='survey d-flex' id="map-wrap">
        <client-only >
            <l-map
                ref='map'
                style="z-index: 0;"
                attributionControl="false"
                :center="[22.3193, 114.1694]"
                :options="{zoomControl: false, minZoom: 11}"
                :zoom="15"
                @ready="onMapReady"
                @update:bounds="boundsUpdated"
            >
                <template v-for="tileUrl in tileUrls">
                    <l-tile-layer :url="tileUrl" :options="{maxNativeZoom: 20, maxZoom: 21}"></l-tile-layer>
                </template>
                 <l-control position="bottomleft">
                     <v-alert v-model="alert" type="error" dismissible>
                        {{ alertText }}
                    </v-alert>
                    <SurveyLegend @set-filter="setTypeFilter" :typeFilter="typeFilter"></SurveyLegend>
                </l-control>
                <template v-for="marker in filteredMarkers">
                        <template v-if="getSignboardLength(marker) > 1">
                            <l-marker
                                :lat-lng="marker.location"
                                :key="marker.markerId"
                            >
                                <l-icon>
                                <v-avatar
                                    :color="'#4A4A4A'"
                                    size="29"
                                    :class="`number-avatar ${$refs.map && $refs.map.mapObject._zoom >= 20 ? 'cursor--pointer' : 'cursor--default'}`"
                                >
                                    <span>{{ getSignboardLength(marker) }}</span>
                                </v-avatar>
                                </l-icon>
                            </l-marker>
                        </template>
                        <template v-else>
                            <l-marker
                                :lat-lng="marker.location"
                            >
                                <l-icon
                                :iconSize="[25,25]"
                                :icon-url="'/signboard-grey.svg'"
                                :className="`icon-style ${$refs.map && $refs.map.mapObject._zoom >= 20 ? 'cursor--pointer' : 'cursor--default'}`"
                                >
                                </l-icon>
                            </l-marker>
                        </template>
                </template>
                <template v-if="typeFilter === 'FILTER_ALL_TRIPS' || typeFilter === 'FILTER_ALL_TYPES'">
                    <template v-for="trip in trips">
                        <l-polyline :key="trip.refId" :options="{refId: trip.refId, sampled: false}" :weight="5" :lat-lngs="[...trip.waypoints]" :color="'#4A4A4A'">
                        </l-polyline>
                    </template>
                </template>
                <CommonSearchPanelSurveyId
                    @toggleSearch="toggleSearch"
                    @onFilterResult="onFilterResult"
                    @clearSearch="clearSearch"
                    :minimizeSearch="minimizeSearch"
                    :surveyIds="surveyIds"
                />
            </l-map>
        </client-only>
        <SurveyDetail 
            :showRouteDetail="computedShowRouteDetail"
            @closebtnclick="closeButtonClick"
            @onSaveSucceeded="onNotification('#056694', 'New survey created successfully')"
            @drawNewSurvey="drawNewSurvey"
            @closeDetail="onTabClose"
            @onDuplicateID="onDuplicateID"
            :newPolygon="newPolygon"
            :showOnly="showOnly"
            :startTime="startTime"
        ></SurveyDetail>
        <v-snackbar top :color="isNotif.color" elevation="20" v-model="isNotif.status">
            <h3 class="text text--white">{{ isNotif.text }}</h3>
            <template v-slot:action="{ attrs }">
                <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="isNotif.status = false"
                >
                Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
<script>
// import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import { apiKey, FILTER_ALL_MARKER, FILTER_ALL_TRIPS, FILTER_ALL_TYPES, DEFAULT_BOUNDARY } from "../constants";
import { mapActions, mapMutations } from 'vuex';
import commonMapUtilMixin from '../mixins/common-map-util.js';
import surveyMixin from "../mixins/survey.js";
import _findIndex from "lodash/findIndex";
import moment from 'moment';

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
            showRouteDetail: false,
            newPolygon: {},
            newSurvey: {},
            bounds: [],
            typeFilter: FILTER_ALL_TYPES,
            showOnly: false,
            isNotif: { status: false, text: '', color:''},
            constantBoundary: DEFAULT_BOUNDARY,
            startTime:''
        }
    },
    async mounted() {
        await this.getSurveys({ accessToken: window.localStorage.getItem('accessToken') });
        await this.getTrips({boundary: this.constantBoundary, startDate: "2020-01-01", endDate: "2021-12-31"});

        await this.drawSurveys(true);

        this.$nextTick(() => {
            const map = this.$refs.map.mapObject;
            
            const drawControl = new window.L.Control.Draw({
                position: 'topleft',
                draw: {
                    circlemarker: false,
                    polyline: false,
                    circle: false,
                    rectangle: false,
                    marker: false,
                    polygon: {
                        shapeOptions: {
                            color: '#056694',
                            fillColor: '#606060'
                        }
                    }
                },
                edit: {
                    featureGroup: this.editableLayers, //REQUIRED!!
                    remove: true
                }
            });


            L.drawLocal.draw.toolbar.buttons.polygon = "Draw Survey Area";
            L.drawLocal.edit.toolbar.buttons.edit = "Edit Survey Area";
            L.drawLocal.edit.toolbar.buttons.remove = "Delete Survey Area";


            map.addControl(drawControl);
            map.addLayer(this.editableLayers)

            let self = this;
            map.on(window.L.Draw.Event.CREATED, (e) => {
                const layer = e.layer;
                self.newSurvey = layer;
                self.newPolygon = { coords: e.layer._latlngs[0] };
                self.editableLayers.addLayer(layer);
                self.showOnly = false;
                self.showRouteDetail = true;
            });

            map.on(window.L.Draw.Event.DELETED, async (e) => {
                const existingSurveyId =  _.uniq(_.map(this.trips, x => x.surveyId));

                for(const property in e.layers._layers) {
                    if(existingSurveyId.includes(e.layers._layers[property].options.surveyId)){
                        
                        this.isNotif.status = true;
                        this.isNotif.text = 'Do not allow deletion of survey because there is trip data uploaded!'
                        this.showRouteDetail = false;
                        await this.drawSurveys(false);
                        map.addLayer(this.editableLayers)
                        return
                    }
                    else(
                        await self.deleteSurvey({ 
                            accessToken: window.localStorage.getItem('accessToken'), surveyId: e.layers._layers[property].options.surveyId 
                        })
                    )
                    this.isNotif.status = true;
                    this.isNotif.text = 'Surveys deleted successfully!';
                    this.showRouteDetail = false;
                }
            });

            map.on(window.L.Draw.Event.EDITED, async (e) => {
                const editedLayers = Object.values(e.layers._layers)
                editedLayers.map( async (editedLayer) => {
                        await self.editCoordsSurvey({
                        boundaryPoints: {
                            type: "LineString",
                            coordinates: editedLayer._latlngs[0].map((coordinatePair)=> {
                                return [coordinatePair.lng, coordinatePair.lat]
                            })
                        },
                        surveyId: editedLayer.options.surveyId,
                        accessToken: window.localStorage.getItem('accessToken')
                    })
                })
                this.isNotif.status = true;
                this.isNotif.text = 'Survey coordinates updated successfully'
            });
        });
    },
    mixins: [commonMapUtilMixin, surveyMixin],
    methods: {
        onSurveyAreaClick(e) {
            this.showTabDetail(e.target);
        },
        closeButtonClick() {
            this.setSelectedSurveyArea({});
            this.showRouteDetail = false;
            this.editableLayers.removeLayer(this.newSurvey);
        },
        ...mapActions({
            getSurveys: 'survey/getSurveys',
            searchSignboard: "signboard/searchSignboards",
            getTrips: 'trips/getTrips',
            deleteSurvey: 'survey/deleteSurvey',
            editCoordsSurvey: 'survey/editCoordsSurvey'
        }),
        ...mapMutations({
            setSelectedSurveyArea: 'survey/setSelectedSurveyArea'
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
                [this.$refs.map.mapObject.getBounds().getNorthWest().lat, this.$refs.map.mapObject.getBounds().getNorthWest().lng],
                [this.$refs.map.mapObject.getBounds().getSouthEast().lat, this.$refs.map.mapObject.getBounds().getSouthEast().lng]
            ];

            this.beforeSearchSignboard(this.$refs.map.mapObject._zoom, true);
        },
        onNotification(color, text) {
            this.isNotif.status = true;
            this.isNotif.color = color
            this.isNotif.text = text
        },
        async drawSurveys(isNew) {
            if(isNew){
                this.editableLayers = new window.L.FeatureGroup();
            }
            
            window.L.Draw.Polyline.prototype._onTouch = window.L.Util.falseFn;
            for(let i = 0; i < this.surveyArea.length ; i++) {
                if (this.surveyArea[i].boundaryPoints) {
                    const surveyArea = new window.L.polygon(this.surveyArea[i].boundaryPoints.coordinates.map((pair) => {
                        return [pair[1], pair[0]]
                    }), { surveyId: this.surveyArea[i].surveyId, createdAt: this.surveyArea[i].createdAt })
                    surveyArea.on('click', this.onSurveyAreaClick)
                    surveyArea.addTo(this.editableLayers);
                }
            }
        },
        onDuplicateID() {
            this.onNotification('#F44336', 'Duplicate Survey ID Detected! Please your another ID')
        },
        drawNewSurvey() {
            this.editableLayers.removeLayer(this.newSurvey);
            const surveyData = this.surveyArea[this.surveyArea.length - 1];
            const newSurvey = new window.L.polygon(surveyData.boundaryPoints.coordinates.map((pair) => {
                                return [pair[1], pair[0]]}), 
                            { surveyId: surveyData.surveyId, createdAt: surveyData.createdAt })
            newSurvey.on('click', this.onSurveyAreaClick)
            newSurvey.addTo(this.editableLayers)
        },
        showTabDetail(layer) {
            this.showRouteDetail = true;
            this.showOnly = true;
            let startTime = _.map(_.filter(this.trips, x => x.surveyId == layer.options.surveyId), 'startTime');

            this.startTime = startTime[0] == undefined ? '' : moment(startTime[0]).format('DD MMM YYYY')

            this.setSelectedSurveyArea({
                surveyId: layer.options.surveyId,
                // createdAt: moment(layer.options.createdAt).format('DD MMM YYYY')
            })
            this.currentSelectedSurveyId = layer.options.surveyId
        },
        onTabClose() {
            this.showRouteDetail = false;
        }
    },
    computed: {
        surveyArea() {
            return this.$store.state.survey.surveyArea;
        },
        computedShowRouteDetail() {
            return this.showRouteDetail;
        },
        filteredMarkers() {
            return this.typeFilter !== 'FILTER_ALL_TRIPS' || this.typeFilter === 'FILTER_ALL_TYPES' ? this.markersFromStore : []
        },
        trips() {
            return this.$store.state.trips.trips;
        }
    }
}
</script>