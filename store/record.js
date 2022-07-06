import { filter, getRecords, searchSignboard, saveRecordSetting, exportImages, queryLocation, exportList, paginate, searchAddress, searchFileRef, getPresets, deletePreset, updatePreset, getSurveys, queryAreaCode, searchPeople, searchDsrnNo, signOwnerSearch } from "../requests/record";
import _difference from "lodash/difference";
import { DEFAULT_DISPLAY_FIELDS, FILTER_MAPPING, DEFAULT_FILTER } from "../constants";
import moment from 'moment';
import { processArray, refreshWrapper } from "../components/utils/utils";

export const state = () => ({
    signboards: [],
    selectedSubTab: "surveyId",
    selectedTab: "survey",
    filter: DEFAULT_FILTER,
    sort: {columnId: "", order: ""},
    displayFields: DEFAULT_DISPLAY_FIELDS,
    checkbox: ["signboardId", "surveyId", "surveyDate", "areaCode", "englishAddress", "fileRef", "signboardType", "streetNo", "tripId", "dsrnNo"],
    hiddenFieldCheckbox: [],
    signboardIdList: [],
    addressList: [],
    areaCodeList: [],
    fileRefList: [],
    streetAddrQuery: [],
    buildingNameQuery: [],
    totalCount: 0,
    totalCountTemp: 0,
    filterResults: 0,
    presets: [],
    panel: 0,
    defaultSubTab: "",
    surveyIds: [],
    peopleInChargeList: [],
    dsrnNoList: [],
    dsrnNoSearchVal: '',
    signOwnerAddressList: [],
    signOwnerSearchVal: '',
    signboards: [],
    selectedSubTab: "surveyId",
    selectedTab: "survey",
    filter: DEFAULT_FILTER,
    sort: { columnId: "", order: "" },
    displayFields: DEFAULT_DISPLAY_FIELDS,
    checkbox: [
           "signboardId",
           "surveyId",
           "surveyDate",
           "areaCode",
           "englishAddress",
           "fileRef",
           "signboardType",
           "streetNo",
           "tripId",
           "dsrnNo"
    ],
    hiddenFieldCheckbox: [],
    signboardIdList: [],
    addressList: [],
    areaCodeList: [],
    fileRefList: [],
    streetAddrQuery: [],
    buildingNameQuery: [],
    totalCount: 0,
    filterResults: 0,
    presets: [],
    panel: 0,
    defaultSubTab: "",
    surveyIds: [],
    peopleInCharge: [
        {
            id: 0,
            name: "seniorPro",
            value: "",
            list: [],
            pagination: [],
            selected: []
        },
        {
            id: 1,
            name: "caseOfficer",
            value: "",
            list: [],
            pagination: [],
            selected: []
        },
        {
            id: 2,
            name: "caseAssistant",
            value: "",
            list: [],
            pagination: [],
            selected: []
        }
    ],
    dsrnNoList: [],
    dsrnNoSearchVal: "",
    signOwnerAddressList: [],
    signOwnerSearchVal: ""
});

export const actions = {
    async getRecords({ commit }) {
        const wrappedGetRecords = await refreshWrapper(getRecords);
        // const response = await getRecords(window.localStorage.getItem("accessToken"));
        const response = await wrappedGetRecords({ accessToken: window.localStorage.getItem("accessToken") });

        commit("setRecords", { signboards: response.data.signboards })
        commit("setTotalCount", { totalCount: response.data.totalCount })
    },
    async filterRecords({ commit }, payload) {
        let { ignoreProcessing, applyFilter } = payload;
        const wrappedFilter = await refreshWrapper(filter);
        const response = await wrappedFilter({ payload, accessToken: window.localStorage.getItem("accessToken"), ignoreProcessing });
        if(applyFilter) {
            commit("setRecords", {
              signboards: response.data.signboards
            });
            commit("setTotalCount", {
              totalCount: response.data.totalCount
            });
        } else {
            commit("setTotalCountTemp", {
              totalCount: response.data.totalCount
            });
        }
        
    },
    async searchSignboardId({ commit }, { searchString }) {
        const wrappedSearchSignboard = await refreshWrapper(searchSignboard);
        const response = await wrappedSearchSignboard({ searchString, accessToken: window.localStorage.getItem("accessToken") });

        commit("setSignboardIds", { idList: response.data });
    },
    async saveSettings({ commit }, settings) {
        const wrappedSaveRecordSetting = await refreshWrapper(saveRecordSetting);
        const response = await wrappedSaveRecordSetting(settings);

        commit("setPresets", response.data);
    },
    async updateFilterPreset({ commit }, settings) {
        const wrappedUpdateRecordSetting = await refreshWrapper(updatePreset);
        const response = await wrappedUpdateRecordSetting(settings);

        commit("setPresets", response.data);
    },
    async exportImages({ commit }, signboardIds) {
        const response = await exportImages(signboardIds, window.localStorage.getItem("accessToken"));
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'file.zip');
        document.body.appendChild(fileLink);

        fileLink.click();
    },
    async getLocation({ commit }, { searchString, field }) {
        const response = await queryLocation(window.localStorage.getItem("accessToken"), field, searchString);

        commit('setLocationQueries', { field, query: response.data });
    },
    async exportSignboardRecords({ commit }, payload) {
        const response = await exportList(window.localStorage.getItem('accessToken'), payload);

        var csvString = response.data;
        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + encodeURIComponent(csvString);
        a.target = '_blank';
        a.download = `${moment().format("MM/DD/YYYY")}.csv`;

        document.body.appendChild(a);
        a.click();
    },
    async flipPage({ commit }, payload) {
        const { page, filter } = payload;
        const wrappedPaginate = await refreshWrapper(paginate);
        const response = await wrappedPaginate({ accessToken: window.localStorage.getItem("accessToken"), page, filter });

        commit("setRecords", { signboards: response.data.signboards })
        commit("setTotalCount", { totalCount: response.data.totalCount })
    },
    async searchStreetAddress({ commit }, payload) {

        const response = await searchAddress(window.localStorage.getItem("accessToken"), payload.target.value);

        commit("setAddressList", response.data);
    },
    async searchFileReference({ commit }, payload) {
        const response = await searchFileRef(window.localStorage.getItem("accessToken"), payload.target.value);

        commit("setFileRefList", response.data);
    },
    async getPresets({ commit }, _) {
        const wrappedGetPresets = await refreshWrapper(getPresets);
        const response = await wrappedGetPresets({ accessToken: window.localStorage.getItem("accessToken"), userId: window.localStorage.getItem("userId") });

        commit("setPresets", response.data);
    },
    async deleteFilterPreset({ commit }, payload) {

        const response = await deletePreset(window.localStorage.getItem("accessToken"), payload, window.localStorage.getItem("userId"));

        commit("setPresets", response.data);
    },
    async getSurveysIds({ commit }, _) {
        const wrappedGetSurveys = await refreshWrapper(getSurveys);
        const response = await wrappedGetSurveys({ accessToken: window.localStorage.getItem("accessToken") });

        commit("setSurveyIds", response.data);
    },
    async queryAreaCode({ commit }, { searchString }) {
        const response = await queryAreaCode(window.localStorage.getItem("accessToken"), searchString);

        commit("setAreaCodeList", response.data);
    },
    async searchPeople({ commit }, { searchString, searchType }) {
        const wrappedSearchPeople = await refreshWrapper(searchPeople);
        const response = await wrappedSearchPeople({ accessToken: window.localStorage.getItem('accessToken'), searchString, searchType });
        if (searchType === "seniorPro") {
            commit("setSeniorProList", response.data);
        } else if (searchType === "caseOfficer") {
            commit("setCaseOfficerList", response.data); 
        } else {
            commit("setCaseAassistantList", response.data);
        }
    },
    async searchDsrnNo({ commit }, { searchString }) {
        const wrappedSearchDsrnNo = await refreshWrapper(searchDsrnNo);
        const response = await wrappedSearchDsrnNo({ accessToken: window.localStorage.getItem('accessToken'), searchString });

        commit ('setDsrnNoList', response.data)
    },
    async signOwnerSearch({ commit }, { searchString }) {
        const wrappedSearchSignOwnerAddress = await refreshWrapper(signOwnerSearch);
        const response = await wrappedSearchSignOwnerAddress({ accessToken: window.localStorage.getItem('accessToken'), searchString });

        commit('setSignOwnerList', response.data)
    }
}

export const mutations = {
    setRecords(state, {signboards}) {
        state.signboards = [...signboards];
    },
    updateCheckbox(state, {categoryId, subCategoryId}) {
        state.filter[categoryId][subCategoryId].isChecked = !state.filter[categoryId][subCategoryId].isChecked;
    },
    setSignboardIds(state, {idList}) {
        state.signboardIdList = idList;
    },
    setSelectedSignboardIds(state, payload) {
        state.filter.signboard.signboardId.value = payload;
    },
    setSortSetting(state, sortObj ) {
        state.sort = {...sortObj };
    },
    setOrder(state, fields) {
        state.displayFields = [...fields];
    },
    setTotalCount(state, { totalCount }) {
        state.totalCount = totalCount;
    },
    setTotalCountTemp(state, { totalCount }) {
        state.totalCountTemp = totalCount;
    },
    setLocationQueries(state, {field, query}) {
        state[`${field}Query`] = [...query];
    },
    setQuery(state, payload) {
        state.filter.location.streetAddr = {...state.filter.location.streetAddr, value: payload};
        state.streetAddrQuery = [];
    },
    setAddressList(state, payload) {
        state.addressList = payload;
    },
    setStreetAddressFilter(state, payload) {
        state.filter.location.englishAddress.value = payload;
    },
    setFileRefList(state, payload) {
        state.fileRefList = payload;
    },
    setSelectedFileRefs(state, payload) {
        state.filter.signboard.fileRef.value = payload;
    },
    setPresets(state, { savedFilters }) {
        state.presets = savedFilters;
    },
    async setFilter(state, { preset }) {
        let { filter, display, sort } = preset;
        let filterProcess = {};
        if ((filter.hasOwnProperty("revisionStatus")) && (filter.hasOwnProperty("dsrnHandling"))) {
            filterProcess = { ...filter, ...filter.revisionStatus, ...filter.dsrnHandling };
            delete filterProcess.revisionStatus;
            delete filterProcess.dsrnHandling;
        }
        else if (filter.hasOwnProperty("revisionStatus")) {
            filterProcess = { ...filter, ...filter.revisionStatus };
            delete filterProcess.revisionStatus;
        }
        else if (filter.hasOwnProperty("dsrnHandling")) {
            filterProcess = { ...filter, ...filter.dsrnHandling };
            delete filterProcess.dsrnHandling;
        }
        else {
            filterProcess = filter;
        }

        let filterKeys = Object.keys(filterProcess);

        for( let i = 0; i < filterKeys.length; i++ ) {
            state.filter[FILTER_MAPPING[filterKeys[i]]][filterKeys[i]].value = filterProcess[filterKeys[i]];
        }

        state.displayFields = DEFAULT_DISPLAY_FIELDS.filter((field) => display.includes(field.id));

        state.checkbox = display;
        let defaultFields = ["signboardId", "surveyId", "surveyDate", "areaCode", "englishAddress", "fileRef", "signboardType"];

        state.hiddenFieldCheckbox = _difference(defaultFields, display);
        state.sort.columnId = Object.keys(sort)[0];
        state.sort.order = sort[state.sort.columnId] === 1 ? "asc" : "desc";
    },
    filterDisplayFields(state,  fieldId ) {
        const temp = state.displayFields.filter((elem) => {
            return fieldId !== elem.id;
        })
        state.displayFields = [...temp];
    },
    addToDisplayFields(state, payload) {
        state.displayFields.push(payload);
    },
    updateDisplayFields(state, payload) {
        state.displayFields = payload;
    },
    updateCheckbox(state, payload) {
        state.checkbox = payload;
    },
    updateHiddenFieldCheckbox(state, payload) {
        state.hiddenFieldCheckbox = payload;
    },
    emptyFilterField(state, payload) {
        state.filter[FILTER_MAPPING[payload]][payload].value = DEFAULT_FILTER[filter_mapping[payload]][payload].value;
    },
    updatePanelValue(state, payload) {
        state.panel = payload;
    },
    updateDefaultSubTab(state, payload) {
        state.defaultSubTab = payload;
    },
    removeValue(state, payload) {
        let { valueToRemove, tab, field, valueType  } = payload;
        if(valueType === 'object' && (field !== 'surveyDateRange' && field !== 'headroom' && field !== 'projection' && field !== 'sampled')) {
            let foundIndex = state.filter[tab][field].value.findIndex((val) => val === valueToRemove);

            state.filter[tab][field].value.splice(foundIndex, 1);
        } else {
            state.filter[tab][field].value = DEFAULT_FILTER[tab][field].value
        }
    },
    setDefaultFilter(state, _) {
        Object.keys(DEFAULT_FILTER).forEach(tab => {
            Object.keys(DEFAULT_FILTER[tab]).forEach(field => {
                Object.keys(DEFAULT_FILTER[tab][field]).forEach(attribute => {
                    state.filter[tab][field][attribute] = DEFAULT_FILTER[tab][field][attribute];
                });
            });
        });
    },
    setSurveyIds(state, payload) {
        state.surveyIds = payload.map((survey) => survey.surveyId);
    },
    updateMinHeadroom(state, payload) {
        let temp = processArray(state.filter.signboard.headroom.value, payload, 0);
        state.filter.signboard.headroom.value = [...temp];
    },
    updateMaxHeadroom(state, payload) {
        let temp = processArray(state.filter.signboard.headroom.value, payload, 1);
        state.filter.signboard.headroom.value = [...temp];
    },
    updateMinProjection(state, payload) {
        let temp = processArray(state.filter.signboard.projection.value, payload, 0);
        state.filter.signboard.projection.value = [...temp];
    },
    updateMaxProjection(state, payload) {
        let temp = processArray(state.filter.signboard.projection.value, payload, 1);
        state.filter.signboard.projection.value = [...temp];
    },
    setAreaCodeList(state, payload) {
        state.areaCodeList = payload;
    },
    setSelectedAreaCodesFilter(state, payload) {
        state.filter.location.areaCode.value = payload;
    },
    clearDateRangeText(state, _) {
        state.filter.survey.surveyDateRange.value = [];
    },
    setSeniorProList(state, payload) {
        state.peopleInCharge[0].list = payload;
    },
    setCaseOfficerList(state, payload) {
        state.peopleInCharge[1].list = payload;
    },
    setCaseAassistantList(state, payload) {
        state.peopleInCharge[2].list = payload;
    },
    setSelectedSpo(state, payload) {
        state.filter.peopleInCharge.spos.value = [...payload];
    },
    removeSelectedValue(state, { tab, field, item }) {
        let curr = state.filter[tab][field].value;
        state.filter[tab][field].value = curr.filter(el => el !== item);
    },
    setDsrnNoSearch(state, payload) {
        state.dsrnNoSearchVal = payload;
    },
    setDsrnNoList(state, payload) {
        state.dsrnNoList = payload;
    },
    setSignOwnerList(state, payload) {
        state.signOwnerAddressList = payload;
    }
}