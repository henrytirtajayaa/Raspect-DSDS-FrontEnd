<template>
  <v-card class="team-detail" elevation="3" v-if="showPeopleDetail" :loading="isLoadingCard">
    <span class="route-detail__close-btn">
      <v-btn class="mx-2" fab small @click="onCloseButtonClick">
        <CommonArrowRightLightIcon />
      </v-btn>
    </span>
    <div class="team-detail__container" id="team-detail__container">
      <v-container class="pa-5 mt-5">
        <v-sheet outlined rounded>
          <div
            class="text text--secondary-style text--bold text--medium text--black pa-4"
          >
            Assign team
          </div>
          <v-divider></v-divider>
          <div class="team-detail__main pa-4">
            <v-row>
              <v-col cols="3">
                <span class="text text--medium">Survey ID</span>
              </v-col>
              <v-col cols="9">
                <span class="text text--medium text--bold">{{
                  selectedSurvey.surveyId
                }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <span class="text text--medium">Create Date</span>
              </v-col>
              <v-col cols="9">
                <span class="text text--medium">{{ dateCreated }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <span class="text text--medium">Action</span>
              </v-col>
              <v-col cols="9">
                <v-radio-group
                  v-model="assignType"
                  class="mt-0 pt-0"
                  hide-details
                >
                  <v-radio value="defective">
                    <template v-slot:label>
                      <div class="text text--medium">
                          Assign Defective Signboard Only (Option 1)
                      </div>
                    </template>
                  </v-radio>
                  <v-col cols="12" v-if="assignType == 'defective'">
                    <template>
                      <v-select :items="sampleValue" v-model="sampleSize" label="Sampling Size" outlined item-text="title" item-value="value" dense hide-details></v-select>
                    </template>
                  </v-col>
                  <v-radio value="all">
                    <template v-slot:label>
                      <div class="text text--medium">
                        Assign All Sampled Signboards (Option 2)
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <span class="text text--medium">Total Team</span>
              </v-col>
              <v-col cols="9">
                <span class="text text--medium">{{ totalTeam }}</span>
              </v-col>
            </v-row>
            <div class="team-detail__table-container">
              <v-data-table
                :headers="headers"
                :items="teams"
                item-key="_id"
                v-model="teamsSurvey"
                hide-default-footer
                :items-per-page="-1"
                show-select
                :loading="isLoading.table"
                loading-text="Loading... Please wait"
                class="team-detail__table"
              >
                <template v-slot:header.data-table-select="{ on, props }">
                   <v-simple-checkbox color="#4a4a4a" v-bind="props" v-on="on" class="team-detail__checkbox-hover"></v-simple-checkbox>
                </template>
                <template v-slot:item.seniorPro="{ item }">
                  <v-autocomplete
                    v-model="item.seniorPro"
                    dense
                    hide-details
                    elevation="0"
                    prepend-inner-icon="mdi-magnify"
                    :items="userPost"
                    append-icon=""
                    outlined
                  >
                  </v-autocomplete>
                </template>
                <template v-slot:item.caseOfficer="{ item }">
                  <v-tooltip
                    top
                    open-delay="2000"
                    color="#4a4a4a"
                    :disabled="!item.updatedAt"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-autocomplete
                        v-model="item.caseOfficer"
                        dense
                        hide-details
                        elevation="0"
                        prepend-inner-icon="mdi-magnify"
                        outlined
                        v-bind="attrs"
                        :items="userPost"
                        append-icon=""
                        v-on="on"
                      >
                      </v-autocomplete>
                    </template>
                    <span
                      >Last modified : <br />
                      {{ item.lastModifiedBy }}
                      <span>{{ updatedTime(item.updatedAt) }}</span></span
                    >
                  </v-tooltip>
                </template>
                <template v-slot:item.caseAssistant="{ item }">
                  <v-autocomplete
                    v-model="item.caseAssistant"
                    dense
                    hide-details
                    elevation="0"
                    prepend-inner-icon="mdi-magnify"
                    :items="userPost"
                    append-icon=""
                    outlined
                  >
                  </v-autocomplete>
                </template>
                <template v-slot:item.delete="{ item }">
                  <div class="team-detail__delete-icon">
                    <v-btn icon @click="onDelete(item)">
                      <v-icon color="#979797">mdi-minus-circle</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
              <v-btn outlined class="team-detail__btn-add" @click="addDialog = true">
                <v-icon color="#979797">mdi-plus-circle</v-icon>
              </v-btn>
            </div>
          </div>
        </v-sheet>
        <v-row class="mx-0 my-7">
          <v-spacer></v-spacer>
          <v-btn
            @click="onCancel"
            elevation="0"
            outlined
            color="primary"
            class="mr-4"
            ><span class="text text--bold text--blue">Cancel</span></v-btn
          >
          <v-btn
            color="primary"
            elevation="0"
            @click="assignPeople"
            :loading="isLoading.btn"
            :disabled="teamsSurvey.length === 0"
            ><span class="text text--bold text--white">Assign</span></v-btn
          >
        </v-row>
      </v-container>
    </div>
    <v-dialog v-model="saveDialog" width="500">
      <TeamConfirmationDialog @save="onSave" @cancel="cancelSave" />
    </v-dialog>
    <v-dialog v-model="addDialog" width="500">
      <TeamAddDialog @save="addPeople" @cancel="addDialog = false" @notification="onNotification('Add new team successful')" />
    </v-dialog>
    <v-dialog v-model="deleteDialog" width="500">
      <TeamConfirmationDeleteDialog @save="deleteRow" @cancel="deleteDialog = false" />
    </v-dialog>
    <v-snackbar top color="#056694" elevation="20" v-model="isNotif.status">
      <h3 class="text text--white">{{ isNotif.message }}</h3>
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
  </v-card>
</template>
<script>
import moment from "moment";
import { mapActions } from "vuex";
import { ASSIGN_PEOPLE_HEADER, SAMPLE_VALUE } from "../../constants";
import _cloneDeep from "lodash/cloneDeep";
import _isEmpty from 'lodash/isEmpty';
import _findIndex from "lodash/findIndex";
import _includes from "lodash/every";

export default {
  props: ["showPeopleDetail", "isLoadingCard"],
  data() {
    return {
      sampleValue: SAMPLE_VALUE,
      sampleSize: 0,
      assignType: "defective",
      totalTeam: 0,
      headers: ASSIGN_PEOPLE_HEADER,
      teamsSurvey: [],
      isLoading: { table: false, btn: false },
      id: 0,
      teams: [
        {
          _id: 1,
          seniorPro: "",
          caseOfficer: "",
          caseAssistant: ""
        }
      ],
      deleteDialog: false,
      addDialog: false,
      deleteTemp: {},
      singleSelect: true,
      saveDialog: false,
      isNotif: { status: false, message: "" }
    };
  },
  methods: {
    ...mapActions({
      getTeams: "team/getTeams",
      getTeam: "team/getTeam",
      updateTeam: "team/updateTeam",
      deleteTeam: "team/deleteTeam",
      updateDistOptionSurvey: "survey/updateDistOptionSurvey",
      updateTeamSurvey: "survey/updateTeamSurvey",
      reDistributeTeam: "team/reDistributeTeam",
      updateSampleSize: "survey/updateSampleSize",
    }),
    onCloseButtonClick() {
      this.$emit("closebtnclick");
    },
    onCancel() {
      this.$emit('deselect-layers')
      this.onCloseButtonClick();
      this.teams = [...this.teamsStore];
    },
    cancelSave() {
      this.saveDialog = false;
    },
    assignPeople() {
      if (this.selectedSurvey.teamIds.length > 0) {
        this.saveDialog = true;
      } else {
        this.onSave();
      }
    },
    async onSave() {
      this.saveDialog = false;
      this.isLoading.btn = true;

      await this.updateTeam({
        updateTeams: this.teams
      });
      await this.updateDistOptionSurvey({
        surveyId: this.selectedSurvey.surveyId,
        distributionOption: this.assignType,
      });
      await this.updateSurveyTeams();

      await this.updateSampleSize({
        surveyId: this.selectedSurvey.surveyId,
        sampleSize: this.sampleSize
      });

      await this.reDistributeTeam({
        surveyId: this.selectedSurvey.surveyId
      });
      this.isLoading.btn = false;
      this.onNotification('Teams assignment successful');
    },
    onDelete(item) {
      this.deleteDialog = true;
      this.deleteTemp = item;
    },
    async deleteRow() {
      this.deleteDialog = false;
      this.isLoading.table = true;
      const teamId = this.deleteTemp._id;
      const selectedIndex = _findIndex(this.teamsSurvey, (team) => team._id === this.deleteTemp._id);
      const isSelected = this.selectedSurvey.teamIds.includes(teamId);

      await this.deleteTeam({ teamId })
      if (isSelected) {
        await this.teamsSurvey.splice(selectedIndex, 1);
        await this.updateSurveyTeams();
        await this.processedTeamSurvey();
      }
      this.isLoading.table = false;
      this.onNotification('Delete team successful');
    },
    updatedTime(date) {
      return moment(date).format("DD MMM YYYY hh:MM");
    },
    addPeople() {
      this.isLoading.table = true;
      this.addDialog = false;
    },
    async updateSurveyTeams() {
      const teamIds = [];
      this.teamsSurvey.map(item =>{
        teamIds.push(item._id);
      })
      await this.updateTeamSurvey({ surveyId: this.selectedSurvey.surveyId, teamIds });
    },
    async processedTeamSurvey() {
      const teamClone = [..._cloneDeep(this.teamsStore)];
      const teamIds = this.selectedSurvey.teamIds;
      this.teamsSurvey = [];
      this.isLoading.table = true;
      await this.processingTeam(teamClone, teamIds);
      this.isLoading.table = false;

      this.totalTeam = this.teamsSurvey.length;
    },
    processingTeam(teamClone, teamIds) {
      teamClone.map(team => {
        if (teamIds !== undefined) {
          teamIds.map(teamId => {
          if (team._id === teamId) {
            this.teamsSurvey.push(team);
          }
          })
        }
      })
    },
    onNotification(message) {
      this.isNotif.status = true;
      this.isNotif.message = message;
    },
  },
  computed: {
    teamsStore() {
      return this.$store.state.team.teams;
    },
    selectedSurvey() {
      return this.$store.state.survey.selectedSurvey;
    },
    userPost() {
      return this.$store.state.user.userPost;
    },
    dateCreated() {
      return moment(this.selectedSurvey.createdAt).format("DD MMM YYYY")
    },
    tripIds() {
      return this.$store.state.survey.selectedSurvey.tripIds;
    }
  },
  async mounted() {
    this.isLoading.table = this.isLoadingCard;
    this.assignType = this.selectedSurvey.distributionOption;
    this.sampleSize = this.selectedSurvey.sampleSize;
    await this.getTeams();
    (!_isEmpty(this.selectedSurvey)) ? this.processedTeamSurvey() : {};
  },
  watch: {
    selectedSurvey() {
      this.assignType = this.selectedSurvey.distributionOption;
      this.processedTeamSurvey();
      this.sampleSize = this.selectedSurvey.sampleSize;
    },
    teamsStore() {
      this.teams = [..._cloneDeep(this.teamsStore)];
      this.isLoading.table = false;
    },
    teamsSurvey() {
      this.totalTeam = this.teamsSurvey.length;
    }
  }
};
</script>
