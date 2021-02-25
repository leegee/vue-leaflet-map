import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let api;

export function setApi(_api) {
  api = _api;
  store.state.map = Object.assign(store.state.map, api.initialState);
  console.log("Set initial state:", store.state);
}

export const store = new Vuex.Store({
  state: {
    drawer: {
      open: false,
      details: {},
    },
    markerData: {},
    user: {
      updateMs: 0,
    },
    map: {
      useDateFilter: false,
      showUndated: false,
      fromDate: new Date().getFullYear() - 1,
      toDate: new Date().getFullYear(),
      loadingApi: false,
      zoomLevelHideLabels: 7,
      updateMs: 60 * 1000,
      zoom: null,
      maxZoom: null,
      minZoom: null,
      center: null,
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
      state.drawer.details = payload.details;
      state.drawer.open = true;
      state.drawer.lastZoom = payload.zoom;
      state.drawer.lastCenter = payload.center;
    },
    mapUpdateData: (state, { markerData }) => {
      state.markerData = markerData;
    },
    loadingApi: (state, value) => {
      state.map.loadingApi = value;
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
    mapZoom: (state, zoom) => state.map.zoom = zoom,
    mapCenter: (state, center) => state.map.center = center,
    showUndated: (state, bool) => state.map.showUndated = bool,
    setDate: (state, year) => {
      console.log('** setDate', year);
      state.map.fromDate = state.map.toDate = year;
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
      context.commit('loadingApi', true);
      const markerData = await api.getBoundingBox({
        bounds: context.state.map.bounds,
        fromDate: context.state.map.fromDate,
        toDate: context.state.map.toDate,
        showUndated: context.state.map.showUndated,
      });
      context.commit('mapUpdateData', { markerData });
      context.commit('loadingApi', false);
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
