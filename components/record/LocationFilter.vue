<template>
    <div class="location">
        <div class="location__container">
            <template v-if="selectedSubTab === 'areaCode'">
                <div class="title-container">
                    <div class="text text--medium text--secondary-style space-below location__custom-text">Area Code</div>
                </div>
                <div class="signboard-id__search-input-container">
                    <v-text-field outlined dense append-icon="mdi-magnify" v-on:keyup="onInputChange($event); isLoading = true" full-width label="Area Code" v-model="areaCodeInput"></v-text-field>
                </div>
                <v-col cols="12" class="pa-0 mb-2 signboard-id__chip-container">
                    <template v-for="item of areaCode">
                        <v-chip
                        class="ma-1 ml-0"
                        close
                        label
                        :key="item"
                        @click:close="removeSelectedValue({tab:'location', field: 'areaCode', item})"
                        >
                        <span class="text text--secondary-style">{{ item }}</span>
                        </v-chip>
                    </template>
                </v-col>
                <div class="location__search-result-area">
                    <div class="signboard-id__wrapper">
                        <template v-if="areaCodeInput !==''">
                            <div class="font-weight-medium">'{{ areaCodeInput }}' search result ({{areaCodeList.length}})</div>
                            <div>
                                <v-btn color="transparent" elevation="0" @click="selectAllAreaCodes"><span class="text text--secondary-style text--blue text--bold">Select All</span></v-btn>
                                <v-btn color="transparent" elevation="0" @click="clearAreaCodes"><span class="text text--secondary-style text--blue text--bold">Clear All Selection</span></v-btn>
                            </div>
                        </template>
                    </div>
                    <div>
                        <ul class="signboard-id__list-container px-0" v-if="areaCodeInput !==''">
                            <v-progress-linear v-show="isLoading" color="primary" indeterminate></v-progress-linear>
                            <li v-for="areaCodeElem of areaCodeListPagination" :key="areaCodeElem" class="signboard-id__list-item-container">
                                <v-checkbox v-model="areaCode" active-class="selectedAreaCodes"  :value="areaCodeElem"></v-checkbox>
                                {{ areaCodeElem }}
                            </li>
                        </ul>
                        <v-pagination
                            v-if="pagination.total >= pagination.itemPerPage"
                            v-model="pagination.page"
                            :length="Math.ceil(pagination.total / pagination.itemPerPage)"
                            :total-visible="5"
                        ></v-pagination>
                    </div>
                </div>
            </template>
            <template v-if="selectedSubTab === 'englishAddress'">
                <div class="title-container">
                    <div class="text text--medium text--secondary-style space-below location__custom-text">Street Name and Building Name</div>
                </div>
                <div class="signboard-id__search-input-container">
                    <v-text-field v-model="streetAddrInput" outlined dense label="Street name and No" v-on:keyup="searchStreetAddress($event); isLoading = true;"></v-text-field>
                </div>
                <v-col cols="12" class="pa-0 mb-2 signboard-id__chip-container">
                    <template v-for="item of streetAddr">
                        <v-chip
                        class="ma-1 ml-0"
                        close
                        label
                        :key="item"
                        @click:close="removeSelectedValue({tab:'location', field: 'englishAddress', item})"
                        >
                        <span class="text text--secondary-style">{{ item }}</span>
                        </v-chip>
                    </template>
                </v-col>
                <div class="location__search-result-area">
                    <div class="signboard-id__wrapper">
                        <template v-if="streetAddrInput !== ''">
                            <div class="font-weight-medium">'{{ streetAddrInput }}' search result ({{addressList.length}})</div>
                            <div>
                                <v-btn color="transparent" elevation="0" @click="selectAllAddress"><span class="text text--secondary-style text--blue text--bold">Select All</span></v-btn>
                                <v-btn color="transparent" elevation="0" @click="clearSelectedAddress"><span class="text text--secondary-style text--blue text--bold">Clear All Selection</span></v-btn>
                            </div>
                        </template>
                    </div>
                    <div>
                        <ul class="signboard-id__list-container px-0">
                            <v-progress-linear v-show="isLoading" color="primary" indeterminate></v-progress-linear>
                            <li v-for="address in addressListPagination" :key="address" class="signboard-id__list-item-container">
                                <v-checkbox v-model="streetAddr" active-class="selectedStreetAddresses"  :value="address"></v-checkbox>
                                {{ address }}
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
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import {mapFields} from 'vuex-map-fields';
    import { mapActions, mapMutations } from 'vuex';
    import clientSidePaginationMixin from "../../mixins/client-side-pagination.js";

    export default {
        mixins: [clientSidePaginationMixin],
        props: ['selectedSubTab'],
        data () {
            return {
                selectedStreet: [],
                selectedStreetAddresses: [],
                selectedAreaCodes: [],
                areaCodeInput: "",
                streetAddrInput: "",
                isLoading: false
            };
        },
        computed: {
            ...mapFields({
                streetAddr: 'record.filter.location.englishAddress.value',
                areaCode: 'record.filter.location.areaCode.value',
                fileRef: 'record.filter.location.fileRef.value',
            }),
            streetAddrQuery () {
                return this.$store.state.record.streetAddrQuery;
            },
            buildingNameQuery () {
                return this.$store.state.record.buildingNameQuery;
            },
            areaCodeList () {
                return this.$store.state.record.areaCodeList;
            },
            addressList() {
                return this.$store.state.record.addressList;
            },
            addressListPagination() {
                const start = (this.pagination.page * this.pagination.itemPerPage) - (this.pagination.itemPerPage);
                const end = start + this.pagination.itemPerPage - 1;
                return this.addressList.filter((address, index) => index >= start && index <= end);
            },
            areaCodeListPagination() {
                const start = (this.pagination.page * this.pagination.itemPerPage) - (this.pagination.itemPerPage);
                const end = start + this.pagination.itemPerPage - 1;
                return this.areaCodeList.filter((areaCodeElem, index) => index >= start && index <= end);
            }
        },
        methods: {
            ...mapActions({
                getLocation: "record/getLocation",
                searchStreetAddress: "record/searchStreetAddress",
                queryAreaCode: "record/queryAreaCode"
            }),
            ...mapMutations({
                setQuery: "record/setQuery",
                setStreetAddressFilter: "record/setStreetAddressFilter",
                setSelectedAreaCodesFilter: "record/setSelectedAreaCodesFilter",
                removeSelectedValue: "record/removeSelectedValue"
            }),
            getStreetAddrLocation (e) {
                this.getLocation({field: 'englishAddress', searchString: e.target.value})
            },
            getBuildingLocation (e) {
                this.getLocation({field: 'buildingName', searchString: e.target.value})
            },
            selectAllAddress () {
                this.selectedStreetAddresses = this.addressList;
            },
            clearSelectedAddress() {
                this.selectedStreetAddresses = [];
            },
            selectAllAreaCodes() {
                this.selectedAreaCodes = this.areaCodeList;
            },
            clearAreaCodes () {
                this.selectedAreaCodes = [];
            },
            onInputChange(e) {
                this.queryAreaCode({ searchString: this.areaCodeInput });
            }
        },
        watch: {
            selectedStreetAddresses (val) {
                this.setStreetAddressFilter(val);
            },
            selectedAreaCodes (val) {
                this.setSelectedAreaCodesFilter(val);
            },
            addressList() {
                this.resultsWatcher(this.addressList);
            },
            areaCodeList() {
                this.resultsWatcher(this.areaCodeList);
            },
            selectedSubTab(){
                (this.selectedSubTab === 'englishAddress') ? this.tabWatcher(this.addressList) : this.tabWatcher(this.areaCodeList);
            }
        }
    }
</script>