import { ROOT_API } from "./constants";

const axios = require("axios").default;

export const login = async userCredentials => {
  const { login, password, rememberMe } = userCredentials;

  try {
    const userInfo = await axios.post(
      `${ROOT_API}/login`,
      JSON.stringify({
        login,
        password,
        rememberMe
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  
    return userInfo;
  } catch(e) {
    return { code: e.response.status, message: e.response.data.message};
  } 
  
};

export const logout = async (userLogoutCredentials) => {
  const { userId, refreshToken, accessToken } = userLogoutCredentials;
  try {
    const response = await axios.post(
      `${ROOT_API}/logout`,
      JSON.stringify({
        userId,
        refreshToken
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    )
    return response;
  } catch(e) {
    return e.response.status;
  }
}

export const refreshAccessToken = async (userId, refreshToken) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/refresh-access-token`,
      JSON.stringify({
        userId,
        refreshToken
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response;
  } catch(e) {
    return e.response.status;
  }
}

export const getUserInfo = async ({userId, accessToken}) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response;
  } catch(e) {
    return e.response.status;
  }
}

export const getAllUsers = async (accessToken) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/user`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response;
  } catch(e) {
    return e.response.status;
  }
}

export const updateUserData = async (newUserType, userId, newPost, newChineseName, newEnglishName, newPhoneNumber, accessToken) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/user/${userId}`,
      JSON.stringify({
        role: newUserType,
        post: newPost,
        chineseName: newChineseName,
        englishName: newEnglishName,
        phoneNumber: newPhoneNumber
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );

    return response;
  } catch(e) {
    return e.response.status;
  }
}

export const updateSampleRate = async (sampleRate, userId, accessToken) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/user/${userId}`,
      JSON.stringify({
        sampleSize: sampleRate
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );

    return response;
  } catch(e) {
    return e.response.status;
  }
}

export const addUser = async ({ accessToken, payload }) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/user`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );

    return response;
  } catch(e) {
    return e.response.status;
  }
}

export const deleteUser = async({ accessToken, userId }) => {
  try {
    const response = await axios.delete(
      `${ROOT_API}/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );

    return response;
  } catch (e) {
    return e.response.status;
  }
}

export const forgetPassword = async ({ staffId, accessToken }) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/forget-password`,
      JSON.stringify({ staffId }),
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );

    return response;
  } catch (e) {
    return e.response.status;
  }
}

export const resetPassword = async ({ forgotPwdToken, password }) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/reset-password`,
      JSON.stringify({
        forgotPwdToken,
        password
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response;
  } catch (e) {
    return e.response.status;
  }
}

export const sendEnquiry = async (enquiryPayload) => {
  try {
    const response = await axios.post(
      `${ROOT_API}/contact-us`,
      JSON.stringify(enquiryPayload),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    return response;
  } catch (e) {
    return e.response.status;
  }
}

export const getUsersFilter = async ({ searchString, accessToken }) => {
  try {
    const response = await axios.get(
      `${ROOT_API}/user/filter?searchString=${searchString}`,
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