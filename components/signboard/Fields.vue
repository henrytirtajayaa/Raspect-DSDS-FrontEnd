<template>
  <div class="fields">
    <v-container>
      <v-row>
        <v-col>
          <SignboardInfo
            :signboardId="storeSelectedSignboard.signboardId"
            :verified="computedVerified"
          ></SignboardInfo>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="text-container">
            <span
              class="text text--small text--bold text--blue show-more"
              @click="toggleShow"
              >{{ computedShow }}</span
            >
          </div>
        </v-col>
      </v-row>
      <div v-show="showLess" class="fields__summary-container">
        <v-row>
          <v-col>
            <span class="text text--small">Survey Batch ID</span>
          </v-col>
          <v-col>
            <span class="text text--small text--bold">
              {{ surveyId }}
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="text text--small">Survey Date</span>
          </v-col>
          <v-col>
            <span class="text text--small text--bold">{{ surveyDate }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6"
            ><span class="text text--small">Street Name</span></v-col
          >
          <v-col cols="6">
            <span>
              <v-select
                :items="nearestBuildings"
                outlined
                item-text="englishAddress"
                item-value="structId"
                dense
                v-model="select"
                return-object
                @change="onBldgChange($event)"
                class="building-select text text--small"
                @click="onOpen"
              >
                <template v-slot:prepend>
                  <SignboardBuildingLocationModal
                    :selectedResultLocation="computedLocation"
                    :isModalOpen="isBuildingModalOpen"
                    :signboardId="storeSelectedSignboard.id"
                    :structureId="computedStructureId"
                  ></SignboardBuildingLocationModal>
                </template>
              </v-select>
            </span>
          </v-col>
        </v-row>
        <template v-if="buildingStatus">
          <v-row>
            <v-col cols="6"></v-col>
            <v-col cols="6">
              <span class="text text--small text--grey">
                Last updated by {{ buildingUpdateBy }} on
                {{ buildingUpdateTime }}
              </span>
            </v-col>
          </v-row>
        </template>

        <v-row>
          <v-col>
            <span class="text text--small">Case Officer</span>
          </v-col>
          <v-col>
            <span class="text text--bold">{{caseOfficer}}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="text text--small">Type of Defect</span>
          </v-col>
          <v-col>
            <template v-for="defectObj of storeSelectedSignboard.defectTypes">
              <v-tooltip :key="defectObj" color="#4a4a4a" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    class="signboard-detail__chip text text--small text--bold"
                    v-bind="attrs"
                    v-on="on"
                    v-if="defectObj"
                  >
                    {{
                      defectTypes[defectObj].letterGrade
                        ? defectTypes[defectObj].letterGrade
                        : ""
                    }}
                  </v-chip>
                </template>
                <span v-if="defectObj"
                  ><div class="text--bold">
                    Defect ({{
                      defectTypes[defectObj].letterGrade
                        ? defectTypes[defectObj].letterGrade
                        : ""
                    }})
                  </div>
                  {{ defectTypes[defectObj].desc }}</span
                >
              </v-tooltip>
            </template>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6"></v-col>
          <v-col cols="6" v-if="defectTypeModifiedStatus">
            <span class="text text--small text--grey"
              >Last updated by {{ defectTypeModifiedBy }} on
              {{ defectTypeModifiedTime }}</span
            >
          </v-col>
        </v-row>
      </div>
      <v-row v-show="!showLess" flat>
        <v-col>
          <v-expansion-panels
            class="signboard-panel"
            v-model="panel"
            multiple
            readonly
            flat
          >
            <v-expansion-panel>
              <v-expansion-panel-header
                class="signboard-panel__header"
                expand-icon=""
              >
                <span class="text text--bold text--grey">Survey</span>
              </v-expansion-panel-header>
              <v-divider></v-divider>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col>
                      <span class="text text--small">Survey Batch ID</span>
                    </v-col>
                    <v-col
                      ><span class="text text--small text--bold">{{
                        surveyId
                      }}</span></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col>
                      <span class="text text--small">Survey Date</span>
                    </v-col>
                    <v-col
                      ><span class="text text--small text--bold">{{
                        surveyDate
                      }}</span></v-col
                    >
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels
            class="signboard-panel"
            flat
            v-model="panel"
            multiple
            readonly
          >
            <v-expansion-panel>
              <v-expansion-panel-header
                class="signboard-panel__header"
                expand-icon=""
              >
                <span class="text text--bold text--grey">Location</span>
              </v-expansion-panel-header>
              <v-divider></v-divider>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col cols="6"
                      ><span class="text text--small"
                        >Street Name</span
                      ></v-col
                    >
                    <v-col cols="6">
                      <span>
                        <v-select
                          :items="nearestBuildings"
                          outlined
                          item-text="englishAddress"
                          item-value="structId"
                          dense
                          v-model="select"
                          return-object
                          @change="onBldgChange($event)"
                          class="building-select text text--small"
                          @click="onOpen"
                        >
                          <template v-slot:prepend>
                            <SignboardBuildingLocationModal
                              :selectedResultLocation="computedLocation"
                              :isModalOpen="isBuildingModalOpen"
                              :signboardId="storeSelectedSignboard.id"
                              :structureId="computedStructureId"
                            ></SignboardBuildingLocationModal>
                          </template>
                        </v-select>
                      </span>
                    </v-col>
                  </v-row>
                  <template v-if="buildingStatus">
                    <v-row>
                      <v-col cols="6"></v-col>
                      <v-col cols="6">
                        <span class="text text--small text--grey">
                          Last updated by {{ buildingUpdateBy }} on
                          {{ buildingUpdateTime }}
                        </span>
                      </v-col>
                    </v-row>
                  </template>
                  <v-row>
                    <v-col>
                      <span class="text text--small">Area Code</span>
                    </v-col>
                    <v-col>
                      <span class="text text--bold">{{ areaCode }}</span>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels
            class="signboard-panel"
            flat
            v-model="panel"
            multiple
            readonly
          >
            <v-expansion-panel>
              <v-expansion-panel-header
                class="signboard-panel__header"
                expand-icon=""
              >
                <span class="text text--bold text--grey"
                  >Signboard Information</span
                >
              </v-expansion-panel-header>
              <v-divider></v-divider>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col>
                      <span class="text text--small">Headroom (m)</span>
                    </v-col>
                    <v-col
                      ><span class="text text--small text--bold"
                        >{{ headroom }} m</span
                      ></v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col>
                      <span class="text text--small">Projection (m)</span>
                    </v-col>
                    <v-col>
                      <span class="text text--small text--bold"
                        >{{ projection }} m</span
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <span class="text text--small">BD File Reference</span>
                    </v-col>
                    <v-col>
                      <span class="text text--bold">{{ fileRefNo }}</span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <span class="text text--small">Type of Defect</span>
                    </v-col>
                    <v-col>
                      <template
                        v-for="defectObj of storeSelectedSignboard.defectTypes"
                      >
                        <v-tooltip :key="defectObj" top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-chip
                              class="signboard-detail__chip text text--small text--bold"
                              v-bind="attrs"
                              v-on="on"
                              v-if="defectObj"
                            >
                              {{
                                defectTypes[defectObj].letterGrade
                                  ? defectTypes[defectObj].letterGrade
                                  : ""
                              }}
                            </v-chip>
                          </template>
                          <span class="text--small" v-if="defectObj"
                            ><div class="text--small text--bold">
                              Defect ({{
                                defectTypes[defectObj].letterGrade
                                  ? defectTypes[defectObj].letterGrade
                                  : ""
                              }})
                            </div>
                            {{ defectTypes[defectObj].desc }}</span
                          >
                        </v-tooltip>
                      </template>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6"></v-col>
                    <v-col cols="6" v-if="defectTypeModifiedStatus">
                      <span class="text text--small text--grey"
                        >Last updated by {{ defectTypeModifiedBy }} on
                        {{ defectTypeModifiedTime }}</span
                      >
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels
            class="signboard-panel"
            flat
            v-model="panel"
            multiple
            readonly
          >
            <v-expansion-panel>
              <v-expansion-panel-header
                class="signboard-panel__header"
                expand-icon=""
              >
                <span class="text text--bold text--grey">People in Charge</span>
              </v-expansion-panel-header>
              <v-divider></v-divider>
              <v-expansion-panel-content>
                <v-container>
                  <v-row v-for="people of peopleInChargeDisplay" :key="people.key">
                    <v-col cols="6">
                      <span class="text text--small">{{ people.key }}</span>
                    </v-col>
                    <v-col
                      ><span class="text text--small text--bold"
                        >{{ people.value }}</span
                      ></v-col
                    >
                    <v-col></v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels
            class="signboard-panel"
            flat
            v-model="panel"
            multiple
            readonly
          >
            <v-expansion-panel>
              <v-expansion-panel-header
                class="signboard-panel__header"
                expand-icon=""
              >
                <span class="text text--bold text--grey">Modification</span>
              </v-expansion-panel-header>
              <v-divider></v-divider>
              <v-expansion-panel-content>
                <v-container>
                  <v-row v-for="modField of modificationFields" :key="modField.id">
                    <v-col>
                      <span class="text text--small"
                        >{{ modField.title }}</span
                      >
                    </v-col>
                    <v-col>
                      <v-chip
                        class="signboard-detail__chip text text--small text--bold"
                        v-if="modField.id === 'signboardIdentificationRevised'"
                      >
                        {{ signboardIdentificationRevised }}
                      </v-chip>
                      <v-chip
                        class="signboard-detail__chip text text--small text--bold"
                        v-else-if="modField.id === 'defectiveSignboardRevised'"
                      >
                        {{ defectiveSignboardRevised }}
                      </v-chip>
                      <v-chip
                        class="signboard-detail__chip text text--small text--bold"
                        v-else-if="modField.id === 'defectTypeModified'"
                      >
                        {{ defectTypeModifiedStatus ? "Yes" : "No" }}
                      </v-chip>
                      <v-chip
                        class="signboard-detail__chip text text--small text--bold"
                        v-else-if="modField.id === 'boundingAreaRevised'"
                      >
                        {{ boundingAreaRevised }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels
            class="signboard-panel signboard-panel__dsrn"
            flat
            v-model="panel"
            :disable="storeSelectedSignboard.defectCount < 1"
            multiple
            readonly
          >
            <v-expansion-panel>
              <v-expansion-panel-header
                class="signboard-panel__header"
                expand-icon=""
              >
                <span class="text text--bold text--grey">DSRN</span>
              </v-expansion-panel-header>
              <v-divider></v-divider>
              <v-expansion-panel-content>
                <v-container>
                  <v-form ref="form" lazy-validation v-model="valid">
                    <v-row
                      v-for="field of dsrnFields"
                      :key="field.id"
                      :disabled="((dsrnServRadioGroup === 'false') && (field.id === 'dsrnNo' || field.id === 'dsrnAccount')) ||
                                (dsrnServRadioGroup === null && field.id === 'dsrnNo')"
                      >
                      <v-col>
                        <span class="text text--small" >{{ field.title }}</span>
                      </v-col>
                      <v-col cols="8">
                        <v-radio-group v-if="field.id === 'dsrnServ'" class="mt-0" hide-details v-model="dsrnServRadioGroup">
                          <v-radio value="true" label="Yes" @click="saveDSRN"></v-radio>
                          <v-row class="ma-0 mb-3" align="center">
                            <v-col cols="3" class="pl-0"><v-radio value="false" label="No" :ripple="false" class="field"></v-radio></v-col>
                            <v-col cols="9" v-if="dsrnServRadioGroup === 'false'">
                              <v-select
                              placeholder="Select a reason"
                              :items="dsrnReasonsList"
                              :rules="[value => !!value || 'Please select a reason']"
                              @change="saveDSRN"
                              item-text="text"
                              item-value="value"
                              v-model="dsrnNotServeReason"
                              class="mr-0"
                              outlined
                              dense
                              hide-details="auto"
                            >
                            </v-select>
                            </v-col>
                          </v-row>
                        </v-radio-group>
                        <template v-if="field.id === 'dsrnNo'">
                          <v-text-field
                            v-model="dsrnNo"
                            :rules="[value => !!value || 'Please input DSRN No.']"
                            placeholder="DSRN No."
                            @change="saveDSRN"
                            dense
                            outlined
                            hide-details="auto"
                          />
                        </template>
                        <template v-if="field.id === 'dsrnAccount'">
                          <v-select
                            :items="dsrnAccList"
                            v-model="dsrnAccount"
                            :rules="[value => !!value || 'Please select DSRN Account.']"
                            placeholder="Select Account"
                            @change="saveDSRN"
                            dense
                            outlined
                            hide-details="auto"
                          />
                        </template>
                        <v-chip
                          class="signboard-detail__chip text text--small text-capitalize text--bold"
                          v-if="field.id === 'dsrnAction'"
                        >
                          {{ dsrnActionTaken }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-form>
                  <v-row class="signboard-panel__dsrn__generate-button mt-1">
                    <v-col>
                      <span class="text text--small">Generate Documents</span>
                    </v-col>
                    <v-col cols="8">
                      <v-btn color="primary" :disabled="dsrnServRadioGroup ==null" @click="onGenerateDocs">
                        <span class="text text--bold text--white">View/Edit Document Form</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="generateDialog" :close-on-content-click="false" persistent max-width="1390px">
      <SignboardDsrnForm @close-expanded-view="closeExpandedView"/>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import _isEmpty from "lodash/isEmpty";
import _findIndex from "lodash/findIndex";
import _get from "lodash/get";
import _has from "lodash/has";
import moment from "moment";
import { DEFECT_TYPES, MODIFICATION_NAME_MAP, DSRN_REASONS, DSRN_ACCOUNT } from "../../constants";

export default {
  props: ["initialBuildingLocation"],
  data() {
    return {
      dialog: false,
      chosenImageDetails: {},
      isEditButtonClicked: false,
      buildingName: "14 Argyle Street",
      buildingItems: ["Building Z", "Building Y", "Building X"],
      isBuildingModalOpen: false,
      checkbox: false,
      showLess: true,
      currentStructureId: { struct_id: "", english_address: "" },
      panel: [0],
      select: {
        englishAddress: "",
        structId: ""
      },
      nearestBuildings: [],
      defectTypes: DEFECT_TYPES.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr }),
        {}
      ),
      modificationFields: [
        {
          id: "signboardIdentificationRevised",
          title: "Signboard Identification Revised"
        },
        {
          id: "defectiveSignboardRevised",
          title: "Defective Signboard Revised"
        },
        {
          id: "boundingAreaRevised",
          title: "Bounding Area Modified"
        },
        {
          id: "defectTypeModified",
          title: "Defect Types Modified"
        },
        {
          id: "defectTypeOriginal",
          title: "Defect Types Original"
        }
      ],
      dsrnFields: [
        {
          id: "dsrnServ",
          title: "DSRN to be served"
        },
        {
          id: "dsrnNo",
          title: "DSRN No." 
        },
        {
          id: "dsrnAccount",
          title: "Account" 
        },
        {
          id: "dsrnAction",
          title: "Action Taken"
        }
      ],
      dsrnServRadioGroup: null,
      generateDialog: false,
      dsrnDialog: false,
      coverLeterDialog: false,
      dsrnReasonsList: DSRN_REASONS,
      dsrnNotServeReason: '',
      dsrnNo: '',
      dsrnAction: '',
      dsrnAccount: '',
      dsrnAccList: DSRN_ACCOUNT,
      valid: true
    };
  },
  computed: {
    storeSelectedSignboard() {
      return !_isEmpty(this.$store.state.signboard.selectedSignboard.location)
        ? this.$store.state.signboard.selectedSignboard
        : [];
    },
    computedLocation() {
      if (_get(this.storeSelectedSignboard, "location.length")) {
        return [
          this.storeSelectedSignboard.location[0],
          this.storeSelectedSignboard.location[1]
        ];
      } else if (
        this.storeSelectedSignboard &&
        this.storeSelectedSignboard.location &&
        typeof this.storeSelectedSignboard.location === "object"
      ) {
        return [
          this.storeSelectedSignboard.location.coordinates[1],
          this.storeSelectedSignboard.location.coordinates[0]
        ];
      } else {
        return [0, 0];
      }
    },
    computedbuildingName() {
      return !_isEmpty(this.storeSelectedSignboard.buildingDetails)
        ? this.storeSelectedSignboard.buildingDetails.englishAddr
        : "";
    },
    areaCode() {
      return !_isEmpty(this.storeSelectedSignboard.buildingDetails)
        ? this.storeSelectedSignboard.buildingDetails.areaCode
        : "";
    },
    surveyId() {
      return !_isEmpty(this.storeSelectedSignboard)
        ? this.storeSelectedSignboard.tripRefId
        : "";
    },
    fileRefNo() {
      return !_isEmpty(this.storeSelectedSignboard.buildingDetails)
        ? this.storeSelectedSignboard.buildingDetails.fileRef
        : "";
    },
    surveyDate() {
      const dateString = !_isEmpty(this.$store.state.signboard.tripList)
        ? this.$store.state.signboard.tripList.find(trip => {
            return trip.refId === this.surveyId;
          }).startTime
        : "";

      return moment(dateString).format("DD MMMM YYYY");
    },
    computedStructureId() {
      return this.storeSelectedSignboard.structId
        ? this.storeSelectedSignboard.structId
        : null;
    },
    computedVerified() {
      return this.storeSelectedSignboard.verified;
    },
    computedShow() {
      return this.showLess ? "Show More" : "Show Less";
    },
    storeNearestBuildings() {
      return !_isEmpty(this.$store.state.signboard.nearestBuildings)
        ? this.$store.state.signboard.nearestBuildings
        : [];
    },
    headroom() {
      return this.storeSelectedSignboard.headroom;
    },
    projection() {
      return this.storeSelectedSignboard.projection;
    },
    buildingStatus() {
      let selectedSignboard = this.$store.state.signboard.selectedSignboard;

      return selectedSignboard.revisionStatus
        ? selectedSignboard.revisionStatus.structId.status
        : false;
    },
    revisionStatus(){
      return this.storeSelectedSignboard.revisionStatus;
    },
    buildingUpdateBy() {
      return this.buildingStatus ? this.revisionStatus.structId.updatedBy : "";
    },
    buildingUpdateTime() {
      return this.buildingStatus
        ? moment(this.revisionStatus.structId.updated).format("dd mm yyyy hh:mm")
        : "";
    },
    defectTypeModifiedStatus() {
      let defectTypeModified = this.$store.state.signboard.selectedSignboard
        .revisionStatus.defectTypeModified.status
        ? this.$store.state.signboard.selectedSignboard.revisionStatus
            .defectTypeModified.status
        : false;

      return defectTypeModified;
    },
    defectTypeModifiedBy() {
      let defectTypeModifiedBy = this.defectTypeModifiedStatus
        ? this.$store.state.signboard.selectedSignboard.revisionStatus
            .defectTypeModified.updatedBy
        : "";

      return defectTypeModifiedBy;
    },
    defectTypeModifiedTime() {
      let defectTypeModifiedTime = this.defectTypeModifiedStatus
        ? this.$store.state.signboard.selectedSignboard.revisionStatus
            .defectTypeModified.updated
        : "";

      return defectTypeModifiedTime;
    },
    signboardIdentificationRevised() {
      return MODIFICATION_NAME_MAP[this.revisionStatus.signboardIdentificationRevised.status];
    },
    defectiveSignboardRevised() {
      return MODIFICATION_NAME_MAP[this.revisionStatus.defectiveSignboardRevised.status];
    },
    boundingAreaRevised(){
      if(this.revisionStatus.signboardBoundingAreaRevised.status || this.revisionStatus.defectBoundingAreaRevised.status){
        return "Yes";
      } else {
        return "No";
      }
    },
    peopleInCharge(){
      return this.storeSelectedSignboard.peopleInCharge;
    },
    peopleInChargeDisplay(){
      return [{
        key: "SPO's",
        value: _get(this.peopleInCharge, 'seniorPro')
      },{
        key: "Case Officer",
        value: _get(this.peopleInCharge, 'caseOfficer')
      },{
        key: "Case Assistant",
        value: _get(this.peopleInCharge, 'caseAssistant')
      }]
    },
    caseOfficer(){
      return _get(this.peopleInCharge, 'caseOfficer');
    },
    dsrnHandling() {
      return this.storeSelectedSignboard.dsrnHandling;
    },
    dsrnActionTaken() {
      return(_get(this.dsrnHandling, "actionTaken") === 'taken') ? "Taken" : "Pending"
    },
    userId() {
      return window.localStorage.getItem("userId");
    },
    userPost() {
      return this.$store.state.user.currUser.post;
    },
  },
  watch: {
    initialBuildingLocation: {
      handler(object) {
        if (object !== undefined) {
          this.select = {
            englishAddress: object.englishAddress ?? "",
            structId: object.structId ?? ""
          };
          if(object.englishAddress && object.structId) {
            this.nearestBuildings = [
              ...this.storeNearestBuildings,
              { ...this.select }
            ];
          }
        }
      }
    },
    dsrnHandling() {
      if (!_isEmpty(this.dsrnHandling)) {
        this.setDSRN();
      }
    }
  },
  methods: {
    async onBldgChange(e) {
      await this.updateBuilding({
        signboardId: this.storeSelectedSignboard.signboardId,
        building: { ...e, lon: e.x, lat: e.y }
      });
    },
    toggleShow() {
      this.showLess = !this.showLess;
    },
    ...mapActions({
      updateBuilding: "signboard/updateBuilding",
      getBuildings: "signboard/getBuildings",
      updateDSRNHandling: "signboard/updateDSRNHandling",
      getUserInfo: "user/getUserInfo"
    }),
    async onOpen(e) {
      await this.getBuildings({
        lat: this.storeSelectedSignboard.buildingDetails.lat,
        long: this.storeSelectedSignboard.buildingDetails.lon,
        precision: 10.0
      });
      this.nearestBuildings = this.$store.state.signboard.nearestBuildings;
    },
    closeExpandedView() {
      this.generateDialog = false
      this.dsrnDialog = false
      this.coverLeterDialog = false
    },
    async saveDSRN() {
      let dsrnData = {};
      if (this.dsrnServRadioGroup === 'true') { 
        await this.$refs.form.validate()
        if (this.valid) {
            dsrnData = {
              dsrnNotServeReason: [],
              dsrnToBeServed: this.dsrnServRadioGroup,
              dsrnNo: this.dsrnNo,
              account: this.dsrnAccount,
              actionTaken: 'taken'
            }
        }
        else {
           dsrnData = {
              dsrnNotServeReason: [],
              dsrnToBeServed: this.dsrnServRadioGroup,
              dsrnNo: this.dsrnNo,
              actionTaken: 'taken'
            }
        }
      }
      else {
        dsrnData = {
          dsrnNotServeReason: [this.dsrnNotServeReason],
          dsrnToBeServed: this.dsrnServRadioGroup,
          actionTaken: 'taken'
        } 
      }
      await this.updateDSRNHandling({
        signboardId: this.storeSelectedSignboard.signboardId,
        dsrnHandling: dsrnData,
        peopleInCharge : {
          seniorPro: this.peopleInChargeDisplay[0].value,
          caseOfficer: (!_isEmpty(this.userPost)) ? this.userPost : this.peopleInChargeDisplay[1].value,
          caseAssistant: this.peopleInChargeDisplay[2].value
        }
      })
    },
    setDSRN() {
      if (!_has(this.dsrnHandling, 'dsrnToBeServed')) {
        this.dsrnServRadioGroup= null;
        this.dsrnAccount = "";
        this.dsrnNo = '';
        this.$refs.form.reset();
      }
      else {
        this.dsrnServRadioGroup = this.dsrnHandling.dsrnToBeServed.toString()
        this.dsrnNo = this.dsrnHandling.dsrnNo;
        this.dsrnAccount = this.dsrnHandling.account;
      }
      this.dsrnNotServeReason = this.dsrnHandling.dsrnNotServeReason[0]
    },
    async onGenerateDocs() {
      await this.$refs.form.validate();
      if (this.valid || !this.dsrnHandling.dsrnToBeServed) {
        this.generateDialog = true;
      }
    }
  },
  async mounted() {
    this.buildingItems.push(this.buildingName);
    this.$nextTick(() => {
      this.select.englishAddress = this.storeSelectedSignboard.buildingDetails.englishAddress;
      this.select.structId = this.storeSelectedSignboard.buildingDetails.structId;
      if(this.select.structId && this.select.englishAddress) {
        this.nearestBuildings = [
          ...this.storeNearestBuildings,
          { ...this.select }
        ];
      }
    });
    await this.getUserInfo(this.userId);
    if (!_isEmpty(this.dsrnHandling)) {
      this.setDSRN();
    }
  }
};
</script>
