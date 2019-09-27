import $axios from '../api.js'

const state = () => ({
    customers: [],
    products: [],
    transaction: [],
    list_transaction: [],
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
    },
    ASSIGN_TRANSACTION(state, payload) {
        state.transaction = payload
    },
    ASSIGN_DATA_TRANSACTION(state, payload) {
        state.list_transaction = payload
    },
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
    },
    detailTransaction({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.get(`/transaction/${payload}/edit`)
            .then((response) => {
                commit('ASSIGN_TRANSACTION', response.data.data)
                resolve(response.data)
            })
        })
    },
    payment({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.post(`/transaction/payment`, payload)
            .then((response) => {
                resolve(response.data)
            })
        })
    },
    completeItem({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.post(`/transaction/complete-item`, payload)
            .then((response) => {
                resolve(response.data)
            })
        })
    },
    getTransactions({ commit, state }, payload) {
        let search = typeof payload.search != 'undefined' ? payload.search:''
        let status = typeof payload.status != 'undefined' ? payload.status:''
        return new Promise((resolve, reject) => {
            $axios.get(`/transaction?page=${state.page}&q=${search}&status=${status}`)
            .then((response) => {
                commit('ASSIGN_DATA_TRANSACTION', response.data)
                resolve(response.data)
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}