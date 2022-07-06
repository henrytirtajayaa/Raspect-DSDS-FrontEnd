<template>
  <div class="latest-trip">
    <div>
      <v-alert v-model="alert" type="error" dismissible>
        {{ alertText }}
      </v-alert>
    </div>

    <v-data-table 
      :headers="headers" 
      :items="formattedLatestTrips" 
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="elevation-1 custom" 
      @page-count="pageCount = $event"
    >
      <template v-slot:item="row">
        <tr @mouseover="selectItem(row.item)" @mouseleave="unselectItem">
          <td>{{ row.item.tripDate }}</td>
          <td>{{ row.item.surveyId }}</td>
          <td>{{ row.item.tripId }}</td>
          <td>{{ row.item.normalSignboard }}</td>
          <td>{{ row.item.defectSignboard }}</td>
          <td>
            <v-row>
              <v-btn title="Go to Trip View" icon color="primary" class="mx-2" @click="viewTrip(row.item, {routeDirection: 'trip'})" v-if="row.item === selectedItem && !alert">
                <CommonTripDataIcon />
              </v-btn>
              <v-btn title="Go to Signboard Map" icon color="primary" class="mx-2" @click="viewTrip(row.item, {routeDirection: 'map'})" v-if="row.item === selectedItem && !alert">
                <CommonFindSignboardIcon />
              </v-btn>
            </v-row>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="d-flex justify-end mt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex"
import { mapFields } from 'vuex-map-fields'
import _ from 'lodash'
import { LATEST_TRIPS_HEADERS, DEFAULT_BOUNDARY } from "../../constants"
import moment from 'moment'
import { filter } from '../../requests/record'

export default {
  data() {
    return {
      headers: LATEST_TRIPS_HEADERS,
      selectedItem: false,
      tripItems: [],
      tripByIdItems: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      alert: false,
      routeDirection: "",
      alertText: "",
      selectedSignboardTotal: 0,
      ConstantBoundary: DEFAULT_BOUNDARY
    }
  },
  computed: {
    latestTrips() {
      return this.$store.state.trips.latestTrips
    },
    ...mapFields({
      filterSurveyId: "trips.filter.surveyId",
      filterTripId: 'trips.filter.tripId'
    }),
    formattedLatestTrips() {
      let tripsObj = {
        tripDate: '',
        surveyId: '',
        tripId: '',
        normalSignboard: null,
        defectiveSignboard: null
      }

      var tripsArray = []
      this.latestTrips.map((v, i) => {
        tripsObj = {}
        tripsObj.tripDate = moment(this.latestTrips[i].startTime).format("DD-MM-YYYY")
        tripsObj.surveyId = this.latestTrips[i].surveyId
        tripsObj.tripId = this.latestTrips[i].refId
        tripsObj.normalSignboard = this.latestTrips[i].normalSignbaordCount
        tripsObj.defectSignboard = this.latestTrips[i].defectiveSignbaordCount
        tripsArray.push(tripsObj)
      })

      return tripsArray
    }
  },
  methods: {
    ...mapActions({
      getLatestTrips: 'trips/getLatestTrips',
      getTrips: 'trips/getTrips'
    }),
     ...mapMutations({
        setTripColors: "trips/setTripColors",
        setFilteringByTrip: "signboard/setFilteringByTrip"
      }),
    selectItem(item) {
      this.selectedItem = item
    },
    unselectItem(){
      this.selectedItem = false
    },
    getRandomColor(str) {
      for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
      let color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
      return '#' + Array(6 - color.length + 1).join('0') + color;
    },
    viewTrip(tripData, {routeDirection}) {
      let trip = tripData.tripId
      let split = trip.split('_')

      let selectedSurveyId = []
      selectedSurveyId.push(split[0])
      this.filterSurveyId = selectedSurveyId

      let selectedTrip = []
      selectedTrip.push(trip)
      this.filterTripId = selectedTrip

      this.routeDirection = routeDirection
      this.selectedSignboardTotal = tripData.normalSignboard + tripData.defectSignboard
    }
  },
  watch: {
    '$store.state.trips.filter.surveyId': {
      handler(val) {
        let trips = this.$store.state.trips.trips

        var filteredSurvey = []
        val.forEach((element, index) => {
          let filtering = _.filter(trips,(trip) => trip.surveyId && trip.surveyId === val[index]);
          filteredSurvey.push(filtering)
        })

        var surveyIdLogs = []
        this.tripItems = []
        filteredSurvey.forEach((element, index) => {
          if (!_.isEmpty(filteredSurvey[index])) {
            this.tripItems = _.uniq(_.map(filteredSurvey[index], (trip)=> ({ refId: trip.refId, centerPoint: trip.centerPoint })));
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
      }
    },
    '$store.state.trips.filter.tripId': {
      handler(val) {
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

        if (filtered[0].centerPoint === null) {
          this.alert = true
          this.alertText = "Center point undefined. Please select the Trip from Trip Data"
        } else {
          if (this.routeDirection === 'trip') {
            let tripByIdColorsObject = {};
            filtered.forEach((tripItem) => {
              tripByIdColorsObject[tripItem.refId] = { color: this.getRandomColor(tripItem.refId), centerPoint: tripItem.centerPoint };
            })

            this.setTripColors(tripByIdColorsObject);
            this.$router.push({ path: '/inspect-route'})
          }
          else if (this.routeDirection === 'map') {
            if (this.selectedSignboardTotal !== 0) {
              const tripInfo = {
                centerPoint: filtered[0].centerPoint,
                tripRefId: filtered[0].refId
              }
              this.setFilteringByTrip(tripInfo)
              this.$router.push({ path: '/signboard-map'})
            }
            else {
              this.alert = true
              this.alertText = "No signboard available. Please select the Trip from with signboard data"
            }
          }
        }
      }
    }
  },
  async mounted() {
    await this.getLatestTrips()
    await this.getTrips({boundary: this.ConstantBoundary, startDate: "", endDate: ""})
  }
}
</script>
