const state = {
  main: 0,
  forceLogoutDialog: false,
  loading: 0 //0正常1加载中2无网
}

const mutations = {
  SET_FORCELOGOUTDIALOG (state, obj) {
    state.forceLogoutDialog = obj;
  },
  SET_Loading (state, obj) {
    state.loading = obj;
  },
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },
  setForceLogoutDialog ({commit, state}, status) {
    console.log('setForceLogoutDialog')
    commit('SET_FORCELOGOUTDIALOG', status)
  },
  setLoading ({commit, state}, status) {
    console.log('setLoading',status)
    commit('SET_Loading', status)
  }
}

export default {
  state,
  mutations,
  actions
}
