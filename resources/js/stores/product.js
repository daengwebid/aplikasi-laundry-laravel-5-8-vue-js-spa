import $axios from '../api.js'

const state = () => ({
    products: [],
    laundry_types: [],
    page: 1
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.products = payload
    },
    ASSIGN_LAUNDRY_TYPE(state, payload) {
        state.laundry_types = payload
    },
    SET_PAGE(state, payload) {
        state.page = payload
    }
}

const actions = {
    getProducts({ commit, state }, payload) {
        let search = typeof payload != 'undefined' ? payload:''
        return new Promise((resolve, reject) => {
            $axios.get(`/product?page=${state.page}&q=${search}`)
            .then((response) => {
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },
    getLaundryType({ commit }) {
        return new Promise((resolve, reject) => {
            $axios.get(`/product/laundry-type`)
            .then((response) => {
                commit('ASSIGN_LAUNDRY_TYPE', response.data.data)
                resolve(response.data)
            })
        })
    },
    addLaundryType({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.post(`/product/laundry-type`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                if (error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    addProductLaundry({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.post(`/product`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                if (error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    editProduct({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.get(`/product/${payload}/edit`)
            .then((response) => {
                resolve(response.data)
            })
        })
    },
    updateCourier({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.put(`/product/${payload.id}`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                if (error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    removeProduct({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.delete(`/product/${payload}`)
            .then((response) => {
                resolve(response.data)
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