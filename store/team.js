import {
  createTeam,
  getTeam,
  getTeams,
  updateTeam,
  deleteTeam,
  distributeTeam
} from "../requests/team";
import { refreshWrapper } from "../components/utils/utils.js";
import _findIndex from "lodash/findIndex";

export const state = () => ({
  teams: [],
  fromAssignTeam: false
});

export const mutations = {
  setTeams(state, payload) {
    state.teams = payload;
  },
  addTeam(state, payload) {
    state.teams.push(payload);
  },
  deleteTeam(state, id) {
    let foundIndex = _findIndex(
      state.teams,
      team => team._id === id
    );
    state.teams.splice(foundIndex, 1);
  },
  toggleFromAssignTeam(state) {
    state.fromAssignTeam = !state.fromAssignTeam;
  }
};

export const actions = {
  async getTeams({ commit }) {
    let wrappedGetteams = await refreshWrapper(getTeams);
    let response = await wrappedGetteams({
      accessToken: window.localStorage.getItem("accessToken")
    });

    commit("setTeams", response.data);
  },

  async getTeam({ commit }, { id }) {
    let wrappedGetteams = await refreshWrapper(getTeam);
    let response = await wrappedGetteams({
      accessToken: window.localStorage.getItem("accessToken"),
      id
    });

    commit("setTeams", response.data);
  },

  async createTeam({ commit }, payload) {
    let { seniorPro, caseOfficer, caseAssistant } = payload;
    let wrappedGetteams = await refreshWrapper(createTeam);
    let response = await wrappedGetteams({
      accessToken: window.localStorage.getItem("accessToken"),
      seniorPro,
      caseOfficer,
      caseAssistant
    });

    commit("addTeam", response.data);
  },

  async updateTeam({ commit }, payload) {
    let { addTeams, updateTeams, deleteTeams } = payload;
    let wrappedGetteams = await refreshWrapper(updateTeam);
    let response = await wrappedGetteams({
      accessToken: window.localStorage.getItem("accessToken"),
      addTeams,
      updateTeams,
      deleteTeams
    });

    commit("setTeams", response.data);
  },

  async deleteTeam({ commit }, { teamId }) {
    let wrappedGetteams = await refreshWrapper(deleteTeam);
    let response = await wrappedGetteams({
      accessToken: window.localStorage.getItem("accessToken"),
      teamId
    });

    commit("deleteTeam", response.data);
  },

  async reDistributeTeam({ commit }, { surveyId }) {
    let wrappedRedistribute = await refreshWrapper(distributeTeam);
    await wrappedRedistribute({
      accessToken: window.localStorage.getItem("accessToken"),
      surveyId
    });
  }
};
