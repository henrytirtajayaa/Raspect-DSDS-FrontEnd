import {
  login,
  logout,
  refreshAccessToken,
  getUserInfo,
  getAllUsers,
  updateUserRole,
  updateUserData,
  updateSampleRate,
  addUser,
  deleteUser,
  forgetPassword,
  resetPassword,
  sendEnquiry,
  getUsersFilter
} from "../requests/user";

import jwt from 'jsonwebtoken';
import { refreshWrapper, redirectLogin } from "../components/utils/utils";

export const state = () => ({
  userId: "",
  userRole: "",
  username: "",
  staffId: "",
  isLoggedIn: false,
  allUsers: [{}],
  currUser: [{}],
  errorMsg: "",
  sampleSize: 0,
  userPost: []
});

export const mutations = {
  setUserInfo(state, userInfo) {
    const { data: { userId, accessToken, refreshToken } } = userInfo;

    const object = jwt.verify(accessToken, 'ABCDEFG', (err, decodedPayload) => {

      if (!err) {
        state.userRole = decodedPayload.role;
        state.username = decodedPayload.staffId;
        state.userId = decodedPayload._id;
        window.localStorage.setItem("refreshToken", refreshToken);
        window.localStorage.setItem("userId", userId);
        window.localStorage.setItem("accessToken", accessToken);
        window.localStorage.setItem("userRole", state.userRole);
        state.isLoggedIn = true;
        this.$router.push("home");
      } 
    });
    state.userId = userInfo.data.userId;
  },
  logout(state) {

    state.userRole = "",
    state.username = "",
    state.userId = "",
    state.currUser = "",
    state.isLoggedIn = false
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("userRole");
    this.$router.push("/");
  },
  setUserData(state, payload) {
    state.userRole = payload.userInfo.role,
    state.staffId = payload.userInfo.staffId,
    state.currUser = payload.userInfo
  },
  setUsers(state, payload) {
    state.allUsers = payload.users;
  },
  setCurrentSampleSize(state, payload) {
    state.sampleSize = payload.users.filter((user) => user.userId === window.localStorage.getItem('userId'))[0].sampleSize;
  },
  updateUserList(state, { user }) {

    const foundIndex = state.allUsers.findIndex((element)=> user.staffId === element.staffId);

    state.allUsers.splice(foundIndex, 1, user);
  },
  setErrorMsg(state, response) {
    state.errorMsg = response.message;
  },
  addUserToList(state, { user }) {
    let temp = [...state.allUsers, user];

    state.allUsers = [...temp];
  },
  removeUserFromList(state, { userId }) {
    let foundIndex = state.allUsers.findIndex((user) => user.id === userId);

    state.allUsers.splice(foundIndex, 1);
  },
  getUserRole(state, _) {
    state.userRole = window.localStorage.getItem("userRole");
  },
  setUserPost(state, payload) {
    state.userPost = payload;
  }
};

export const actions = {
  async login({ commit, state }, userCredentials) {
      const response = await login(userCredentials);

      if(!response.message && !response.code) {
        commit('setUserInfo', response);
      } else {
        commit('setErrorMsg', response);
      }
      
  },
  async logout({ commit, state }, payload) {
    const response = await logout({userId: payload.userId, refreshToken: payload.refreshToken, accessToken: payload.accessToken});

    if (response === 401) {
      const newTokenPair = await refreshAccessToken(payload.userId, payload.refreshToken);
      if (newTokenPair === 401) {
        redirectLogin();
      }
      const { data: { refreshToken, accessToken } } = newTokenPair;

      await retryAndSetStorage(logout, {userId: payload.userId, refreshToken, accessToken});
    }
    commit('logout');
  },
  async getUserInfo({commit}, userId) {
    let wrappedGetUserInfo = await refreshWrapper(getUserInfo);
    const response = await wrappedGetUserInfo({userId, accessToken: window.localStorage.getItem("accessToken")});
  
    commit('setUserData', { userInfo: response.data });
  },
  async getAllUsers({commit}, userId) {
    const response = await getAllUsers(window.localStorage.getItem("accessToken"));
  
    commit('setCurrentSampleSize', { users: response.data });
    commit('setUsers', { users: response.data });
  },
  async saveUserEditedData({commit}, payload) {
    const { newUserType, userId, newPost, newChineseName, newEnglishName, newPhoneNumber, isUser } = payload;

    const response = await updateUserData(newUserType, userId, newPost, newChineseName, newEnglishName, newPhoneNumber, window.localStorage.getItem("accessToken"));
    
    if (isUser === true) {
      commit('setUserData', { userInfo: response.data });
    }
    else {
      commit('updateUserList', { user: response.data });
    }
  },
  async updateSampleSize({commit}, payload) {
    const { sampleRate, userId } = payload;

    const response = await updateSampleRate(sampleRate, userId, window.localStorage.getItem("accessToken"));

    commit('updateUserList', { user: response.data });
  },
  async createUser({commit}, payload) {
    let wrappedAddUser = await refreshWrapper(addUser);
    const response = await wrappedAddUser({ payload, accessToken: window.localStorage.getItem("accessToken") });

    commit('addUserToList', { user: response.data });
  },
  async removeUser({ commit }, { userId }) {
    let wrappedRemoveUser = await refreshWrapper(deleteUser);
    const response = await wrappedRemoveUser({ userId, accessToken: window.localStorage.getItem("accessToken") });

    commit('removeUserFromList', { userId });
  },
  async forgetPasswordAction({ commit }, { staffId }) {
    let wrappedForgetPassword = await refreshWrapper(forgetPassword);
    const response = await wrappedForgetPassword({ staffId, accessToken: window.localStorage.getItem("accessToken") });

  },
  async resetPasswordAction({commit}, { forgotPwdToken, password }) {
    let wrappedResetPassword = await refreshWrapper(resetPassword);
    const response = await wrappedResetPassword({ forgotPwdToken, password });

    return response;
  },
  async sendEnquiry({commit}, enquiryPayload) {
    let wrappedSendEnquiry = await refreshWrapper(sendEnquiry);
    const response = await wrappedSendEnquiry(enquiryPayload);
  },

  async getUsersPost({ commit }, { searchString }) {
    let wrappedGetUserPost = await refreshWrapper(getUsersFilter);
    const response = await wrappedGetUserPost({
      searchString,
      accessToken: window.localStorage.getItem("accessToken")
    });

    commit('setUserPost', response.data)
  }
};

const retryAndSetStorage = async (callback, params) => {

  const {refreshToken, accessToken } = params;

  if(callback.name !== "logout") {
    window.localStorage.setItem("accessToken", accessToken);
    window.localStorage.setItem("refreshToken", refreshToken);
  }

  return await callback({...params});
}