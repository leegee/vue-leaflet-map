import Vue from 'vue'
import Vuex from 'vuex'

import * as api from './Api';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    drawer: {
      open: false
    },
    markerData: {},
    map: {
      bounds: {
        ne: null,
        sw: null
      }
    }
  },
  mutations: {
    drawerOpen: state => state.drawer.open = true,
    drawerClose: state => state.drawer.open = false,
    mapUpdateData: (state, { markerData }) => {
      console.log('Store.mapUpdateData', markerData);
      state.markerData = markerData;
    },
    mapUpdateBounds: (state, { ne, sw }) => {
      state.map.bounds = { ne, sw };
    },
  },
  actions: {
    mapUpdateData: async (context) => {
      const markerData = await api.getBoundingBox(context.state.map.bounds);
      context.commit('mapUpdateData', { markerData });
    },
  },
});
