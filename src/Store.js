import Vue from 'vue'
import Vuex from 'vuex'

// import * as api from './Api';

let api;

Vue.use(Vuex)

export function setApi(_api) {
  api = _api;
}

export const store = new Vuex.Store({
  state: {
    count: 0,
    drawer: {
      open: false,
      details: {},
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
    drawerClose: state => state.drawer.open = false,
    drawerOpen: (state, payload) => {
      state.drawer.details = payload;
      state.drawer.open = true;
    },
    mapUpdateData: (state, { markerData }) => {
      state.markerData = markerData;
    },
    mapUpdateBounds: (state, { ne, sw }) => {
      state.map.bounds = { ne, sw };
    },
  },
  actions: {
    drawerOpen: (context, payload) => {
      context.commit('drawerOpen', payload);
    },
    mapUpdateData: async (context) => {
      const markerData = await api.getBoundingBox(context.state.map.bounds);
      context.commit('mapUpdateData', { markerData });
    }
  },
});
