import { ROOT_API, JSREPORT_TOKEN } from "./constants";
const axios = require("axios").default;

export const searchSignboards = async searchPayload => {
  const {
    boundary,
    startDate,
    endDate,
    keyword,
    status,
    isDefective,
    accessToken,
    precision,
    signboardId,
    fileRef,
    tripRefId
  } = searchPayload;

  try {
    const response = await axios.get(
      `${ROOT_API}/signboards?boundary=${
        JSON.stringify(boundary)
      }&startDate=${startDate}&endDate=${endDate}&keyword=${keyword}&status=${status}&isDefective=${isDefective}&signboardId=${signboardId ? signboardId : ""}&fileRef=${fileRef ? fileRef : ''}&tripRefId=${tripRefId ? tripRefId : ''}`,
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

export const getSignboardImage = async ({ signboardId, accessToken }) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/signboards/${signboardId}/images`,
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

export const getBuildings = async ({ long, lat, precision, accessToken }) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/signboards/buildings?lat=${lat}&long=${long}&precision=${precision}`,
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

export const updateBuilding = async ({
  signboardId,
  building,
  accessToken
}) => {
  try {
    const response = await axios.put(
      `${ROOT_API}/signboards/${signboardId}`,
      JSON.stringify({
        ...building
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

export const getSignboardInfo = async ({ signboardId, accessToken }) => {
  try {
    const response = await axios.get(`${ROOT_API}/signboards/${signboardId}`, {
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

export const updateVerifyStatus = async (signboardId, verified, accessToken) => {
  try {
    const response = await axios.put(
      `${ROOT_API}/signboards/${signboardId}`,
      JSON.stringify({
        // verified: true
        ...(verified ? { verified: false } : { verified: true })
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

export const getBuilding = async (structureId, accessToken) => {
  try {
    const response = await axios.get(`${ROOT_API}/buildings/${structureId}`, {
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

export const createBuilding = async ({ building, accessToken }) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/buildings`,
      JSON.stringify([building]),
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

export const deleteSignboard = async ({ signboardId, accessToken }) => {
  try {
    const response = await axios.put(
      `${ROOT_API}/signboards/${signboardId}`,
      JSON.stringify({
        signboardIdentification: "deleted"
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

export const createSignboard = async ({ payload, accessToken }) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/signboards/pending`,
      JSON.stringify(payload),
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

export const getSurveyTrips = async ({ accessToken }) => {
  try {
    const response = await axios.get(`${ROOT_API}/trips`, {
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

export const evaluateAnnotations = async ({ payload, accessToken }) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/signboards/run-evaluate-workflow`,
      JSON.stringify(payload),
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

export const getexportImageOriginal = async (
  imgName,
  tripId,
  { accessToken }
) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/trips/${tripId}/photo${imgName[0]}/export`,
      {
        responseType: "blob",
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

export const generateDocument = async ( payload ) => {
  try {
    const response = await axios.post(
      process.env.REPORT_API,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${JSREPORT_TOKEN}`
        }
      }
    );
    return response
  } catch (e) {
    return e.response.status;
  }
}

export const getSignboardsPendingItems = async ({ accessToken }) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/signboards/pending`,
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

export const getSignboardsPendingStatus = async ({ payload, accessToken }) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/signboards/pending/status`,
      JSON.stringify(payload),
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

export const saveDSRNForm = async ({ form, dsrnHandling, peopleInCharge, signboardId, accessToken }) => {
  try {
    const response = await axios.put(
      `${ROOT_API}/signboards/${signboardId}`,
      JSON.stringify({
        form,
        dsrnHandling,
        peopleInCharge
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
export const updateDSRNHandling = async ({
  dsrnHandling, signboardId, peopleInCharge, accessToken
}) => {
  try {
    const response = await axios.put(
      `${ROOT_API}/signboards/${signboardId}`,
      JSON.stringify({
        dsrnHandling,
        peopleInCharge
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

export const getgeneratedDocs = async ({ downloadLink }) => {
  try {
    const response = await axios.get(`${downloadLink}`, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${JSREPORT_TOKEN}`
      }
    });
    return response;
  } catch (e) {
    return e.response.status;
  }
};
