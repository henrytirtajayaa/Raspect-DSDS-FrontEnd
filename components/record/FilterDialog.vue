<template>
  <v-card class="filter-dialog">
    <v-container>
      <v-row>
        <v-col cols="3">
          <div class="filter-dialog__item-container">
            <v-expansion-panels
              flat
              class="
                filter-dialog__item
                text text--medium text--secondary-style text--bold
              "
              v-model="panel"
            >
              <v-expansion-panel
                v-for="(item, index) in items"
                @click="selectTab(item)"
                :class="{ selected: currentTabComponent.id === item.id }"
                :key="index"
              >
                <v-expansion-panel-header hide-actions>
                  <span
                    :class="{
                      'text text--medium': true,
                      'selected-text': currentTabComponent.id === item.id,
                    }"
                    >{{ item.title }}</span
                  >
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li
                      v-for="filterField in item.fields"
                      :key="filterField.id"
                      class="filter-dialog__sub-display"
                      @click="setSubTab(filterField.id)"
                    >
                      <span
                        class="text"
                        :style="{
                          color:
                            selectedSubTab === filterField.id ? '#056694' : '',
                        }"
                      >
                        {{ filterField.title }}
                      </span>
                      <template
                        v-if="
                          !checkIfEmpty(
                            filterObj[item.id][filterField.id].value,
                            filterField.id
                          )
                        "
                      >
                        <img src="/check-circle.svg" />
                      </template>
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>
        <v-col cols="9" class="mt-5">
          <div class="text text--extra-large text--bold">
            {{ currentTabComponent.title }}
          </div>
          <keep-alive>
            <component
              :is="currentTabComponent.component"
              :selectedSubTab="selectedSubTab"
            ></component>
          </keep-alive>
        </v-col>
      </v-row>
    </v-container>
    <div class="filter-dialog__btn-container">
      <v-row>
        <v-col cols="4">
          <div class="filter-dialog__button-container justify-start ml-4">
            <v-btn color="primary" outlined elevation="0" @click="resetFilterTable">
              <span class="text text--medium text--bold text--blue"
                >Clear all Selections</span>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="4">
          <div class="filter-dialog__results-text-container">
            <span class="text text--secondary"
              >{{ filterResults }} results</span
            >
          </div>
        </v-col>
        <v-col cols="4">
          <div class="filter-dialog__button-container">
            <v-btn class="mr-4" color="primary" outlined elevation="0" @click="closeFilter">
              <span class="text text--medium text--bold text--blue"
                >Cancel</span
              >
            </v-btn>
            <v-btn color="primary" @click="applyFilter">
              <span class="text text--medium text--bold text--white"
                >Apply Filter(s)</span
              >
            </v-btn>
            
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
<script>

import {mapActions, mapMutations} from "vuex";
import {mapFields} from 'vuex-map-fields';
import _isEmpty from 'lodash/isEmpty'
import { TAB_MAP } from '../../constants';

export default {
    props: ["selectedTab"],
    data() {
        return {
            selectedSubTab: "",
            items: [
                {
                    id: "survey",
                    title: "Survey",
                    component: "RecordSurveyFilter",
                    fields: [
                        {
                            title: "Survey Batch ID",
                            id: "surveyId"
                        },
                        {
                            title: "Survey Date",
                            id: "surveyDateRange"
                        },
                        {
                            title: "Trip ID",
                            id: "tripId"
                        },
                    ]
                },
                {
                    id: "signboard",
                    title: "Signboard",
                    component: "RecordSignboardIdFilter",
                    fields: [
                        {
                            title: "Signboard ID",
                            id: "signboardId"
                        },
                        {
                          title: "Sampled Signboard",
                          id: "sampled"
                        },
                        {
                            title: "BD File Reference",
                            id: "fileRef"
                        },
                        {
                            title: "Headroom (m)",
                            id: "headroom"
                        },
                        {
                            title: "Projection (m)",
                            id: "projection"
                        },
                        {
                            title: "Defective Signboard",
                            id: "signboardType"
                        },
                        {
                            title: "Types of Defects",
                            id: "defectTypes"
                        }
                    ]
                },
                {
                    id: "location",
                    title: "Location",
                    component: "RecordLocationFilter",
                    fields: [
                        {
                            title: "Area Code",
                            id: "areaCode"
                        },
                        {
                            title: "Street Name and Building Name",
                            id: "englishAddress"
                        }
                    ]
                },
                {
                    id: "peopleInCharge",
                    title: "People in Charge",
                    component: "RecordPeopleFilter",
                    fields: [
                        {
                            title: "SPO's",
                            id: "seniorPro"
                        },
                        {
                            title: "Case Officer",
                            id: "caseOfficer"
                        },
                        {
                            title: "Case Assistant",
                            id: "caseAssistant"
                        }
                    ]
                },
                {
                    id: "modification",
                    title: "Modification",
                    component: "RecordModFilter",
                    fields: [
                        {
                            title: "Signboard Identification Revised",
                            id: "signboardIdentificationRevised"
                        },
                        {
                            title: "Bounding Area Modified",
                            id: "boundingAreaRevised"
                        },
                        {
                            title: "Defective Signboard Revised",
                            id: "defectiveSignboardRevised"
                        },
                        {
                            title: "Defect Types Modified",
                            id: "defectTypeModified"
                        },
                        {
                            title: "Original Defect Types",
                            id: "defectTypeOriginal"
                        }
                    ]
                },
                {
                    id: "dsrn",
                    title: "DSRN",
                    component: "RecordDsrnFilter",
                    fields: [
                        {
                            title: "DSRN to be served",
                            id: "dsrnToBeServed"
                        },
                        {
                            title: "DSRN No.",
                            id: "dsrnNo"
                        },
                        {
                          title: "Reason of Not Serving DSRN",
                          id: "dsrnNotServeReason"
                        },
                        {
                          title: "Account",
                          id: "account"
                        },
                        {
                          title: "Signboard Owner and Address",
                          id: "signboardOwnerNAddress"
                        },
                        {
                          title: "Inspection Proforma",
                          id: "inspectionProformaPath"
                        },
                        {
                          title: "DSRN",
                          id: "dsrnPath"
                        },
                        {
                          title: "Covering letter for DSRN",
                          id: "coveringLetterPath"
                        },
                        {
                          title: "Action Taken",
                          id: "actionTaken"
                        }
                    ]
                }
            ],
            currentTabComponent: { title: "Survey", component: "RecordSurveyFilter" }
        }
    },
    methods: {
        checkIfEmpty(value, filterFieldId) {
            if(filterFieldId === 'defectTypeModified') {
                return value === "" ? true : false;
            }
            else if (filterFieldId === 'sampled') {
              if (_isEmpty(this.filterObj.signboard.verified.value) &&
                  _isEmpty(this.filterObj.signboard.sampled.value) &&
                  _isEmpty(this.filterObj.modification.signboardIdentificationRevised.value) ) {
                  return true;
                  
              } else {
                return false;
              }
            }
            return _isEmpty(value);
        },
        selectTab(item) {
            this.currentTabComponent = item;
            this.defaultSubTab = TAB_MAP[item.id];
        },
        ...mapActions({
            filterRecords: "record/filterRecords"
        }),
        ...mapMutations({
            updateCheckbox: "record/updateCheckbox"
        }),
        applyFilter() {
            this.$emit("closedialog");
            this.$emit("updateloading");
            this.$emit("settags", this.$store.state.record.filter);
            this.filterRecords({filter: this.$store.state.record.filter, sort: this.$store.state.record.sort, ignoreProcessing: false, applyFilter: true});

            this.setCurrentTabComponent();
        },
        closeFilter() {
            this.$emit("closedialog");
            this.setCurrentTabComponent();
        },
        resetFilterTable() {
            this.$emit("resetfilter");
        },
        getCheckboxVal(subCategoryId, categoryId) {
            return this.$store.state.record.filter[categoryId][subCategoryId].isChecked;
        },
        onCheckboxClick(subCategoryId, categoryId) {
            this.updateCheckbox({subCategoryId, categoryId});
        },
        setSubTab(subTab) {
            this.selectedSubTab = subTab;
        },
        setCurrentTabComponent(){
            this.currentTabComponent = this.items.find((item) => item.id === this.selectedTab);
        }
    },
    watch: {
        selectedTab (selectedTab) {
          this.currentTabComponent = this.items.find((item) => item.id === selectedTab);
        },
        defaultSubTab (subTab) {
            this.selectedSubTab = subTab;
        }
    },
    computed: {
        ...mapFields({
            filterObj: "record.filter"
        }),
        filterResults() {
            return this.$store.state.record.totalCountTemp;
        },
        panel: {
            get() {
                return this.$store.state.record.panel;
            },
            set(value) {
                return this.$store.commit("record/updatePanelValue", value);
            }
        },
        defaultSubTab: {
            get() {
                return this.$store.state.record.defaultSubTab;
            },
            set(value) {
                return this.$store.commit("record/updateDefaultSubTab", value);
            }
        }
    },
    mounted() {
        this.currentTabComponent = this.items.find((item) => item.id === this.selectedTab);
        this.selectedSubTab = this.defaultSubTab;
    }
}
</script>