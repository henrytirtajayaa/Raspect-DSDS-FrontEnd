import { saveSurvey, getSurveys, deleteSurvey, updateSurvey,  getSelectedSurvey, updateTeamSurvey, updateCoordinateSurvey, updateSampleSize, getSurvey } from '../requests/survey';
import { refreshWrapper } from "../components/utils/utils.js";
import _findIndex from "lodash/findIndex";

export const state = () => ({
    surveys: [],
    selectedSurvey: [],
    selectedSurveyArea: {},
    surveyArea: []
})

export const mutations = {
    setSurveys(state, payload) {
        state.surveys = payload;
    },

    setSelectedSurvey(state, payload) {
        state.selectedSurvey = payload;
    },

    setSurveyArea(state, payload) {
        state.surveyArea = payload;
    },

    addNewSurvey(state, payload) {
        state.surveyArea.push(payload);
    },
    setSelectedSurveyArea(state, payload) {
        state.selectedSurveyArea = payload;
    },
    deleteSurveyArea(state, payload) {
        const index = _findIndex(state.surveyArea, (survey) => survey.surveyId === payload.surveyId);
        state.surveyArea.splice(index, 1);
    },
    setDistributionOpt(state, payload) {
        state.selectedSurvey.distributionOption = payload;
    },
    setTeamIdsSelectedSurvey(state, payload) {
        state.selectedSurvey.teamIds = payload;
    }
}

export const actions = {
    async saveSurvey ({ commit }, payload) {
        const wrappedSaveSurvey = await refreshWrapper(saveSurvey);
        const response = await wrappedSaveSurvey(payload);

        commit("addNewSurvey", response.data);
    },
    async getSurveys({ commit }, { accessToken }) {
        const wrappedGetSurveys = await refreshWrapper(getSurveys);
        const response  = await wrappedGetSurveys({ accessToken });

        commit("setSurveyArea", response.data)
    },
    async deleteSurvey({ commit }, { accessToken, surveyId }) {
        let wrappedDeleteSurvey = await refreshWrapper(deleteSurvey);
        await wrappedDeleteSurvey({ accessToken, surveyId })

        commit('deleteSurveyArea', surveyId) 
    },

    async updateDistOptionSurvey({ commit }, { surveyId, distributionOption }) {
        const wrappedUpdateSurvey = await refreshWrapper(updateSurvey);
        const response = await wrappedUpdateSurvey({
          accessToken: window.localStorage.getItem("accessToken"),
          surveyId,
          distributionOption
        });

        commit("setDistributionOpt", response.data.distributionOption);
    },

    async getSelectedSurvey({ commit }, { surveyId }) {
        const wrappedGetSelectedSurvey = await refreshWrapper(getSelectedSurvey);
        const response = await wrappedGetSelectedSurvey({
          accessToken: window.localStorage.getItem("accessToken"),
          surveyId
        });

        commit("setSelectedSurvey", response.data);
    },

    async updateTeamSurvey({ commit }, { surveyId, teamIds }) {
        const wrappedUpdateTeamSurvey = await refreshWrapper(updateTeamSurvey);
        const response = await wrappedUpdateTeamSurvey({
            accessToken: window.localStorage.getItem("accessToken"),
            surveyId,
            teamIds
        });

        commit("setTeamIdsSelectedSurvey", response.data.teamIds);
    },

    resetSelectedSurvey({ commit }) {
        commit("setSelectedSurvey", {});
    },

    async editCoordsSurvey ({ commit }, payload) {
        let wrappedSaveSurvey = await refreshWrapper(updateCoordinateSurvey);
        await wrappedSaveSurvey(payload);

        commit("addNewSurvey", payload);
    },

    async updateSampleSize({ commit }, { surveyId, sampleSize }) {
        let wrappedUpdateSampleSize = await refreshWrapper(updateSampleSize);
        await wrappedUpdateSampleSize({
          accessToken: window.localStorage.getItem("accessToken"),
          surveyId,
          sampleSize
        });
    },

    async getSurvey({ commit }, { surveyId }) {
        let wrappedGetSuvey = await refreshWrapper(getSurvey);
        const response = await wrappedGetSuvey({
          accessToken: window.localStorage.getItem("accessToken"),
          surveyId
        });

        return response.data
    }
}