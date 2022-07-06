<template class="signboard-info">
  <div>
    <div class="signboard-info__title-container">
      <!-- <div>
        <v-btn fab elevation="0" @click="$emit('set-annotation-mode')" color="transparent">
          <v-icon>
            mdi-chevron-left
          </v-icon>
        </v-btn>
      </div> -->
      <img src="/signboard-defective.svg" />
      <div class="signboard-info__title text text--large">
        {{ signboardId }}
      </div>
    </div>
    <div>
      <div
        :class="`signboard-info__status-box signboard-info__status-box--${storeSelectedSignboard.signboardType}`"
      >
        <span
          :class="`signboard-info__status-box-text signboard-info__status-box-text--${storeSelectedSignboard.signboardType}`"
          >{{ storeSelectedSignboard.signboardType }} Signboard</span
        >
      </div>
      <div
        class="signboard-info__status-box signboard-info__status-box--normal signboard-info__status-box--flex"
      >
        <div
          class="signboard-info__status-box-text signboard-info__status-box-text--grey"
        >
          Sampling
        </div>
        <v-checkbox
          dense
          :ripple="false"
          class="ma-0 pa-0 test"
          :v-model="false"
          readonly
        ></v-checkbox>
      </div>
      <div
        class="signboard-info__status-box signboard-info__status-box--normal signboard-info__status-box--flex"
      >
        <div
          class="signboard-info__status-box-text signboard-info__status-box-text--grey"
        >
          Verification
        </div>
        <v-checkbox
          dense
          :ripple="false"
          class="ma-0 pa-0 test"
          v-model="storeSelectedSignboard.verified"
          readonly
        ></v-checkbox>
      </div>
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
            <span class="text text--bold">Survey</span>
          </v-expansion-panel-header>
          <v-divider></v-divider>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col>
                  <span class="text text--medium">Survey Batch ID</span>
                </v-col>
                <v-col><span class="text text--small">{{ storeSelectedSignboard.tripRefId }}</span></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Survey Date</span>
                </v-col>
                <v-col><span class="text text--small">{{ surveyDate }}</span></v-col>
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
            <span class="text text--bold">Location</span>
          </v-expansion-panel-header>
          <v-divider></v-divider>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col>
                  <span class="text text--medium">Street Name and Building Name</span>
                </v-col>
                <v-col>
                  <span class="text text--small">{{ address }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6"
                  ><span class="text text--medium">Building Name</span></v-col
                >
                <v-col cols="6">
                  <span>
                    <v-select :items="nearestBuildings" outlined item-text="english_address" item-value="struct_id" dense :value="structureId" @change="onBldgChange($event)" class="building-select text text--small">
                      <template v-slot:prepend>
                        <SignboardBuildingLocationModal
                          :selectedResultLocation="
                            computedLocation
                          "
                          :isModalOpen="isBuildingModalOpen"
                          :signboardId="storeSelectedSignboard.id"
                          :structureId="structureId"
                        ></SignboardBuildingLocationModal>
                      </template>
                    </v-select>
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">BD File Reference</span>
                </v-col>
                <v-col>
                  <span class="text text--medium">{{ fileRefNo }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Area Code</span>
                </v-col>
                <v-col>
                  <span class="text text--medium">{{ areaCode }}</span>
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
            <span class="text text--bold">
              Signboard Type
            </span>
          </v-expansion-panel-header>
          <v-divider></v-divider>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col>
                  <span class="text text--medium">Headroom (m)</span>
                </v-col>
                <v-col><span class="text text--small">{{ storeSelectedSignboard.headroom }} m</span></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Projection (m)</span>
                </v-col>
                <v-col>
                  <span class="text text--small">{{ storeSelectedSignboard.projection }} m</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Types of Defects</span>
                </v-col>
                <v-col>
                  <template v-for="defectObj of storeSelectedSignboard.defectTypes" >
                    <v-chip :key="defectObj" class="signboard-info__chip">{{ defectTypes[defectObj].letterGrade }}</v-chip>
                  </template>
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
            <span class="text text--bold">People in Charge</span>
          </v-expansion-panel-header>
          <v-divider></v-divider>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col>
                  <span class="text text--medium">SPO's</span>
                </v-col>
                <v-col>Carrie Lam</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Case Officer</span>
                </v-col>
                <v-col>Martin Tsang</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Case Assistant</span>
                </v-col>
                <v-col>Martin Tsang</v-col>
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
            <span class="text text--bold">Modification</span>
          </v-expansion-panel-header>
          <v-divider></v-divider>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col>
                  <span class="text text--medium"
                    >Signboard Identification Revised</span
                  >
                </v-col>
                <v-col>Carrie Lam</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium"
                    >Defective Signboard Revised Defect</span
                  >
                </v-col>
                <v-col>Martin Tsang</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium"
                    >Types Modified Bounding Area</span
                  >
                </v-col>
                <v-col>Martin Tsang</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Modified</span>
                </v-col>
                <v-col>Martin Tsang</v-col>
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
            <span class="text text--bold">DSRN</span>
          </v-expansion-panel-header>
          <v-divider></v-divider>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col>
                  <span class="text text--medium">DSRN to be served</span>
                </v-col>
                <v-col>Carrie Lam</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">DSRN No.</span>
                </v-col>
                <v-col>Martin Tsang</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium"
                    >Reason of Not Serving DSRN</span
                  >
                </v-col>
                <v-col>Martin Tsang</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Account</span>
                </v-col>
                <v-col></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium"
                    >Signboard Owner and Address</span
                  >
                </v-col>
                <v-col></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Inspection Proforma</span>
                </v-col>
                <v-col></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">DSRN</span>
                </v-col>
                <v-col></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium"
                    >Covering letter for DSRN</span
                  >
                </v-col>
                <v-col></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span class="text text--medium">Action Taken</span>
                </v-col>
                <v-col></v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>
<script>
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {DEFECT_TYPES} from '../../constants';

export default {
  data() {
    return {
      panel: [0],
      sampledData: true,
      verification: true,
      buildingName: "14 Argyle Street",
      computedSelectedSignboard: {
        location: [22.302711, 114.177216],
        id: "BO00015",
        image: {
          src:
            "https://hongkongfp.com/wp-content/uploads/2018/11/neon-sign-one-Copy.jpg",
          title: "IMG FOR BO00015"
        }
      },
      buildingItems: ["Building Z", "Building Y", "Building X"],
      isEditButtonClicked: false,
      defectTypes: DEFECT_TYPES.reduce((acc,curr)=> ({...acc, [curr.id]: curr }),{})
    };
  },
  props: ["isDefectTool", "fromSignboardDetail"],
  methods: {
    toggleEditButton() {
      this.isEditButtonClicked = !this.isEditButtonClicked;
    },
    toggleAnnotateDefectMode() {
      this.$emit("toggleAnnotateDefectMode");
    }
  },
  mounted() {
    this.buildingItems.push(this.buildingName);
  },
  computed: {
    storeSelectedSignboard() {
      return this.$store.state.signboard.selectedSignboard
    },
    surveyDate() {
      const foundTrip = this.$store.state.signboard.tripList.find((trip) => {
        return trip.refId === this.storeSelectedSignboard.tripRefId
      });

      const dateString = !_isEmpty(this.$store.state.signboard.tripList) && !_isEmpty(foundTrip)? foundTrip.startTime : ""

      return moment(dateString).format("DD MMMM YYYY");
    },
    signboardId() {
      return this.storeSelectedSignboard.signboardId
    },
    nearestBuildings() {
      return this.$store.state.signboard.nearestBuildings;
    },
    structureId() {
      return this.storeSelectedSignboard.structureId ? this.storeSelectedSignboard.structureId : null
    },
    fileRefNo() {
      return !_isEmpty(this.storeSelectedSignboard.buildingDetails) ? this.storeSelectedSignboard.buildingDetails.fileRef : ""
    },
    areaCode() {
      return !_isEmpty(this.storeSelectedSignboard.buildingDetails) ? this.storeSelectedSignboard.buildingDetails.areaCode : ""
    },
    address() {
      return !_isEmpty(this.storeSelectedSignboard.buildingDetails) ? this.storeSelectedSignboard.buildingDetails.englishAddr : ""
    }
  }
};
</script>
