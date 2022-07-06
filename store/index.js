import {getField,updateField} from 'vuex-map-fields';


export const state = () => ({
    initialState: {}
})

export const mutations = {
    updateField
}

export const getters= {
    isAuthenticated: state => {
        return state.user.isLoggedIn;
    },
    getField
}