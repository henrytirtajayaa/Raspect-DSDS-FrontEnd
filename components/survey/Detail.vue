<template>
    <div class="survey-detail" v-if="showRouteDetail">
        <span class="route-detail__close-btn">
            <v-btn class="mx-2" fab small @click="onCloseDetail">
            <CommonArrowRightLightIcon />
            </v-btn>
        </span>
        <div class="survey-detail__container" id="survey-detail__container" >
            <v-container class="px-6 mt-4">
                <div class="survey-detail__data-container">
                    <v-expansion-panels
                        class="signboard-panel"
                        v-model="panel"
                        multiple
                        readonly
                        flat
                    >
                        <v-expansion-panel outlined rounded>
                            <v-expansion-panel-header
                                class="signboard-panel__header"
                                expand-icon=""
                            >
                                <span class="text text--bold text--medium py-3 px-1">Survey</span>
                            </v-expansion-panel-header>
                            <v-divider></v-divider>
                            <v-expansion-panel-content>
                                <v-form ref="form" class="pl-4 mt-3" v-model="valid">
                                    <v-row>
                                        <v-col class="px-0 mt-2">
                                        <span class="text text--medium">Survey ID</span>
                                        </v-col>
                                        <v-col>
                                            <template  v-if="showOnly">
                                                <span class="text text--bold text--medium">{{ selectedSurveyArea.surveyId }}</span>
                                            </template>
                                            <template v-else>
                                                <span class="text text--bold text--medium">{{ surveyId }}</span>
                                                <!-- <v-text-field hidden outlined dense hide-details="auto" placeholder="Survey ID" v-model='surveyId' :rules="[rules.required]"></v-text-field> -->
                                            </template>
                                        </v-col>
                                    </v-row>
                                    <v-row v-if="startTime">
                                        <v-col class="px-0" v-if="showOnly">
                                            <span class="text text--medium">Survey Date</span>
                                        </v-col>
                                        <v-col>
                                            <template  v-if="showOnly">
                                                <span class="text text--bold text--medium">
                                                    {{ startTime }}
                                                </span>
                                            </template>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <div class="d-flex">
                        <v-spacer></v-spacer>
                        <template v-if='!showOnly'>
                            <v-btn outlined color="primary" @click="$emit('closebtnclick')" class="mr-4">
                                Cancel
                            </v-btn>
                            <v-btn elevation="0" color='primary' @click='onSave'>
                                Save
                            </v-btn>
                        </template>
                    </div>
                </div>
            </v-container>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import { mapActions, mapMutations } from 'vuex';
import _findIndex from "lodash/findIndex";
import { DEFAULT_BOUNDARY } from "../../constants";
import survey from '../../mixins/survey';

export default {
    props: ['showRouteDetail', 'newPolygon', 'showOnly', 'startTime'],
    data() {
        return {
            panel: [0],
            surveyId: "",
            todayDate: moment().format('DD MMM YYYY'),
            date: '',
            menu: false,
            valid: false,
            rules: {
                required: value => !!value || "Required",
            },
            constantBoundary: DEFAULT_BOUNDARY,
        }
    },
    async created(){
        await this.getSurveyId();
        await this.getTrips({boundary: this.constantBoundary, startDate: "", endDate: ""});
    },
    methods: {
        onCloseButtonClick() {
            this.$emit("closebtnclick");
        },
        ...mapActions({ 
            saveSurvey: 'survey/saveSurvey',    
            getSurveys: 'survey/getSurveys',
            getTrips: 'trips/getTrips',
        }),
        ...mapMutations({
            setSelectedSurveyArea: 'survey/setSelectedSurveyArea'
        }),
        async onSave() {
            await this.$refs.form.validate();
            if (this.valid === true) {
                if (_findIndex(this.surveyArea, (survey) => survey.surveyId === this.surveyId) === -1) {
                    await this.saveSurvey({
                        boundaryPoints: {
                            type: "LineString",
                            coordinates: this.newPolygon.coords.map((coordinatePair)=> {
                                return [coordinatePair.lng, coordinatePair.lat]
                            })
                        },
                        surveyId: this.surveyId,
                        // createdAt: this.surveyDate,
                        accessToken: window.localStorage.getItem('accessToken')
                    });
                    this.setSelectedSurveyArea({
                        surveyId: this.surveyId,
                        // createdAt: this.surveyDate
                    })
                    this.$emit('drawNewSurvey');
                    this.$emit('onSaveSucceeded');
                    this.$emit('closeDetail')
                }
                else {
                    this.$emit('onDuplicateID');
                }
            }
            await this.getSurveyId();
        },
        async getSurveyId(){
            await this.getSurveys({ accessToken: window.localStorage.getItem('accessToken') });
        
            let year = moment().format('YYYY');
            this.surveyId = 0;
            let lastIndex = 0;

            // AUTO GENERATE SURVEY ID
                let surveyArea = this.$store.state.survey.surveyArea

                let surveyAreas = []
                let indexList = []

                // SURVEY AREA FOR CURRENT YEAR
                surveyAreas = _.map(_.filter(surveyArea, survey => survey.surveyId.substring(0,4) == year), 'surveyId');
                
                // GET ALL INDEX LIST
                indexList = _.map(surveyAreas, a => parseInt(a.split("-").pop()));
                
                // SORT ARRAY NUMERICALLY
                indexList = indexList.sort(function(a, b){return a - b;});
                
                // GET INDEX
                lastIndex = _.last(indexList);
                let nextLastDigit = (lastIndex + 1).toString().substring(1,2);
                let ordinalNo = nextLastDigit == 1 ? "st" : nextLastDigit == 2 ? "nd" : nextLastDigit == 3 ? "rd" : "th";
                this.surveyId = year + "-" + (lastIndex + 1) + ordinalNo;
            //
        },
        onCloseDetail() {
            (this.showOnly) ? this.$emit('closeDetail') : this.onCloseButtonClick();
        }
    },
    computed: {
        selectedSurveyArea() {
            return this.$store.state.survey.selectedSurveyArea;
        },
        surveyArea() {
            return this.$store.state.survey.surveyArea;
        },
        surveyDate() {
            return this.date ? moment(this.date).format("DD MMM YYYY"): null
        },
        trips() {
            return this.$store.state.trips.trips;
        }
    }
}
</script>