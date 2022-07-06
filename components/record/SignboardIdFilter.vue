<template>
    <div class="signboard-id">
        <div class="signboard-id__container">
            <div class="signboard-id__search-input-container">
            </div>
            <template v-if="selectedSubTab === 'signboardId'">
                <div class="text text--medium text--secondary-style space-below signboard-id__custom-text">Signboard ID</div>
                <v-radio-group v-model="choice" @change="resetPagination">
                    <div>
                        <v-text-field v-model="signboardIdExact[0]" v-on:keyup="onInputChange($event);" class="field" outlined dense append-icon="mdi-magnify" full-width label="Search Signboard ID">
                            <template v-slot:prepend>
                                <v-radio
                                    label="Signboard ID"
                                    value="exact"
                                    :ripple="false"
                                >
                                </v-radio>
                            </template>
                        </v-text-field>
                    </div>
                    <v-radio
                        label="Range of Signboard ID"
                        value="range"
                    >
                    </v-radio>
                    <div>
                        <v-text-field v-model="signboardIdRange[0]" v-on:keyup="debouncedInputChange" class="input_range" outlined dense append-icon="mdi-magnify" full-width label="Search Signboard ID"></v-text-field>
                        <span class="px-3">to</span>
                        <v-text-field v-model="signboardIdRange[1]" v-on:keyup="debouncedInputChange" class="input_range" outlined dense append-icon="mdi-magnify" full-width label="Search Signboard ID"></v-text-field>
                    </div>
                </v-radio-group>
                <v-col cols="12" class="pa-0 mb-2 signboard-id__chip-container">
                    <template v-for="item of signboardId">
                        <v-chip
                        class="ma-1 ml-0"
                        close
                        label
                        :key="item"
                        @click:close="removeSelectedValue({tab:'signboard', field: 'signboardId', item})"
                        >
                            <span class="text text--secondary-style">{{ item }}</span>
                        </v-chip>
                    </template>
                </v-col>
                <div class="signboard-id__search-result-area">
                    <template>
                        <div class="signboard-id__wrapper">
                            <template v-if="signboardIdExact[0]">
                                <div class="font-weight-medium">'{{ signboardIdExact[0] }}' search result ({{signboardIdList.length}})</div>
                                <div>
                                    <v-btn color="transparent" elevation="0" @click="selectAllSignboards"><span class="text text--secondary-style text--blue text--bold">Select All</span></v-btn>
                                    <v-btn color="transparent" elevation="0" @click="clearAllSignboards"><span class="text text--secondary-style text--blue text--bold">Clear All Selection</span></v-btn>
                                </div>
                            </template>
                            <template v-else-if="(signboardIdRange[0] || signboardIdRange[1])">
                                <div class="font-weight-medium">'{{ signboardIdRange[0] }} to {{ signboardIdRange[1] }}' search result ({{signboardIdList.length}})</div>
                                <div>
                                    <v-btn color="transparent" elevation="0"  @click="selectAllSignboards"><span class="text text--secondary-style text--blue text--bold">Select All</span></v-btn>
                                    <v-btn color="transparent" elevation="0" @click="clearAllSignboards"><span class="text text--secondary-style text--blue text--bold">Clear All Selection</span></v-btn>
                                </div>
                            </template>
                            
                        </div>
                    </template>
                    <div>
                        <v-progress-linear v-show="isLoading" color="primary" indeterminate></v-progress-linear>
                        <ul class="signboard-id__list-container px-0">
                            <li v-for="id in signboardIdListPagination" :key="id" class="signboard-id__list-item-container">
                                <v-checkbox v-model="signboardId" active-class="selected" :value="id"></v-checkbox>
                                {{ id }}
                            </li>
                            
                        </ul>

                    </div>
                    <div class="signboard-id__pagination-result">
                        <v-pagination
                            v-if="pagination.total >= pagination.itemPerPage"
                            v-model="pagination.page"
                            :length="Math.ceil(pagination.total / pagination.itemPerPage)"
                            :total-visible="5"
                        ></v-pagination>
                    </div>
                </div>
            </template>
            <template v-if="selectedSubTab === 'sampled'">
                <template v-for="item in sampledFilter">
                    <div :key="item.id">
                        <div class="title-container">
                            <div class="text text--medium text--secondary-style space-below signboard-id__custom-text">
                                {{item.name}}
                            </div>
                        </div>
                        <div class="signboard-id__tag-container" >
                            <v-chip-group v-model="item.value" active-class="selected">
                                <v-chip outlined label value="yes" key="yes" :ripple="false"><span class="text text--secondary-style">Yes</span></v-chip>
                                <v-chip outlined label value="no" key="no" :ripple="false"><span class="text text--secondary-style">No</span></v-chip>
                            </v-chip-group>
                        </div>
                    </div>
                </template>
            </template>
            <template v-if="selectedSubTab === 'fileRef'">
                <div class="text text--medium text--secondary-style space-below signboard-id__custom-text">BD File Reference</div>
                <v-radio-group v-model="bdFileRefRadioGroup" @change="resetPagination">
                    <v-text-field v-model="bdFileRefInput" class="field" outlined dense append-icon="mdi-magnify" full-width label="Specific or Range of Signboard ID" v-on:keyup="searchFileReference($event); isLoading = true;">
                        <template v-slot:prepend>
                            <v-radio
                                value="exact"
                            >
                            </v-radio>
                        </template>
                    </v-text-field>
                    <v-radio
                        value="blank"
                        label="Blank"
                    >
                    </v-radio>
                </v-radio-group>
                <v-col cols="12" class="pa-0 mb-2 signboard-id__chip-container">
                    <template v-for="item of fileRef">
                        <v-chip
                        class="ma-1 ml-0"
                        close
                        label
                        :key="item"
                        @click:close="removeSelectedValue({tab:'signboard', field: 'fileRef', item})"
                        >
                            <template v-if="item !== null">
                                <span class="text text--secondary-style">{{ item }}</span>
                            </template>
                            <template v-else>
                                <span class="text text--secondary-style">Blank File Reference</span>
                            </template>
                        </v-chip>
                    </template>
                </v-col>
                <div class="signboard-id__wrapper" v-if="bdFileRefRadioGroup !== 'blank' && bdFileRefInput !== ''">
                    <template>
                        <div class="font-weight-medium">'{{ bdFileRefInput }}' search result ({{fileRefList.length}})</div>
                        <div>
                            <v-btn color="transparent" elevation="0" @click="selectAllRefs"><span class="text text--secondary-style text--blue text--bold">Select All</span></v-btn>
                            <v-btn color="transparent" elevation="0" @click="clearSelectedRefs"><span class="text text--secondary-style text--blue text--bold">Clear All Selection</span></v-btn>
                        </div>
                    </template>
                </div>
                <div v-if="bdFileRefRadioGroup !== 'blank' && bdFileRefInput !== ''">
                    <v-progress-linear v-show="isLoading" color="primary" indeterminate></v-progress-linear>
                    <ul class="signboard-id__list-container px-0">
                        <li v-for="fileReference in fileRefListPagination" :key="fileReference" class="signboard-id__list-item-container">
                            <v-checkbox v-model="fileRef" active-class="selectedFileRefs"  :value="fileReference"></v-checkbox>
                            {{ fileReference }}
                        </li>
                    </ul>
                    <div class="signboard-id__pagination-result">
                        <v-pagination
                            v-if="pagination.total >= pagination.itemPerPage"
                            v-model="pagination.page"
                            :length="Math.ceil(pagination.total / pagination.itemPerPage)"
                            :total-visible="5"
                        ></v-pagination>
                    </div>
                </div>
            </template>
            <template v-if="selectedSubTab === 'headroom'">
                <div class="title-container">
                    <div class="text text--medium text--secondary-style space-below signboard-id__custom-text">
                        Headroom (m)
                    </div>
                </div>
                <!-- <v-range-slider
                    dense
                    :min="minHeadroom"
                    :max="maxHeadroom"
                    ticks="always"
                    step="0.1"
                    v-model="headroom"
                    thumb-label="always"
                    class="signboard-id__slider"
                >
                </v-range-slider> -->
                <div class="signboard-id__field-container">
                    <div>
                        <div class="text text--medium space-below">Minimum Height</div>
                        <v-text-field class="number-field" outlined append-icon="m" dense :value="minHeadroom" @input="updateMinHeadroom"></v-text-field>
                    </div>
                    <div>
                        <div class="text text--medium space-below">Maximum Height</div>
                        <v-text-field class="number-field" outlined append-icon="m" dense :value="maxHeadroom" @input="updateMaxHeadroom" ></v-text-field>
                    </div>
                </div>
            </template>
            <template v-if="selectedSubTab === 'projection'">
                <div class="title-container">
                    <div class="text text--medium text--secondary-style space-below signboard-id__custom-text">
                        Projection (m)
                    </div>
                </div>
                <!-- <v-range-slider
                    dense
                    :min="minProjection"
                    :max="maxProjection"
                    ticks="always"
                    step="0.1"
                    v-model="projection"
                    thumb-label="always"
                    class="signboard-id__slider"
                >
                </v-range-slider> -->
                <div class="signboard-id__field-container">
                    <div>
                        <div class="text text--medium space-below">Minimum Length</div>
                        <v-text-field class="number-field" outlined append-icon="m" dense :value="minProjection" @input="updateMinProjection"></v-text-field>
                    </div>
                    <div>
                        <div class="text text--medium space-below">Maximum Length</div>
                        <v-text-field class="number-field" outlined append-icon="m" dense :value="maxProjection" @input="updateMaxProjection"></v-text-field>
                    </div>
                </div>
            </template>
            <template v-if="selectedSubTab === 'signboardType'">
                <div class="title-container">
                    <div class="text text--medium text--secondary-style space-below signboard-id__custom-text">
                        Type
                    </div>
                </div>
                <div class="signboard-id__tag-container" >
                    <v-chip-group v-model="signboardType" active-class="selected">
                        <v-chip outlined label value="defective" key="defective" :ripple="false"><span class="text text--secondary-style">Defective</span></v-chip>
                        <v-chip outlined label value="normal" key="normal" :ripple="false"><span class="text text--secondary-style">Normal</span></v-chip>
                    </v-chip-group>
                </div>
            </template>
            <template v-if="selectedSubTab === 'defectTypes'">
                <div class="title-container">
                    <div class="text text--medium text--secondary-style space-below signboard-id__custom-text">Type of Defects</div>
                </div>
                <div class="signboard-id__tag-container">
                    <v-chip-group multiple active-class="selected" v-model="defectTypes" column>
                        <v-chip v-for="type of defectTypeOptions" class="signboard-id__chip" outlined label :ripple="false" :value="type.id" :key="type.id" >
                            <span class="text text--secondary-style">{{ type.title }}</span>
                        </v-chip>
                    </v-chip-group>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import {mapFields} from 'vuex-map-fields';
    import {mapActions, mapMutations} from 'vuex';
    import _debounce from 'lodash/debounce';
    import clientSidePaginationMixin from "../../mixins/client-side-pagination.js";

    export default {
        mixins: [clientSidePaginationMixin],
        props: ["selectedSubTab"],
        data() {
            return {
                selected: [],
                signboardIdExact: [],
                signboardIdRange: [],
                choice: "exact",
                bdFileRefRadioGroup: "",
                bdFileRefSearch: "",
                headroomLabels: [
                    "0m",
                    "2m",
                    "4m",
                    "6m",
                    "8m"
                ],
                projectionLabels: [
                    "0m",
                    "2m",
                    "4m",
                    "6m",
                    "8m"
                ],
                defectTypeOptions: [
                    {
                        id: "notDefective", title: "(N) Not Defective"
                    },
                    {
                        id: "damagedDisplay", title: "(a) Broken or missing display surface inside structural frames"
                    },
                    {
                        id: "missingDisplay", title: "(b) No display surface with only structural support attached to other building structure"
                    },
                    {
                        id: "derelict", title: "(c) Showing obsolete, dilapidated or derelict condition"
                    },
                    {
                        id: "rust",
                        title: "(d) Substantial corrosion with obvious signs such as rusty water marks"
                    },
                    {
                        id: "deformedStructure",
                        title: "(e) Evident structural distortion, deformation, sagging, rupture, loosening and detachment of any of its components"
                    }
                ],
                selectedFileRefs: [],
                bdFileRefInput: "",
                isLoading: false,
                blankVal: [null],
                sampledFilter: [
                    { id: "sampled", name: "Sampled", value: ""},
                    { id: "verified", name: "Verified", value: ""},
                    { id: "deleted", name: "Deleted", value: ""}
                ]
            }
        },
        computed: {
            ...mapFields({
                signboardId: 'record.filter.signboard.signboardId.value',
                projection: 'record.filter.signboard.projection.value',
                signboardType: 'record.filter.signboard.signboardType.value',
                fileRef: 'record.filter.signboard.fileRef.value',
                defectTypes: 'record.filter.signboard.defectTypes.value',
                sampled: 'record.filter.signboard.sampled.value',
                verified: 'record.filter.signboard.verified.value',
                deleted: 'record.filter.modification.signboardIdentificationRevised.value'
            }),
            signboardIdList () {
                return this.$store.state.record.signboardIdList;
            },
            fileRefList() {
                return this.$store.state.record.fileRefList;
            },
            minHeadroom: {
                get() {
                    return this.$store.state.record.filter.signboard.headroom.value[0]
                },
                set(val) {
                    this.updateMinHeadroom(val);
                }
            },
            maxHeadroom: {
                get() {
                    return this.$store.state.record.filter.signboard.headroom.value[1]
                },
                set(val) {
                    this.updateMaxHeadroom(val);
                }
            },
            minProjection: {
                get() {
                    return this.$store.state.record.filter.signboard.projection.value[0]
                },
                set(val) {
                    this.updateMinProjection(val);
                }
            },
            maxProjection: {
                get() {
                    return this.$store.state.record.filter.signboard.projection.value[1]
                },
                set(val) {
                    this.updateMaxProjection(val);
                }
            },
            signboardIdListPagination() {
                return this.signboardIdList.filter((id, index) => index >= this.start && index <= this.end);
            },
            fileRefListPagination() {
                return this.fileRefList.filter((id, index) => index >= this.start && index <= this.end);
            }
        },
        methods: {
            ...mapActions({
                searchSignboardId: "record/searchSignboardId",
                searchFileReference: "record/searchFileReference",
                filterRecords: "record/filterRecords",
            }),
            ...mapMutations({
                setSelectedSignboardIds: "record/setSelectedSignboardIds",
                setSelectedFileRefs: "record/setSelectedFileRefs",
                updateMinHeadroom: "record/updateMinHeadroom",
                updateMaxHeadroom: "record/updateMaxHeadroom",
                updateMinProjection: "record/updateMinProjection",
                updateMaxProjection: "record/updateMaxProjection",
                removeValue: "record/removeValue",
                removeSelectedValue: "record/removeSelectedValue"
            }),
            debouncedInputChange() {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                
                this.timeout = setTimeout(() => {
                    this.onInputChange();
                }, 200); // delay
            },
            onInputChange(e) {
                this.isLoading = true;
                if(this.choice === "range") {
                    this.searchSignboardId({searchString: this.signboardIdRange });
                } else if (this.choice === "exact") {
                    this.searchSignboardId({searchString: this.signboardIdExact });
                }
            },
            selectAllSignboards() {
                this.selected = this.signboardIdList;
            },
            clearAllSignboards() {
                this.selected = [];
            },
            selectAllRefs() {
                this.selectedFileRefs = this.fileRefList;
            },
            clearSelectedRefs() {
                this.selectedFileRefs = [];
            }
        },
        
        watch: {
            selected (val) {
                this.setSelectedSignboardIds(val);
            },
            selectedFileRefs (val) {
                this.setSelectedFileRefs(val);
            },
            choice (val) {
                if (val === 'exact') {
                    this.signboardIdRange = []
                }
                else if (val === 'range') {
                    this.signboardIdExact = [];
                }
                this.debouncedInputChange();
            },
            bdFileRefRadioGroup (val) {
                if(val === 'blank') {
                    this.removeValue({valueToRemove: "", tab: 'signboard', field: 'fileRef', valueType: 'string'});
                    this.setSelectedFileRefs(this.blankVal);
                }
            },
            signboardIdList(){
                this.resultsWatcher(this.signboardIdList);
            },
            fileRefList(){
                this.resultsWatcher(this.fileRefList);
            },
            selectedSubTab(){
                (this.selectedSubTab === 'signboardId') ? this.tabWatcher(this.signboardIdList) : this.tabWatcher(this.fileRefList);
            },
            sampledFilter: {
                deep: true,
                handler(object) {
                    this.sampled = this.sampledFilter[0].value;
                    this.verified = this.sampledFilter[1].value;
                    this.deleted = (this.sampledFilter[2].value === 'yes') ? "deleted" : "";
                    this.filterRecords({filter: this.$store.state.record.filter, sort: this.$store.state.record.sort, ignoreProcessing: false, applyFilter: false});
                }
            },
            mounted() {
                this.sampledFilter[0].value = this.sampled;
                this.sampledFilter[1].value = this.verified;
                this.sampledFilter[2].value = (this.deleted === "deleted") ? "" : "no";
            }
        }
    }
</script>