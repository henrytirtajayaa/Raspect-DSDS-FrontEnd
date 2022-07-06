import { ROOT_API } from "./constants";
const axios = require("axios").default;

export const saveSurvey = async ({ surveyId, sampleSize, boundaryPoints, createdAt, accessToken }) => {
    try {
        const response = await axios.post(
            `${ROOT_API}/surveys`,
            JSON.stringify({
                surveyId,
                sampleSize,
                boundaryPoints,
                createdAt
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
}

export const getSurveys = async ({ accessToken }) => {
    try {
        const response = await axios.get(
            `${ROOT_API}/surveys?needBoundaryPoints=1`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const deleteSurvey = async ({ accessToken, surveyId }) => {
    try {
        const response = await axios.delete(
            `${ROOT_API}/surveys/${surveyId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const updateSurvey = async ({ accessToken, surveyId, distributionOption }) => {
    try {
        const response = await axios.put(
            `${ROOT_API}/surveys/${surveyId}`,
            JSON.stringify({
                distributionOption,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        
        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const updateCoordinateSurvey = async ({ surveyId, boundaryPoints, accessToken }) => {
    try {
        const response = await axios.put(
            `${ROOT_API}/surveys/${surveyId}`,
            JSON.stringify({
                boundaryPoints,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        
        return response;
    } catch (e) {
        return e.response.status;
    }
}

export const getSelectedSurvey = async ({ accessToken, surveyId }) => {
  try {
    const response = await axios.get(`${ROOT_API}/surveys/${surveyId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response;
  } catch (e) {
    return e.response.status;
  }
}

export const updateTeamSurvey = async ({ accessToken, surveyId, teamIds }) => {
  try {
    const response = await axios.put(
      `${ROOT_API}/surveys/${surveyId}`,
      JSON.stringify({
        teamIds
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
}

export const updateSampleSize = async ({ accessToken, surveyId, sampleSize }) => {
    try {
        const response = await axios.put(
            `${ROOT_API}/surveys/${surveyId}`,
            JSON.stringify({
                sampleSize
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
}

export const getSurvey = async ({ accessToken, surveyId }) => {
    try {
        const response = await axios.get(
          `${ROOT_API}/surveys/${surveyId}`,
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
}
