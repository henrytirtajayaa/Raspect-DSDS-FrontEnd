<template>
    <div class="survey-filter">
        <div class="survey-filter__container">
            <template v-if="selectedSubTab === 'surveyId'">
                <div class="title-container">
                    <div class="text text--medium text--bold text--secondary-style">Survey Batch ID</div>
                </div>
                <div class="survey-filter__tag-container">
                    <v-chip-group v-model="surveyId" multiple active-class="selected">
                        <v-chip :key="id" v-for="id of surveyIds" outlined label :value="id" :ripple="false">
                            <span class="text text--secondary-style text--black">{{ id }}</span>
                        </v-chip>
                    </v-chip-group>
                </div>
            </template>
            <template v-if="selectedSubTab === 'surveyDateRange'">
                <div class="title-container">
                    <div class="text text--medium text--bold text--secondary-style">Survey Date</div>
                </div>
                <div class="survey-filter__tag-container">
                    <v-text-field
                        v-model="dateRangeText"
                        readonly
                        class="text"
                        clearable
                        @click:clear="clearDateRangeText"
                    ></v-text-field>
                </div>
                <div>
                    <v-date-picker
                        v-model="surveyDateRange"
                        range
                    ></v-date-picker>
                </div>
            </template>
            <template v-if="selectedSubTab === 'tripId'">
                <template>
                    <div>
                        Trip ID<br>
                        <v-autocomplete id="test" 
                            background-color="white" 
                            dense 
                            outlined 
                            label="Search by Trip ID" 
                            append-icon="mdi-magnify" 
                            clearable 
                            @click:clear="resetFilterTrip()" 
                            class="map__autocomplete-field text text--small"  
                            :items="tripIdList" 
                            v-model="tripId"></v-autocomplete>
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>
<script>

import {mapFields} from 'vuex-map-fields';
import _difference from "lodash/difference"
import { mapActions, mapMutations } from 'vuex';

export default {
    props: ["selectedSubTab"],
    data() {
        return {
            dates: ['2019-09-10', '2019-09-20'],
            selectedId: "",
        };
    },
    methods: {
        ...mapActions({
            getTrips: 'trips/getTrips',
        }),
        ...mapMutations({
            clearDateRangeText: "record/clearDateRangeText",
        }),
        resetFilterTrip() {
            this.tripId = "";
        },
    },
    mounted() {
        this.getTrips({boundary: this.constantBoundary, startDate: "", endDate: ""});
    },
    computed: {
        dateRangeText () {
            return this.surveyDateRange.join(' ~ ')
        },
        ...mapFields({
            surveyId: 'record.filter.survey.surveyId.value',
            surveyDateRange: 'record.filter.survey.surveyDateRange.value',
            surveyIdCheckbox: 'record.filter.survey.surveyId.isChecked',
            surveyDateRangeCheckbox: 'record.filter.survey.surveyDateRange.isChecked',
            tripId: 'record.filter.survey.tripId.value'
        }),
        surveyIds () {
            return this.$store.state.record.surveyIds;
        },
        trips() {
            return this.$store.state.trips.trips;
        },
        tripIdList() {
            const tripIdList = []
            if (this.trips) {
                this.trips.map((v, i) => {
                    tripIdList.push(v.refId)
                })
            }
            return tripIdList;
        }
    }
}
</script>