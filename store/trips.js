import { getDistricts, searchTrips, getPhotos, getNextImageBatch, exportTripImages, getLatestTrips, getLidarImagePath, getAllPredictionImagePath } from "../requests/trips.js";
import { refreshWrapper, retryAndSetStorage, redirectLogin } from '../components/utils/utils.js';
import { refreshAccessToken } from "../requests/user";
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';

export const state = () => ({
  trips: [],
  districts: [],
  currentTripMapCenter: [22.302711,114.177216],
  photos: [],
  filter: {
    surveyId: [],
    tripId: [],
    tripDateRange: []
  },
  tripColors: {},
  selectedPoint: [22.302711, 114.177216],
  latestTrips: []
});

const sortWaypoints = (waypoints) => {

  let sortedWaypoints = waypoints.length > 0 ? waypoints.map((coordinatePair)=> {
    return coordinatePair.sort((a,b)=> {
      return a - b;
    })
  }) : [];

  return sortedWaypoints;
}
export const mutations = {
  setTrips(state, payload) {
    state.trips = [...payload.trips].map(trip => {
      return { waypoints: [...trip.waypoints.coordinates], refId: trip.refId, surveyId: trip.surveyId, sampledWaypoints: trip.sampledWaypoints ?  trip.sampledWaypoints.coordinates: [], centerPoint: trip.centerPoint ?? null, startTime: trip.startTime }
    }).map(trip => {

      trip.waypoints = sortWaypoints(trip.waypoints);

      trip.sampledWaypoints = sortWaypoints(trip.sampledWaypoints);
      
      return trip;
    });
  },

  setDistricts(state, payload) {
    state.districts = [...payload.districts]
  },

  setCenter(state, payload) {
    state.currentTripMapCenter = payload.center;
  },

  setPhotos(state, payload) {
    state.photos = [...payload.photos.photos]
  },

  setTripColors(state, tripColors) {
    state.tripColors = {...tripColors};
  },
  
  setDateRange(state, dateRange) {
    state.filter.tripDateRange = [...dateRange];
  },

  setFilterTripToEmpty(state, _) {
    state.filter.tripId = "";
  },
  setSelectedPoint(state, coordinates) {
    state.selectedPoint = coordinates;
  },
  deleteFromPhotos(state, payload) {
    const { signboardId } = payload;

    let photos = state.photos;

    for(let x = 0 ; x < state.photos.length ; x++) {
      for(let y = 0; y < state.photos[x].signboardimages.length; y++) {
        if(state.photos[x].signboardimages[y].signboardId === signboardId) {
          state.photos[x].signboardimages.splice(y, 1);
          break;
        }
      }
    }
  },
  addSignboardImageToPhoto(state, { signboardImage }) {
    const { signboardAnnotation, signboardId, _id, originalPhotoId, status } = signboardImage;

    let newSignboardImage = {
      _id,
      defectAnnotations: [],
      signboardAnnotation,
      signboardId,
      status
    }

    for(let x = 0; x < state.photos.length; x++ ) {
      if (state.photos[x]._id === originalPhotoId) {
        state.photos[x].signboardimages.push(newSignboardImage);
        state.photos = [...state.photos];
        break;
      }
    }
  },
  updatePhotoAnnotationInTripView(state, payload) {
    let signboardImageId = payload._id;
    let {originalPhotoId} = payload;

    //TODO: do checking here to check if from signboard angle or from photos angle 
    let foundIndex = _findIndex(state.photos, (image) => image._id === originalPhotoId);
    for(let x = 0; x < state.photos[foundIndex].signboardimages.length; x++) {
      if(state.photos[foundIndex].signboardimages[x]._id === signboardImageId) {
        state.photos[foundIndex].signboardimages.splice(x, 1, payload);
        state.photos[foundIndex].signboardimages = [...state.photos[foundIndex].signboardimages]
        break;
      }
    }
  },
  setLatestTrips(state, payload) {
    state.latestTrips = [...payload.latestTrips]
  }
};

export const actions = {
  async getTrips({ state, commit, dispatch }, payload) {

    const { boundary, startDate, endDate } = payload;

    const wrappedSearchTrips = await refreshWrapper(searchTrips);
    const response = await wrappedSearchTrips({
      boundary,
      startDate,
      endDate,
      accessToken: window.localStorage.getItem("accessToken")
    });

    const { data } = response;
    commit("setTrips", { trips: data });
    dispatch("getDistricts");
    
  },
  async searchTripAction({ state, commit }, payload) {
    const { boundary, startDate, endDate } = payload;

    const response = await searchTrips(
      boundary,
      startDate,
      endDate,
      window.localStorage.getItem("accessToken")
    );

    const { data } = response;
    commit("setTrips", { trips: data });
  },
  async getDistricts({commit}) {
    const response = await getDistricts(window.localStorage.getItem("accessToken"));

    if (response === 401) {
      const newTokenPair = await refreshAccessToken(window.localStorage.getItem("userId"), window.localStorage.getItem("refreshToken"));
      if (newTokenPair === 401) {
        redirectLogin();
      }

      const {data: {refreshToken, accessToken, userId}} = newTokenPair;

      const success = await retryAndSetStorage(getDistricts, {
        refreshToken,
        accessToken,
      });

      if (success) {
        const { data } = response;
        commit("setDistricts", { districts: data });
      }
    } else {
      const { data } = response;
      commit("setDistricts", { districts: data });
    }
  },
  async getTripPhotos({ state, commit }, payload) {
    const { refId, coordinates } = payload;
    const wrappedGetPhotos = await refreshWrapper(getPhotos);
    // const response = await getPhotos(window.localStorage.getItem("accessToken"), refId, coordinates);
    const response = await wrappedGetPhotos({ accessToken: window.localStorage.getItem("accessToken"), refId, coordinates });
    commit('setPhotos', { photos: response.data }); 
  },
  async getPhotoBatch({ commit }, payload) {

    const {batchNo, direction, tripId} = payload;
    const wrappedGetNextImageBatch = await refreshWrapper(getNextImageBatch);
    // const response = await getNextImageBatch(window.localStorage.getItem('accessToken'), batchNo, direction, tripId);
    const response = await wrappedGetNextImageBatch({accessToken: window.localStorage.getItem('accessToken'), batchNo, direction, tripId});
    if(!_isEmpty(response.data.coordinates)) {
      commit('setSelectedPoint', response.data.coordinates);
    }
    commit('setPhotos', { photos: response.data }); 
  },
  async getLatestTrips({commit}) {
    const wrappedGetLatestTrips = await refreshWrapper(getLatestTrips)
    const response = await wrappedGetLatestTrips({ accessToken: window.localStorage.getItem("accessToken") })
    
    commit("setLatestTrips", { latestTrips: response.data })
  },
  async getLidarImagePath({commit}, payload) {
    const {refId, filename, groupId} = payload;
    const wrappedGetLidarImagePath = await refreshWrapper(getLidarImagePath)
    const response = await wrappedGetLidarImagePath({ accessToken: window.localStorage.getItem("accessToken"), refId, filename, groupId })
    
    return response.data;
  },

  async getAllPredictionImagePath({commit}, payload) {
    const {refId, filename} = payload;
    const wrappedGetAllPredictionImagePath = await refreshWrapper(getAllPredictionImagePath)
    const response = await wrappedGetAllPredictionImagePath({ accessToken: window.localStorage.getItem("accessToken"), refId, filename })
    
    return response.data;
  }
};
