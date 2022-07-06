import { getHistory } from "../requests/performance";
import { refreshWrapper } from '../components/utils/utils';

export const state = () => ({
    history: [],
    totalNormalSignboardCount: 0,
    totalDefectiveSignboardCount: 0
})

export const actions = {
    async getRecords({commit}, payload) {
        const wrappedGetHistory = await refreshWrapper(getHistory);
        const response = await wrappedGetHistory({ surveyPayload: payload, accessToken: window.localStorage.getItem("accessToken")})
        
        commit('setHistory', response.data);
        commit('setTotalSignboardCount', response.data);
    }
}

export const mutations = {
    setHistory(state, payload) {
        state.history = [...payload];
    },
    setTotalSignboardCount(state, payload) {
        state.totalNormalSignboardCount = 0;
        state.totalDefectiveSignboardCount = 0;
        
        for(let signboardObject of payload) {
            state.totalNormalSignboardCount += signboardObject.normalSignboardCount;
            state.totalDefectiveSignboardCount += signboardObject.defectiveSignboardCount;
        };
    }
}