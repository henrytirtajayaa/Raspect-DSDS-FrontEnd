<template>
  <div id="map-wrap" class="record-list">
    <v-container fluid class="pa-0">
      <v-row no-gutters class="grey lighten-2 accent-4">
        <v-col cols="10">
          <v-tabs
            height="60px"
            background-color="grey lighten-2 accent-4"
            class="pl-8"
            center-active
          >
            <v-tab>Signboard list</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align="center">
        <v-col cols="2">
          <div class="text text--secondary-style text--bold">
            Preset List Setting
          </div>
        </v-col>
        <v-col cols="4">
          <div class="record-list__preset-container">
            <v-select
              label="Name of Preset"
              outlined
              dense
              class="record-list__preset-select"
              :items="filterPresets"
              item-text="name"
              item-key="_id"
              @change="applyFilter"
              :return-object="true"
              v-model="selectPreset"
            ></v-select>
            <v-btn color="red" @click="deletePreset" :loading="isSaving.btnDel"
              ><span class="text text--white text--bold"
                >Delete Preset</span
              ></v-btn
            >
          </div>
        </v-col>
        <v-col cols="6">
          <div class="record-list__display-container">
            <v-menu :close-on-content-click="false" v-model="isDisplayMenuOpen">
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on" v-bind="attrs">
                  <span class="text text--secondary-style text--bold"
                    >Display Option</span
                  >
                  <v-icon>mdi-arrow-down-drop-circle</v-icon>
                </div>
              </template>
              <RecordTableDisplayMenu
                @save-apply-display="applyDisplay"
                @close-display-menu="closeDisplayMenu"
              ></RecordTableDisplayMenu>
            </v-menu>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-dialog
        :close-on-content-click="false"
        persistent
        width="1047"
        v-model="filterDialog"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-row align="center">
            <v-col cols="2">
              <div class="text text--secondary-style text--bold">
                Filter Option
              </div>
            </v-col>
            <v-col cols="9">
              <v-row align="center">
                <v-col
                  cols="2"
                  align-self="center"
                  v-for="(selectField, index) of selectFields"
                  :key="index"
                >
                  <v-select
                    :label="selectField.label"
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                    @click="setTab(selectField.tab, index)"
                    :menu-props="{ value: false }"
                    prepend-inner-icon="mdi-magnify"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="1">
              <v-btn
                elevation="0"
                outlined
                color="primary"
                v-on="on"
                @click="setTab('survey')"
                :ripple="false"
                :menu-props="{ value: false }"
                prepend-inner-icon="mdi-magnify"
              >
                <v-icon left> mdi-tune </v-icon>
                <span class="text text--blue text--bold">Filters</span>
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <RecordFilterDialog
          :selectedTab="selectedTab"
          :defaultSubTab="defaultSubTab"
          @closedialog="closeDialog"
          @settags="setTags"
          @updateloading="updateLoading"
          @resetfilter="resetFilter"
        ></RecordFilterDialog>
      </v-dialog>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <template v-for="(elem, index) of tags">
            <v-chip
              class="ma-2"
              close
              :key="index"
              @click:close="removeTag(elem.value, elem.tab, elem.field)"
            >
              <template v-if="elem.value !== null && elem.value !== 'true' && elem.value !== 'false' && elem.value !== 'null'">
                <span class="text text--secondary-style">{{ elem.value }}</span>
              </template>
              <template v-else-if="elem.value === 'true'">
                <span class="text text--secondary-style">Yes</span>
              </template>
              <template v-else-if="elem.value === 'false'">
                <span class="text text--secondary-style">No</span>
              </template>
              <template v-else-if="elem.value === 'null'">
                <span class="text text--secondary-style">Blank</span>
              </template>
              <template v-else>
                <span class="text text--secondary-style">Blank File Reference</span>
              </template>
            </v-chip>
          </template>
        </v-col>
        <v-col cols="2">
          <v-row class="justify-end mr-3" >
            <template v-if="selectPreset.name && tags.length">
              <v-dialog
                v-model="saveDialog"
                content-class="dialog-container"
                persistent
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="white" elevation="0" v-bind="attrs" v-on="on" class="mx-3" :loading="isSaving.btnsave">
                    <span class="text text--bold">Save As A New Preset</span>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Save As A New Preset</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="filterName"
                            label="Name of Filter"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="saveDialog = false">
                      Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveSearch">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn color="primary" elevation="0" :loading="isSaving.btn" @click="updateCurrPreset">
                <span class="text text--white text--bold">Save</span>
              </v-btn>
            </template>
            <template v-else-if="!selectPreset.length && tags.length">
              <v-dialog
                v-model="saveDialog"
                content-class="dialog-container"
                persistent
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" elevation="0" v-bind="attrs" v-on="on" :loading="isSaving.btnsave">
                    <span class="text text--white text--bold">Save</span>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Save Filter</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="filterName"
                            label="Name of Filter"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="saveDialog = false">
                      Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveSearch">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
          </v-row>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="6">
          <div class="action-container">
            <div class="text text--medium text--secondary-style text--bold">
              {{ totalCount }} results
            </div>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="record-list__export-container">
            <v-btn
              solo
              elevation="0"
              color="white"
              @click="onOpenSelectedSignboardId"
              :ripple="false"
              v-if="selectedRows.length > 0"
            >
              <span class="text text--bold text--blue"
                >Open Selected in Map View</span
              >
            </v-btn>
            <v-btn
              solo
              elevation="0"
              color="white"
              @click="onExportImageClick"
              :ripple="false"
              v-if="selectedRows.length > 0"
            >
              <span class="text text--bold text--blue"
                >Export Selected Image(s)</span
              >
            </v-btn>
            <v-btn
              solo
              elevation="0"
              color="white"
              :ripple="false"
              @click="exportList"
            >
              <div class="text text--bold text--blue">Export List</div>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="computedHeaders"
            :items="dataSource"
            show-select
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortOrder"
            item-key="signboardId"
            v-model="selectedRows"
            :loading="true"
            loading-text="Loading... Please wait"
            hide-default-footer
          >
          <v-progress-linear
              v-show="isLoading"
              slot="progress"
              color="primary"
              indeterminate
            ></v-progress-linear>

            <template v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.signboardId"
                  @mouseover="selectItem(item)"
                  @mouseleave="unSelectItem()"
                >
                  <td>
                    <span v-if="item === selectedItem">
                      <v-checkbox
                        color="#056694"
                        :value="item"
                        v-model="selectedRows"
                        multiple
                        class="remove-spacing"
                        hide-details
                      ></v-checkbox>
                    </span>
                    <span v-else-if="selectedRows.includes(item)">
                      <v-checkbox
                        color="#056694"
                        :value="item"
                        v-model="selectedRows"
                        multiple
                        class="remove-spacing"
                        hide-details
                      ></v-checkbox>
                    </span>
                  </td>
                  <template v-for="element in tableColumns">
                    <td :key="element.id">
                      {{ resolveValue(item, element.id) }}
                    </td>
                  </template>
                  <td>
                    <v-icon
                      @click="redirect(item.signboardId)"
                      v-if="item === selectedItem"
                    >
                      mdi-map
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <v-pagination
            v-model="currentPage"
            :length="pageLength"
            :total-visible="5"
            @next="flip"
            @previous="flip"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :value="isDownloading">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-snackbar top color="#056694" elevation="20" v-model="isSaving.notif">
      <h3 class="text text--white">{{ notifMesssage }}</h3>
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="isSaving.notif = false">
            Close
          </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar top color="#F44336" elevation="20" v-model="isSaving.warning">
      <h3 class="text text--white">{{ warnMesssage }}</h3>
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="isSaving.warning = false">
            Close
          </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>

import { mapActions, mapMutations } from "vuex";
import _differenceBy from "lodash/differenceBy";
import _intersectionBy from "lodash/intersectionBy";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _cloneDeep from "lodash/cloneDeep";
import { cleanFilter } from "../requests/record.js";
import { DEFAULT_FILTER, DEFAULT_HEADERS, TAB_MAP } from "../constants";

export default {
    data() {
        return {
            selectFields: [
                {
                    label: "Survey",
                    tab: 'survey'
                },
                {
                    label: "Signboard ID",
                    tab: 'signboard'
                },
                {
                    label: "Location",
                    tab: "location"
                },
                {
                    label: "People in charge",
                    tab: "peopleInCharge"
                },
                {
                    label: "Modification",
                    tab: "modification"
                },
                {
                    label: "DSRN",
                    tab: "dsrn"
                }
            ],
            selectedRows: [],
            items: [],
            defaultHeaders: DEFAULT_HEADERS,
            headers: DEFAULT_HEADERS,
            selectedTab: "",
            selectedItem: false,
            currentPage: 1,
            filterDialog: false,
            saveDialog: false,
            filterName: "",
            selectPreset: [],
            tags: {},
            isDisplayMenuOpen: false,
            isLoading: true,
            isDownloading: false,
            isSaving: {btn: false, notif: false, btnsave: false, btnDel: false, warning: false},
            notifMesssage: "",
            warnMesssage: ""
        }
    },
    methods: {
        async onExportImageClick() {
            this.isDownloading = true;
            await this.exportImages(this.selectedRows.map((signboard)=> signboard.signboardId));
            this.isDownloading = false;
        },
        async onOpenSelectedSignboardId() {
            window.open(`/${this.selectedSignboardIds}/selected-signboard-map`, '_blank').focus();
        },
        setTab(item, index) {
            this.selectedTab = item;
            this.panel = index;

            this.defaultSubTab = TAB_MAP[item];
        },
        ...mapActions({
            getRecords: "record/getRecords",
            saveSettings: "record/saveSettings",
            exportImages: "record/exportImages",
            exportSignboardRecords: "record/exportSignboardRecords",
            flipPage: "record/flipPage",
            getPresets: "record/getPresets",
            filterRecords: "record/filterRecords",
            deleteFilterPreset: "record/deleteFilterPreset",
            getSurveysIds: "record/getSurveysIds",
            updateFilterPreset: "record/updateFilterPreset",
        }),
        ...mapMutations({
            setFilter: "record/setFilter",
            emptyFilterField: "record/emptyFilterField",
            removeValue: "record/removeValue",
            updateDisplayFields: "record/updateDisplayFields",
            setDefaultFilter: "record/setDefaultFilter"
        }),
        mapOrder (array, order, key) {
            array.sort( function (a, b) {
                var A = a[key], B = b[key];
                
                if (order.indexOf(A) > order.indexOf(B)) {
                    return 1;
                } else {
                    return -1;
                }
            });
            
            return array;
        },
        applyDisplay (fields, hiddenFields, ignoreOrder) {
            let order = fields.map((field) => field.id);
            let shownFields = [];
            let sortedFields = [];
            if(!ignoreOrder) {
                shownFields = _differenceBy([...fields], hiddenFields, "id");
            } else {
                shownFields = [...fields];
            }
            if (!ignoreOrder) {
                sortedFields = this.mapOrder(shownFields, order, "id");
            } else {
                sortedFields = shownFields.map((elem) => {
                    let column = this.defaultHeaders.find((header) => header.id === elem);

                    return column;
                });
            }
            this.headers = ignoreOrder ? sortedFields : sortedFields.map((elem) => {
                let column = this.defaultHeaders.find((header) => header.id === elem.id);

                return column;
            });
            this.updateDisplayFields(this.headers);
            this.closeDisplayMenu();
        },
        closeDisplayMenu(){
            this.isDisplayMenuOpen = false;
        },
        async saveSearch() {
            this.saveDialog = false;
            this.isSaving.btnsave = true;
            let filterObj = this.processFilter(this.filter);
            let displayObj = this.processDisplay(this.display);
            let sortObj = this.processSort(this.sort);
            
            await this.saveSettings(
                {
                    settings: {
                        name: this.filterName,
                        filter: filterObj,
                        display: displayObj,
                        sort: { ...sortObj }
                    },
                    staffId: window.localStorage.getItem("userId"),
                    accessToken: window.localStorage.getItem("accessToken")
                }
            );
            this.isSaving.btnsave = false;
            this.isSaving.notif = true;
            this.notifMesssage = "Save Successful"
        },
        async updateCurrPreset() {
            this.isSaving.btn = true;
            let filterObj = this.processFilter(this.filter);
            let displayObj = this.processDisplay(this.display);
            let sortObj = this.processSort(this.sort);
            
            await this.updateFilterPreset(
                {
                    settings: {
                        name: this.selectPreset.name,
                        filter: filterObj,
                        display: displayObj,
                        sort: { ...sortObj }
                    },
                    filterId: this.selectPreset._id,
                    staffId: window.localStorage.getItem("userId"),
                    accessToken: window.localStorage.getItem("accessToken")
                }
            );
          this.isSaving.btn = false;
          this.isSaving.notif = true;
          this.notifMesssage = "Save Successful"
        },
        processFilter(filter)  {
            let filterKeys = Object.keys(filter);
            let processedFilter = {};

            for(let i = 0; i < filterKeys.length ; i ++ ) {
                let object = filter[filterKeys[i]];

                for(const property in object) {
                    let isChecked = _get(object, `${property}.value`);
                    if(isChecked) {
                        processedFilter[property] = _get(object, `${property}.value`)
                    }
                }
            }
            const revisionStatus = {
                signboardIdentificationRevised: processedFilter.signboardIdentificationRevised,
                defectiveSignboardRevised: processedFilter.defectiveSignboardRevised,
                boundingAreaRevised: processedFilter.boundingAreaRevised,
                defectTypeModified: processedFilter.defectTypeModified,
                defectTypeOriginal: processedFilter.defectTypeOriginal
            }

            const dsrnHandling = {
              dsrnToBeServed: processedFilter.dsrnToBeServed,
              dsrnNo: processedFilter.dsrnNo,
              dsrnNotServeReason: processedFilter.dsrnNotServeReason,
              account: processedFilter.account,
              signboardOwnerNAddress: processedFilter.signboardOwnerNAddress,
              inspectionProformaPath: processedFilter.inspectionProformaPath,
              dsrnPath: processedFilter.dsrnPath,
              coveringLetterPath: processedFilter.coveringLetterPath,
              actionTaken: processedFilter.actionTaken
            }

            processedFilter.revisionStatus = revisionStatus;
            processedFilter.dsrnHandling = dsrnHandling;

            return processedFilter;
        },
        processDisplay(display) {
            let processedDisplay = [];

            for(let data of display) {
                processedDisplay.push(data.id);
            }

            return processedDisplay;
        },
        processSort(sort) {
            let processedSort = {}

            processedSort[sort.columnId] = sort.order === "asc" ? 1 : -1;

            return processedSort;
        },
        redirect(signboardId) {
            window.open(`/${signboardId}/map-view`, '_blank').focus();
        },
        selectItem (item) {
            this.selectedItem = item
        },
        unSelectItem (item) {   
            this.selectedItem = false
        },
        async exportList() {
            this.isDownloading = true;
            await this.exportSignboardRecords({filter: this.$store.state.record.filter, sort: this.$store.state.record.sort, display: this.headers.map((header) => header.value)});
            this.isDownloading = false;
        },
        flip() {
            let processedFilter = cleanFilter(this.$store.state.record.filter, this.$store.state.record.sort);
            this.isLoading = true;
            this.flipPage({
                page: this.currentPage - 1,
                filter: processedFilter
            })
        },
        closeDialog() {
            this.filterDialog = false;
        },
        async applyFilter(e) {
            let clonePreset = _cloneDeep(e);
            this.isLoading = true;
            this.setDefaultFilter();
            await this.filterRecords({...e, ignoreProcessing: true});
            this.setFilter({ preset: clonePreset });
            this.tags = this.processIntoTags(_cloneDeep(this.filter));
            this.applyDisplay(e.display, [], true);
        },
        canShow(element) {
            return this.headers.map((elem) => elem.id).includes(element.id);
        },
        flattenObject(obj) {
            const result = {};

            Object.values(obj).forEach(nestedObject => {
                Object.assign(result, nestedObject);
            });   

            return result;
        },
        hasValue(tag, id) {
            if((id === 'headroom' || id === 'projection') && tag.value.length === 2 && tag.value[0] === 0 && tag.value[1] === 0) {
                return false;
            }
            return !_isEmpty(tag.value);
        },
        emptyValue(id) {
            this.emptyFilterField(id);
        },
        async deletePreset() {
          if (this.selectPreset.length !== 0) {
            const {_id} = this.selectPreset;

            this.isSaving.btnDel = true;
            await this.deleteFilterPreset(_id);
            this.selectPreset = [];
            this.isSaving.notif = true;
            this.isSaving.btnDel = false;
            this.notifMesssage = "Delete Successful";
          }
          else {
            this.isSaving.warning = true;
            this.warnMesssage = "Please select a preset to delete"
          }
        },
        removeTag(valueToRemove, tab, field) {
            let valueType = typeof DEFAULT_FILTER[tab][field].value;
            
            this.selectPreset = [];
            this.removeValue({ valueToRemove, tab, field, valueType });
            this.filterRecords({filter: this.$store.state.record.filter, sort: this.$store.state.record.sort, ignoreProcessing: false, applyFilter: true});
            this.tags = this.processIntoTags(_cloneDeep(this.filter));
            this.isLoading = true;
        },
        getType(fieldValue) {
            return typeof fieldValue;
        },
        resolveValue(item, id) {
            if (id === "surveyDate") {
                return item['surveyStartTime'];
            } else {
                return item[id]
            }
        },
        setTags(filter) {
            this.tags = this.processIntoTags(_cloneDeep(filter));
        },
        processIntoTags(filter) {
            let tags = [];

            Object.keys(filter).forEach((tab) => {
                Object.keys(filter[tab]).forEach((field) => {
                    if(this.getType(filter[tab][field].value) === 'object' && this.hasValue(filter[tab][field], field) && (field !== 'surveyDateRange' && field !== 'headroom' && field !== 'projection')) {
                        let temp = filter[tab][field].value.map((value) => {
                            return {
                                tab,
                                field,
                                value
                            }
                        })

                        tags = [...tags, ...temp];
                    } else if ((typeof filter[tab][field].value === 'string' && this.hasValue(filter[tab][field], field) || typeof filter[tab][field].value === 'boolean')) {
                        tags.push({
                            tab,
                            field,
                            value: filter[tab][field].value
                        })
                    } else if ((field === 'surveyDateRange' || field === 'headroom' || field === 'projection' ) && this.hasValue(filter[tab][field], field)) {
                        tags.push({
                            tab,
                            field,
                            value: `${filter[tab][field].value[0]} - ${filter[tab][field].value[1]}`
                        })
                    }
                })
            })

            return tags;
        },
        updateLoading() {
          this.isLoading = true;
        },
        resetFilter(){
          this.setDefaultFilter();
        }
    },
    computed: {
      selectedSignboardIds(){
        return this.selectedRows.map((signboard)=> signboard.signboardId);
      },
        computedHeaders() {
            let headerWithActionColumn = [...this.headers];

            headerWithActionColumn.push({
                text: "",
                value: "controls"
            });
            return headerWithActionColumn;
        },
        dataSource() {
            return this.$store.state.record.signboards;
        },
        sortBy: {
          get() {
            return this.$store.state.record.sort.columnId == "surveyDate" ? "surveyStartTime" : this.$store.state.record.sort.columnId;
          },
          set(newVal) {
            return newVal;
          }
        },
        sortOrder: {
          get() {
            return this.$store.state.record.sort.order === "desc" ? true : false;
          },
          set(newVal) {
            return newVal;
          }
        },
        filter() {
            return this.$store.state.record.filter;
        },
        display() {
            return this.$store.state.record.displayFields;
        },
        sort() {
            return this.$store.state.record.sort;
        },
        totalCount() {
            return this.$store.state.record.totalCount;
        },
        pageLength () {
            return Math.ceil(this.totalCount / 10);
        },
        filterPresets () {
            return this.$store.state.record.presets;
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
        },
        tableColumns() {
            return this.headers.filter(this.canShow);
        }
    },
    async mounted() {
        await this.getRecords();
        await this.getPresets();
        await this.getSurveysIds();
    },
    watch: {
        currentPage: {
            handler() {
                this.flip();
            }
        },
        items() {
          this.isLoading = false;
        },
        dataSource() {
          this.isLoading = false;
        }
    }
}
</script>