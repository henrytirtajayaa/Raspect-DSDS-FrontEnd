const axios = require("axios").default;
import { ROOT_API } from "./constants";
import _isEmpty from 'lodash/isEmpty';

export const searchTrips = async ({
  boundary = "",
  startDate = "",
  endDate = "",
  accessToken
}) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/trips?${ _isEmpty(boundary) ? "" : `boundary=${encodeURIComponent(JSON.stringify(boundary)) }`}&startDate=${startDate}&endDate=${endDate}`,
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

export const getDistricts = async accessToken => {
  try {
    const response = await axios.get(`${ROOT_API}/districts`, {
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

export const getPhotos = async ({ accessToken, refId, coordinates }) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/trips/${refId}/photos?coordinates=${encodeURIComponent(
        JSON.stringify(coordinates)
      )}`,
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

export const getNextImageBatch = async ({accessToken, batchNo, direction, tripId}) => {

  let tripObj = {
    no: batchNo,
    direction
  }
  
  try {
    const response = await axios.get(
      `${ROOT_API}/trips/${tripId}/photos?batch=${JSON.stringify(tripObj)}`,
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

export const getLatestTrips = async ({ accessToken }) => {
  try {
    const response = await axios.get(`${ROOT_API}/trips/latest`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response
  } catch (e) {
    return e.response.status
  }
}

export const getLidarImagePath = async ({ accessToken, refId, filename, groupId }) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/trips/${refId}/photo/${filename}/group-id/${groupId}`,
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

export const getAllPredictionImagePath = async ({ accessToken, refId, filename }) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/trips/${refId}/photo/${filename}/all-prediction`,
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