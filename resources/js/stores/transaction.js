import $axios from '../api.js'

const state = () => ({
    customers: [],
    products: [],
    page: 1
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.customers = payload
    },
    DATA_PRODUCT(state, payload) {
        state.products = payload
    },
    SET_PAGE(state, payload) {
        state.page = payload
    }
}

const actions = {
    getCustomers({ commit, state }, payload) {
        let search = payload.search
        payload.loading(true)
        return new Promise((resolve, reject) => {
            $axios.get(`/customer?page=${state.page}&q=${search}`)
            .then((response) => {
                commit('ASSIGN_DATA', response.data)
                payload.loading(false)
                resolve(response.data)
            })
        })
    },
    getProducts({ commit, state }, payload) {
        let search = payload.search
        payload.loading(true)
        return new Promise((resolve, reject) => {
            $axios.get(`/product?page=${state.page}&q=${search}`)
            .then((response) => {
                commit('DATA_PRODUCT', response.data)
                payload.loading(false)
                resolve(response.data)
            })
        })
    },
    createTransaction({commit}, payload) {
        return new Promise((resolve, reject) => {
            $axios.post(`/transaction`, payload)
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