import Vue from 'vue'
import Vuex from 'vuex'

import { get } from './Api';

Vue.use(Vuex)

const MAP_UPDATE_MS = 1000;

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
    mapUpdateData: (state, data) => state.data = data,
  },
  actions: {
    mapUpdateData: (context) => {

      get().then(
        (data) => context.commit('mapUpdateData', { data })
      );
    },
  },
});
