const app = {
    state: {
      planssList: []
    },
    mutations: {
      GET_PLANSSLIST: (state, val) => {
        state.planssList = val
      },
      
    },
    actions: {
      setPlanssList: ({ commit }, val) => {
        commit('GET_PLANSSLIST',val)
      }
    },
  }
  
  export default app
  