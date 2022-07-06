import {
  getBuildings,
  getSignboardImage,
  searchSignboards,
  updateBuilding,
  getSignboardInfo,
  updateVerifyStatus,
  getBuilding,
  createBuilding,
  deleteSignboard,
  createSignboard,
  getSurveyTrips,
  evaluateAnnotations,
  getSignboardsPendingStatus,
  getSignboardsPendingItems,
  updateDSRNHandling,
  saveDSRNForm
} from "../requests/signboard";
import { searchSignboard, searchFileRef } from '../requests/record';
import { refreshWrapper, retryAndSetStorage } from "../components/utils/utils.js";
import { refreshAccessToken } from "../requests/user";
import { updateSignboard } from '../requests/annotation';
import { searchTrips } from '../requests/trips';
import _findIndex from 'lodash/findIndex';
import _cloneDeep from 'lodash/cloneDeep';
import { DEFAULT_SEARCH_VALUES } from '../constants.js';

export const state = () => ({
  selectedSignboard: {
    location: [],
    id: "0",
    images: [],
    buildingDetails: {}
  },
  signboardList: [
    {
      location: [22.302711, 114.177216],
      id: "BO00015",
      image: {
        src:
          "https://hongkongfp.com/wp-content/uploads/2018/11/neon-sign-one-Copy.jpg",
        title: "IMG FOR BO00015"
      }
    },
    {
      location: [22.302711, 114.177216],
      id: "BO00016",
      image: {
        src:
          "https://hongkongfp.com/wp-content/uploads/2018/11/neon-sign-two-Copy.jpg",
        title: "IMG FOR BO00016"
      }
    }
  ],
  tripList: [],
  markers: [],
  showResultPanel: false,
  nearestBuildings: [],
  currentBuildingLocation: {
    englishAddress: "",
    structId: ""
  },
  imageAnnotation: {
    imgSrc: "",
    imgId: "",
    fromSignboardDetail: false,
    isDefectTool: false,
    signboardAnnotationList: [],
    carAngle: 0,
    cameraLocation: []
  },
  signboardIdList: [],
  fileRefList: [],
  filteringId: [],
  filteringFileRef: "",
  showSignboardDetail: false,
  initialCenter: [ 22.3193, 114.1694 ],
  pendingItems: {},
  pendingStatusList: {},
  initialCenter: [22.3193, 114.1694],
  selectedDefectObjectId: '',
  defectList: [],
  imageURL: '',
  filterByTrip: {},
  dsrnAnnotation: ''
});

export const mutations = {
  setSelectedSignboard(state, signboard) {
    state.selectedSignboard = { ...state.selectedSignboard, ...signboard };
  },
  setResultPanel(state, bool) {
    state.showResultPanel = bool;
  },
  setChosenSignboardToEmpty(state) {
    state.selectedSignboard = {
      location: [],
      id: "0",
      image: "",
      images: []
    };
  },
  setMarkers(state, signboards) {
    state.markers = [...signboards];
  },
  setImagetoSignboard(state, payload) {
    const { images } = payload;
    state.selectedSignboard.images = [...images];
  },
  setSignboardList(state, group) {
    state.signboardList = group.map((group) => ({...group, id: group._id}));
  },
  setNearestBuildings(state, {buildings}) {
    state.nearestBuildings = buildings;
  },
  updateMarkerStructureId(state, payload) {
    const {marker} = payload;

    let signboard = { ...state.selectedSignboard, ...marker };
    let markers = state.markers;
    state.selectedSignboard = { ...signboard };
    for(let x = 0 ; x < state.markers.length ; x++) {
      for(let y = 0; y < state.markers[x].signboardGroup.length; y++) {
        if(state.markers[x].signboardGroup[y].signboardId === marker.signboardId) {
          markers[x].signboardGroup[y] = { ...state.markers[x].signboardGroup[y] , structureId: marker.structId, structId: marker.structId };
          state.markers = [...markers];
          state.signboardList = markers[x].signboardGroup;
          break;
        }
      }
    }
  },
  updateSignboardLocation(state, marker) {
    state.selectedSignboard.location.coordinates = marker.location;

    for(let x = 0 ; x < state.markers.length ; x++) {
      for(let y =0; y < state.markers[x].signboardGroup.length; y ++) {
        if(state.markers[x].signboardGroup[y]._id === marker._id) {
          state.markers[x].signboardGroup[y].location.coordinates = marker.location;
        }
      }
    }
  },
  updateStructureId(state, { structureId }) {
    state.selectedSignboard = {...state.selectedSignboard, structureId }
  },
  setTripList(state, tripList) {
    state.tripList = tripList;
  },
  setVerifyStatus(state, {signboardId, verified}) {
    state.selectedSignboard = { ...state.selectedSignboard, ...(verified ? { verified: false } : { verified: true }) };
    for(let i = 0; i < state.markers.length; i++) {
      for (let j = 0; j < state.markers[i].signboardGroup.length; j++) {
        if(state.markers[i].signboardGroup[j].signboardId === signboardId) {
          state.markers[i].signboardGroup[j] = { ...state.markers[i].signboardGroup[j], ...(verified ? { verified: false } : { verified: true })}
          state.signboardList = _cloneDeep(state.markers[i].signboardGroup);
          break;
        }
      }
    } 
  },
  setBuildingDetails(state, payload) {
    if(payload.location) {
      state.selectedSignboard.buildingDetails = {...payload, lat: payload.location.coordinates[1], lon: payload.location.coordinates[0]};
    } else {
      state.selectedSignboard.buildingDetails = {...payload};
    }
  },
  updateImageofSelectedSignboard(state, payload) {
    let imgId = payload._id;

    let foundIndex = _findIndex(state.selectedSignboard.images, (image) => image._id === imgId);
    state.selectedSignboard.images.splice(foundIndex, 1, { ...payload });
    state.selectedSignboard.images = [...state.selectedSignboard.images]
  },
  setSignboardToDeleted(state, { revisionStatus, signboardId }) {
    state.selectedSignboard.revisionStatus = revisionStatus;

    let markers = state.markers;
    for(let x = 0 ; x < state.markers.length ; x++) {
      for(let y = 0; y < state.markers[x].signboardGroup.length; y++) {
        if(state.markers[x].signboardGroup[y].signboardId === signboardId) {
          markers[x].signboardGroup[y] = { ...state.markers[x].signboardGroup[y] , revisionStatus };
          state.markers = [...markers];
          break;
        }
      }
    }
  },
  setImageAnnotationDetails(state, payload) {
    state.imageAnnotation = { ...payload };
  },
  setSignboardIds(state, {idList}) {
    state.signboardIdList = idList;
  },
  setFileRefList(state, payload) {
    state.fileRefList = payload;
  },
  setFilteringId(state, { filteringId }) {
    state.filteringId = filteringId;
  },
  resetFilteringId(state) {
    state.filteringId = [];
  },
  setFilteringFileRef(state, { filteringFileRef }) {
    state.filteringFileRef = filteringFileRef;
  },
  filterMarkers(state, {signboardId, signboards}) {
    state.markers = signboards.filter((marker) => {
      return marker.signboardId === signboardId
    })
  },
  setSignboardDetail(state, payload) {
    state.showSignboardDetail = payload;
  },
  setInitialCenter(state, {lat, lng}) {
    state.initialCenter = [lat, lng]
  },
  setPendingList(state, payload) {
    state.pendingItems = payload;
  },
  setPendingStatus(state, payload) {
    state.pendingStatusList = payload;
  },
  setSignboardImageData(state, payload) {
    state.signboardImageData = payload;
  },
  setDefectType(state, type) {
    state.selectedSignboard.defectTypes[0] = type
  },
  setDefectObjectId(state, id) {
    state.selectedDefectObjectId = id
  },
  setDefectList(state, items) {
    state.selectedSignboard.defectTypes = [...items]
  },
  setImageURL(state, url) {
    state.imageURL = url
  },
  setFilteringByTrip(state, tripInfo) {
    state.filterByTrip = tripInfo
  },
  resetFilteringTripId(state) {
    state.filterByTrip = "";
  },
  setDsrnAnnotation(state, payload) {
    state.dsrnAnnotation = payload
  }
};

export const actions = {
  async searchSignboards({ commit }, payload) {
    const wrappedSearchSignboards = await refreshWrapper(searchSignboards);
    const response = await wrappedSearchSignboards(payload);
    const signboards = response.data;

    if (signboards.length > 0) {
      commit(
        "setMarkers",
        signboards.map(signboardGroup => {
          return {
            markerId: `${signboardGroup._id.lat} ${signboardGroup._id.long}`,
            location: [
              signboardGroup._id.lat,
              signboardGroup._id.long
            ],
            signboardGroup: signboardGroup.signboards ? signboardGroup.signboards : null,
            signboardCount: signboardGroup.signboardCount,
            signboardType: signboardGroup._id.signboardType
          };
        })
      );

    }

    return signboards;
  },
  async getSignboardImage({ commit }, payload) {
    const { signboardId } = payload;
    let accessToken = window.localStorage.getItem("accessToken");
    let wrappedGetSignboardImage = await refreshWrapper(getSignboardImage);
    const result = await wrappedGetSignboardImage({ signboardId, accessToken });

    commit("setImagetoSignboard", { signboardId, images: result.data });
  },
  async getBuildings({ commit }, payload) {
    const {
      lat,
      long,
      precision
    } = payload;

    let accessToken = window.localStorage.getItem("accessToken");

    const wrappedGetBuildings = await refreshWrapper(getBuildings);
    const result = await wrappedGetBuildings({ long, lat, precision, accessToken });
    commit("setNearestBuildings", {
      buildings: result.data.bdBuilding.map((building) => {
        return { ...building, struct_id: parseInt(building.struct_id) }
      })
    });
  },

  async updateBuilding({ commit }, payload) {
    const {
      signboardId,
      building
    } = payload;

    let accessToken = window.localStorage.getItem("accessToken");
    let wrappedCreateBuilding = await refreshWrapper(createBuilding);
    let wrappedUpdateBuilding = await refreshWrapper(updateBuilding);
    
    await wrappedCreateBuilding({ building, accessToken });

    const result = await wrappedUpdateBuilding({ signboardId, building, accessToken });

    commit("updateMarkerStructureId", { marker: result.data });
    commit("setBuildingDetails", result.data);
    
  },

  async getSignboardData({ commit, dispatch }, { accessToken, signboardId }) {
    let wrappedGetSignboardInfo = await refreshWrapper(getSignboardInfo);
    let response = await wrappedGetSignboardInfo({ signboardId, accessToken });
    if (response.data.length) {
      let signboard = { ...response.data[0], id: response.data[0].id };
    
      commit("setSelectedSignboard", signboard);
      await dispatch("getBuildingDetails", { structureId: response.data[0].structId })
      await dispatch("getSignboardImage", { signboardId: response.data[0].signboardId });

      return 1;
    }
    
    return 0;
  },
  async updateVerifyStatus({ commit }, { signboardId, verified }) {
    await updateVerifyStatus(signboardId, verified, window.localStorage.getItem("accessToken"));
    commit("setVerifyStatus", { signboardId, verified });
  },
  async getBuildingDetails({ commit, dispatch }, { structureId }) {
    let response = await getBuilding(structureId, window.localStorage.getItem("accessToken"));

    if (response.data !== undefined) {
      commit("setBuildingDetails", response.data);
    }
  },
  async addAnnotation({ commit }, { signboardId, imageId, payload }) {
    const wrappedUpdateSignboard = await refreshWrapper(updateSignboard);
    const response = await wrappedUpdateSignboard({ signboardId, imageId, payload, accessToken: window.localStorage.getItem('accessToken') });

    if (response.data) {
      commit("updateImageofSelectedSignboard", response.data);
    }

    return response.data;
  },
  async deleteAnnotation({ commit }, { signboardId, imageId, payload }) {
    const wrappedUpdateSignboard = await refreshWrapper(updateSignboard);
    const response = await wrappedUpdateSignboard({ signboardId, imageId, payload, accessToken: window.localStorage.getItem('accessToken') });

    if (response.data) {
      commit("updateImageofSelectedSignboard", response.data);
    }
  },
  async updateAnnotation({ commit }, { signboardId, imageId, payload, fromSignboardDetail }) {
    const wrappedUpdateSignboard = await refreshWrapper(updateSignboard);
    const response = await wrappedUpdateSignboard({ signboardId, imageId, payload, accessToken: window.localStorage.getItem('accessToken') });

    if (response.data && fromSignboardDetail) {
      commit("updateImageofSelectedSignboard", response.data);
    } else if (response.data && !fromSignboardDetail) {
      commit("trips/updatePhotoAnnotationInTripView", response.data, { root: true });
    }
  },
  async markSignboardDeleted({ commit }, { signboardId, fromSignboardDetail }) {
    const wrappedDeleteSignboard = await refreshWrapper(deleteSignboard);
    const response = await wrappedDeleteSignboard({ signboardId, accessToken: window.localStorage.getItem('accessToken') });

    if (fromSignboardDetail) {
      commit("setSignboardToDeleted", { revisionStatus: response.data.revisionStatus, signboardId: response.data.signboardId });
    } else {
      commit("trips/deleteFromPhotos", { signboardId }, { root: true })
    }
  },
  async makePendingSignboard({ commit }, payload) {
    const wrappedCreateSignboard = await refreshWrapper(createSignboard);
    const response = await wrappedCreateSignboard({ payload, accessToken: window.localStorage.getItem('accessToken') });
    
    commit('trips/addSignboardImageToPhoto', response.data, { root: true });

    return response.data;
  },
  async grabSurveyTrips({ commit }, _) {
    const wrappedGetSurveyTrips = await refreshWrapper(getSurveyTrips);
    const response = await wrappedGetSurveyTrips({ accessToken: window.localStorage.getItem('accessToken') });
    commit("setTripList", response.data);
  },
  async evaluateAnnotations({ commit }, payload) {
    const wrappedEvaluateAnnotations = await refreshWrapper(evaluateAnnotations);
    const response = await wrappedEvaluateAnnotations({ payload, accessToken: window.localStorage.getItem('accessToken') });
  },
  async searchSignboardId({ commit }, { searchString }) {
    const wrappedSearchSignboard = await refreshWrapper(searchSignboard);
    const response = await wrappedSearchSignboard({ searchString, accessToken: window.localStorage.getItem("accessToken") });

    commit("setSignboardIds", { idList: response.data });
  },
  async searchFileReference({ commit }, payload) {
    const response = await searchFileRef(window.localStorage.getItem("accessToken"), payload.target.value);

    commit("setFileRefList", response.data);
  },
  async generateSingleMarker({ commit, dispatch }, { signboardId, mapObject }) {
    let wrappedGetSignboardInfo = await refreshWrapper(getSignboardInfo);
    let response = await wrappedGetSignboardInfo({ signboardId, accessToken: window.localStorage.getItem("accessToken") });
    const
      {
        location: {
          coordinates
        }
      } = response.data[0];
    let temp = mapObject.flyTo(
      { lat: coordinates[1], lng: coordinates[0] },
      18
    );

    const signboardSearchResponse = await dispatch('searchSignboards', {
      ...DEFAULT_SEARCH_VALUES,
      accessToken: window.localStorage.getItem("accessToken"),
      signboardId
    })

    const marker = signboardSearchResponse.map(signboardGroup => {
      return {
        markerId: `${signboardGroup._id.lat} ${signboardGroup._id.long}`,
        location: [
          signboardGroup._id.lat,
          signboardGroup._id.long
        ],
        signboardGroup: signboardGroup.signboards ? signboardGroup.signboards : null,
        signboardCount: signboardGroup.signboardCount,
        signboardType: signboardGroup._id.signboardType
      };
    })[0]

    let signboard = {
      location: marker.location,
      id: marker.signboardGroup[0]._id,
      ...marker.signboardGroup[0]
    };
    
    commit('setSelectedSignboard', signboard)
    await dispatch('getBuildingDetails', { structureId: marker.signboardGroup[0].structId });
    await dispatch('getSignboardImage', { signboardId: marker.signboardGroup[0].signboardId });
    commit('setSignboardDetail', true)

    commit("setFilteringId", { filteringId: signboardId })
  },
  async generateSingleMarkerFromFileRef({ commit, dispatch }, { fileRef, mapObject }) {
    commit('setFilteringFileRef', { filteringFileRef: fileRef })
    
    const signboards = await dispatch('searchSignboards', {
      ...DEFAULT_SEARCH_VALUES,
      accessToken: window.localStorage.getItem("accessToken"),
      fileRef
    });
    mapObject.flyTo(
      { lat: signboards[0]._id.lat, lng: signboards[0]._id.long },
      20
    )
  },
  async getInitialCenter({ commit }, _) {
    const wrappedSearchTrips = await refreshWrapper(searchTrips);
    const response = await wrappedSearchTrips({
      accessToken: window.localStorage.getItem("accessToken")
    });

    const { data } = response;

    commit('setInitialCenter', { lat: data[0].centerPoint.coordinates[1], lng: data[0].centerPoint.coordinates[0] })
  },
  async getPendingItems({ commit }, _) {
    const wrappedPendingItems = await refreshWrapper(getSignboardsPendingItems);
    const response = await wrappedPendingItems({
      accessToken: window.localStorage.getItem("accessToken")
    });

    commit('setPendingList', response.data);
  },
  async getPendingStatus({ commit }, payload) {
    const wrappedPendingStatus = await refreshWrapper(getSignboardsPendingStatus);
    const response = await wrappedPendingStatus({
      payload,
      accessToken: window.localStorage.getItem("accessToken")
    });

    commit('setPendingStatus', response.data);
  },
  async saveDSRNForm({ commit }, { signboardId, form, dsrnHandling, peopleInCharge }) {
    const wrappedSaveDSRNForm = await refreshWrapper(saveDSRNForm);
    const response = await wrappedSaveDSRNForm({
      accessToken: window.localStorage.getItem("accessToken"),
      signboardId,
      form,
      dsrnHandling,
      peopleInCharge
    });

    commit("setSelectedSignboard", response.data);
    commit("setDsrnAnnotation", "");
  },

  async updateDSRNHandling({ commit }, { dsrnHandling, signboardId, peopleInCharge }) {
    const wrappedUpdateDSRN = await refreshWrapper(updateDSRNHandling);
    const response = await wrappedUpdateDSRN({
      accessToken: window.localStorage.getItem("accessToken"),
      dsrnHandling, signboardId, peopleInCharge
    })

    commit("setSelectedSignboard", response.data);
  }
};