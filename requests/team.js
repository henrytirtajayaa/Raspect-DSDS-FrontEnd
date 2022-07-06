import { ROOT_API } from "./constants";
const axios = require("axios").default;

export const getTeams = async ({ accessToken }) => {
  try {
    const response = await axios.get(`${ROOT_API}/teams`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response;
  } catch (e) {
    return e.response.status;
  }
};

export const getTeam = async ({ accessToken, teamId }) => {
  try {
    const response = await axios.get(`${ROOT_API}/teams/${teamId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response;
  } catch (e) {
    return e.response.status;
  }
};

export const createTeam = async ({
  accessToken,
  seniorPro,
  caseOfficer,
  caseAssistant
}) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/teams`,
      JSON.stringify({
        seniorPro,
        caseOfficer,
        caseAssistant
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response;
  } catch (e) {
    return e.response.status;
  }
};

export const updateTeam = async ({
  accessToken,
  addTeams,
  updateTeams,
  deleteTeams
}) => {
  try {
    const response = await axios.put(
      `${ROOT_API}/teams`,
      JSON.stringify({
        addTeams,
        updateTeams,
        deleteTeams
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response;
  } catch (e) {
    return e.response.status;
  }
};

export const deleteTeam = async ({ accessToken, teamId }) => {
  try {
    const response = await axios.delete(`${ROOT_API}/teams/${teamId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response;
  } catch (e) {
    return e.response.status;
  }
};

export const distributeTeam = async ({ accessToken, surveyId }) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/signboards/distribute/survey/${surveyId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response;
  } catch (e) {
    return e.response.status;
  }
};
