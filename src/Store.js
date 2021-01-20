import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let api;

export function setApi(_api) {
  api = _api;
  store.state.map.updateMs = api.UPDATE_MAP_MS;
  store.state.user.updateMs = api.UPDATE_USER_MS;
}

export const store = new Vuex.Store({
  state: {
    count: 0,
    drawer: {
      open: false,
      details: {},
    },
    markerData: {},
    user: {
      updateMs: 0,
    },
    map: {
      updateMs: 0,
      focusMarkerLabel: null,
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
    focusMarkerByLabel: (state, markerLabel) => {
      state.map.focusMarkerLabel = markerLabel;
    },
    markerHide: (state, { label, hide }) => {
      state.markerData[label].hidden = hide;
    },
  },
  actions: {
    focusMarkerByLabel: (context, markerLabel) => {
      context.commit('focusMarkerByLabel', markerLabel);
    },
    drawerOpen: (context, payload) => {
      context.commit('drawerOpen', payload);
    },
    mapUpdateData: async (context) => {
      const markerData = await api.getBoundingBox(context.state.map.bounds);
      context.commit('mapUpdateData', { markerData });
    },
    markerMatch: (context, target) => {
      console.log('enter with ', target);
      target = target ? target.toLowerCase() : null;
      Object.keys(context.state.markerData).forEach((label) => {
        context.commit('markerHide', {
          label,
          hide: target
            ? label.toLowerCase().indexOf(target) === -1
            : false
        });
      });
    },
  },
});
