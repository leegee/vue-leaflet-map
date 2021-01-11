import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    drawer: {
      open: false
    },
    map: {
      bounds: []
    }
  },
  mutations: {
    drawerOpen: state => state.drawer.open = true,
    drawerClose: state => state.drawer.open = false,
    mapUpdateBounds: (state, { ne, sw }) => state.map.bounds = [ne, sw],
  },
  actions: {
    mapUpdateBounds: (context, { ne, sw }) => context.commit('mapUpdateBounds', { ne, sw }),
  }
});
