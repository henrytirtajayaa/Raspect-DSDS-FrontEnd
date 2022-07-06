<template>
  <div class="settings-pending-items-tab">
    <v-container class="mt-5">
      <v-row>
        <v-col cols="2">
          <div class="text--bold text--medium text--black">
            Pending Items
          </div>
        </v-col>
        <v-col cols="3">
          <v-btn
            outlined
            color="primary"
            class="pending-item-btn"
            @click="runEvaluate"
            :loading="isLoading.runPending"
          >
            <v-icon left dark>mdi-cached</v-icon>
            Run Pending Items
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <div class="text--bold text--medium text--black">
            Filter Options
          </div>
        </v-col>
        <v-col cols="2">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="dateFilter"
                label="Create Date"
                outlined
                hide-details
                clearable
                elevation="0"
                v-bind="attrs"
                v-on="on"
                @click:clear="date = ''"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              color="primary"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false; date=''">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="2">
          <v-select
            dense
            v-model="approvalFilterVal"
            :items="items"
            label="Approval Status"
            outlined
            clearable
            hide-details
            offset-y
            elevation="0"
            item-text="text"
            item-value="value"
          ></v-select>
        </v-col>
        <v-col>
          <template>
            <div>
              <v-autocomplete id="test" 
                  background-color="white" 
                  dense 
                  outlined 
                  label="Filter by Trip ID" 
                  append-icon="mdi-magnify" 
                  clearable 
                  @click:clear="tripIdFilterVal=''" 
                  class="map__autocomplete-field text text--small"  
                  :items="tripIdList" 
                  v-model="tripIdFilterVal"></v-autocomplete>
            </div>
          </template>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="tableItems"
        show-select
        item-key="_id"
        v-model="selectedRows"
        :items-per-page="10"
        :search="search"
        :loading="isLoading.table"
        loading-text="Loading... Please wait"
        class="settings-pending-items-tab__table"
      >
        <template v-slot:item.launch="{ item }">
          <div class="settings-pending-items-tab__launch-icon">
            <v-btn icon @click="launchAnnotationTool(item.signboardId)" v-show="item.signboardId">
              <CommonLaunchIcon />
            </v-btn>
            <v-btn icon @click="launchAnnotationTool(item.resultSignboardId)" v-show="item.resultSignboardId">
              <CommonLaunchIcon />
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-container>
    <v-snackbar
      top
      :color="notification.color"
      elevation="20"
      v-model="notification.status"
    >
      <h3 class="text text--white">{{ notification.text }}</h3>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="notification.status = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-overlay v-if="isLoading.loading">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
import { APPROVAL_STATUS, SIGNBOARD_STATUS, REVISION_STATUS } from "../../constants";
import _ from 'lodash';

export default {
  data() {
    return {
      items: APPROVAL_STATUS,
      date: '',
      approvalFilterVal: null,
      tripIdFilterVal: null,
      menu: false,
      headers: [
        { text: "Create Date", value: "createdDate", filter: this.createdDateFilter },
        { text: "Pending Item", value: "signboardId" },
        { text: "Status", value: "status" },
        { text: "Result signboard Id", value: "resultSignboardId" },
        { text: "Approval Status", value: "verified", filter: this.approvalFilter },
        { text: "Launch", value: "launch" },
        { text: "Trip ID", value: "tripId", filter: this.tripIdFilter, align: ' d-none' }
      ],
      selectedRows: [],
      annotationDialog: false,
      isDefectTool: false,
      fromSignboardDetail: true,
      signboardImage: {},
      isLoading: {
        runPending: false,
        table: false,
        loading: false
      },
      search: "",
      notification: {
        status: false,
        color: "",
        text: ""
      },
      tableItems: []
    };
  },
  methods: {
    ...mapActions({
      evaluateAnnotations: "signboard/evaluateAnnotations",
      getPendingStatus: "signboard/getPendingStatus",
      getTrips: 'trips/getTrips',
    }),
    async runEvaluate() {
      if(_.isEmpty(this.selectedRows)){
        this.notificationActive("red", "No pending item selected");
        return;
      }
      this.isLoading.runPending = true;
      await this.evaluateAnnotations({
        signboardIds: _.map(this.selectedRows, row => {
          return row.signboardId;
        })
      });
      this.isLoading.runPending = false;
      this.notificationActive("#056694", "Run Pending Items Done");
    },
    notificationActive(color, caption) {
      this.notification.status = true;
      this.notification.color = color;
      this.notification.text = caption;
    },
    async launchAnnotationTool(signboardId, id) {
      window.open(`/${signboardId}/pending-items`, '_blank').focus();
    },
    closeTool() {
      this.annotationDialog = false;
    },
    storeList(item) {
      this.tableItems.push({
          _id: item._id,
          createdDate : moment(item.createdAt).format("DD MMM YYYY"),
          signboardId : item.signboardId,
          status : item.status,
          resultSignboardId : item.resultSignboardId,
          verified : item.verified ? 'Approved' : 'Not Yet Approved',
          tripId : item.tripId
      })
    },
    createdDateFilter(value) {
        if (!this.dateFilter) {
          return true;
        }
        return value === this.dateFilter;
    },
    approvalFilter(value) {
      if (!this.approvalFilterVal) {
          return true;
      }
      return value === this.approvalFilterVal;
    },
    tripIdFilter(value){
      if(!this.tripIdFilterVal){
        return true;
      }
      return value === this.tripIdFilterVal;
    }
  },
  async mounted() {
    this.isLoading.table = true;
    await this.getPendingStatus({
      status: [SIGNBOARD_STATUS.PENDING, SIGNBOARD_STATUS.PROCESSED],
      revisionStatus: {
        signboardIdentificationRevised: REVISION_STATUS.ADDED
      }
    });
    this.isLoading.table = false;

    this.getTrips({boundary: this.constantBoundary, startDate: "", endDate: ""});
  },
  computed: {
    pendingStatusList() {
      return this.$store.state.signboard.pendingStatusList;
    },
    dateFilter() {
      return this.date ? moment(this.date).format("DD MMM YYYY"): null
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
  },
  watch: {
    pendingStatusList() {
      if(!_.isEmpty(this.pendingStatusList)){
        this.pendingStatusList.signboards.map((item) => {
          this.storeList(item);
        })
      }
    }
  }
};
</script>
