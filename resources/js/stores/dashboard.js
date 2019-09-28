import $axios from '../api.js'

const state = () => ({
    transactions: [],
})

const mutations = {
    ASSIGN_DATA_TRANSACTION(state, payload) {
        state.transactions = payload
    }
}

const actions = {
    getChartData({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.get(`/chart?month=${payload.month}&year=${payload.year}`)
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