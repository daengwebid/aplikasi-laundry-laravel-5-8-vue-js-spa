import $axios from '../api.js'

const state = () => ({
    outlets: [],
    outlet: {
        code: '',
        name: '',
        status: false,
        address: '',
        phone: ''
    },
    page: 1
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.outlets = payload
    },
    SET_PAGE(state, payload) {
        state.page = payload
    },
    ASSIGN_FORM(state, payload) {
        state.outlet = {
            code: payload.code,
            name: payload.name,
            status: payload.status,
            address: payload.address,
            phone: payload.phone
        }
    },
    CLEAR_FORM(state) {
        state.outlet = {
            code: '',
            name: '',
            status: false,
            address: '',
            phone: ''
        }
    }
}

const actions = {
    getOutlets({ commit, state }, payload) {
        let search = typeof payload != 'undefined' ? payload:''
        return new Promise((resolve, reject) => {
            $axios.get(`/outlets?page=${state.page}&q=${search}`)
            .then((response) => {
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },
    submitOutlet({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            $axios.post(`/outlets`, state.outlet)
            .then((response) => {
                dispatch('getOutlets').then(() => {
                    resolve(response.data)
                })
            })
            .catch((error) => {
                if (error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    editOutlet({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.get(`/outlets/${payload}/edit`)
            .then((response) => {
                commit('ASSIGN_FORM', response.data.data)
                resolve(response.data)
            })
        })
    },
    updateOutlet({ state, commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.put(`/outlets/${payload}`, state.outlet)
            .then((response) => {
                commit('CLEAR_FORM')
                resolve(response.data)
            })
        })
    } ,
    removeOutlet({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            $axios.delete(`/outlets/${payload}`)
            .then((response) => {
                dispatch('getOutlets').then(() => resolve())
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}