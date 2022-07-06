<template>
    <div class="survey-search">
        <!-- <v-btn>
            <v-icon>mdi-burger</v-icon>
        </v-btn> -->
        <v-autocomplete solo label="Survey ID" class="text text--extra-small space-left" dense multiple :items="items" v-model="filterSurveyId" outlined flat></v-autocomplete>
        <template v-if="filterSurveyId">
            <v-select
                :items="tripItems"
                label="Search by Trip ID"
                dense
                solo
                multiple
                class="text text--small"
                v-model="filterTripId"
                item-value="refId"
                item-text="refId"
                outlined
                flat
            ></v-select>
        </template>
    </div>
</template>
<script>
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import { apiKey } from "../../constants";
import { mapActions, mapMutations } from "vuex";
import {mapFields} from 'vuex-map-fields';
import _ from 'lodash';

export default {
    computed: {
        ...mapFields({
            filterSurveyId: "trips.filter.surveyId",
            filterTripId: "trips.filter.tripId",
            tripDateRange: "trips.filter.tripDateRange"
        }),
        items() {
            return this.$store.state.record.surveyIds;
        }
    },
    data() {
        return {
            apiKey: apiKey,
            keyword: "",
            bounds: [],
            tripItems: [],
            tripByIdItems: [],
            surveyIdList: []
        }
    },
    methods: {
        ...mapActions({
            searchSignboard: "signboard/searchSignboards",
            getSurveysIds: 'record/getSurveysIds'
        }),
        ...mapMutations({
            setTripColors: "trips/setTripColors",
            setDateRange: "trips/setDateRange",
            setFilterTripToEmpty: "trips/setFilterTripToEmpty"
        }),
        setText(text) {
            this.keyword = text;
        },
        beforeSearchSignboard() {
        },
        getRandomColor(str) {
            for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
            let color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
            return '#' + Array(6 - color.length + 1).join('0') + color;
        },
        onSurveyIdFilter(val) {
            let trips = this.$store.state.trips.trips;
                
            var filteredTripsById = []
            val.forEach((element, index) => {
                let filtering = _.filter(trips,(trip) => trip.surveyId && trip.surveyId === val[index]);
                filteredTripsById.push(filtering)
            })
                
            var surveyIdLogs = []
            this.tripItems = []
            filteredTripsById.forEach((element, index) => {
                if (!_.isEmpty(filteredTripsById[index])) {
                    this.tripItems = _.uniq(_.map(filteredTripsById[index], (trip)=> ({ refId: trip.refId, centerPoint: trip.centerPoint })));
                    surveyIdLogs.push(element[index].surveyId)
                } else if (_.isEmpty(surveyIdLogs)) {
                    this.tripItems = []
                }
            })

            let tripColorsObject = {}
                
            this.tripItems.forEach((tripItem) => {
                    
                tripColorsObject[tripItem.refId] = { color: this.getRandomColor(tripItem.refId), centerPoint: tripItem.centerPoint };
                    
            })

            this.setTripColors(tripColorsObject);
            this.setFilterTripToEmpty();
        },
        onTripIdFilter(val) {
            this.tripByIdItems = this.tripItems
            var filtered = []

            if(val.length > 0) {
                val.forEach((element, index) => {
                    const foundTrip = this.tripByIdItems.find((elem) => elem.refId === element)

                    if (foundTrip) {
                        filtered.push(foundTrip)
                    }
                })
            } else if (_.isEmpty(val)) {
                filtered = this.tripByIdItems
            }

            let tripByIdColorsObject = {};
            filtered.forEach((tripItem) => {
                tripByIdColorsObject[tripItem.refId] = { color: this.getRandomColor(tripItem.refId), centerPoint: tripItem.centerPoint };
            })

            this.setTripColors(tripByIdColorsObject);
        }
    },
    watch: {
        '$store.state.trips.filter.surveyId': {
            handler(val) {
                this.onSurveyIdFilter(val); 
            }
        },
        '$store.state.trips.filter.tripId': {
            handler(val) {       
                this.onTripIdFilter(val);
            }
        }
    },
    mounted() {
        this.getSurveysIds();
    }
}
</script>