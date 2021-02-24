<template>
  <div id="map-container">
    <l-map
      ref="map"
      :zoom="zoom"
      :maxZoom="maxZoom"
      :minZoom="minZoom"
      :center="center"
      :options="mapOptions"
      style="height: 100%; width: 100%"
      @update:center="updateCenter"
      @update:zoom="updateZoom"
      @update:bounds="updateBounds"
      @leaflet:load="loadEnd"
      @click="drawerClosed"
    >
      <l-tile-layer :url="url" :attribution="attribution" ref="tileLayer" />
      <v-marker-cluster ref="clusterRef"></v-marker-cluster>

      <ControlDrawer ref="controlDrawer" :show="$store.state.drawer.open" />

      <l-control position="bottomleft">
        <div class="app-control leaflet-control">
          <router-link to="/search"
            ><button class="leaflet-control">🔍</button></router-link
          >
          <router-link to="/help"
            ><button class="leaflet-control">ℹ</button></router-link
          >
        </div>
      </l-control>

      <l-control position="bottomright">
        <div class="app-control leaflet-control">
          <button
            id="focusUserButton"
            class="leaflet-control"
            @click="focusUser(17)"
          >
            ⌂
          </button>
        </div>
      </l-control>

      <l-control position="topleft" v-show="$store.state.map.loadingApi">
        <div id="loading-api" class="app-control leaflet-control">
          Loading...
        </div>
      </l-control>
    </l-map>
    <slot></slot>
  </div>
</template>

<style>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

#map-container {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.leaflet-control-attribution {
  display: none;
}

.leaflet-div-icon {
  background: unset;
  border: unset;
}

.user-marker-pin {
  width: 1em;
  height: 1em;
  display: inline-block;
}

.user-marker-pin:after {
  content: "ME";
}

.app-control {
  background: white;
  border-radius: 2pt;
}
.leaflet-control {
  font-size: 12pt;
  font-weight: 900;
  border: none;
}
.app-control.leaflet-control {
  margin: 0;
  display: flex;
}
.app-control.leaflet-control button.leaflet-control {
  background: white !important;
  overflow: hidden;
  padding: 4pt;
  margin: 4pt;
  text-align: center;
}

.leaflet-control-layers-list {
  font-weight: normal;
  overflow: scroll;
  max-height: 90%;
}

#loading-api {
  position: fixed;
  top: 1rem;
  left: 50%;
  background: orange;
  color: white;
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  border-radius: 4pt;
  border: 1pt solid black;
}
</style>

<script>
import { latLng, divIcon, layerGroup, control, circleMarker } from "leaflet";
import { LMap, LTileLayer, LControl, LControlLayers } from "vue2-leaflet";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import "leaflet.markercluster.layersupport";

import { debounce } from "debounce";

import ControlDrawer from "./controls/ControlDrawer";

let MarkersOnMap = {};
let LayersOnMap = {};
let LayerNames = {};
let ControlLayers;
let Clusters;

export default {
  name: "AppMap",
  components: {
    LMap,
    LTileLayer,
    ControlDrawer,
    LControl,
    LControlLayers,
    "v-marker-cluster": Vue2LeafletMarkerCluster,
  },
  data() {
    return {
      zoom: this.$store.state.map.zoom || 8,
      minZoom: this.$store.state.map.minZoom || 1,
      maxZoom: this.$store.state.map.maxZoom || 16,
      center: this.$store.state.map.center || latLng(47.600773, 19.360543),
      mapOptions: {
        zoomSnap: 0.5,
      },
      leafletMapOptions: {},
      userMarker: null, // State from browser, not Vuex
      url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "",
      showParagraph: false,
      highlightMarker: false,
    };
  },

  props: {
    clustered: {
      type: Boolean,
      default: true,
    },
  },

  mounted() {
    ControlLayers = control.layers(null);
    ControlLayers.addTo(this.$refs.map.mapObject);
    if (!navigator.geolocation) {
      this.$refs.focusUserButton.style.display = "none";
    }
    Clusters = L.markerClusterGroup.layerSupport();
    Clusters.addTo(this.$refs.map.mapObject);
  },

  watch: {
    "$store.state.markerData": function (value) {
      this.updateMarkers(this, value);
    },
    "$store.state.map.focusMarkerLabel": function (value) {
      this.focusMarker(value);
    },
  },

  methods: {
    loadEnd() {
      if (this.$store.state.map.updateMs) {
        const self = this;
        setInterval(() => self.updateBounds(), this.$store.state.map.updateMs);
      }
      this.updateBounds();
    },

    updateBounds: debounce(
      function () {
        this._updateBounds();
      },
      1000,
      true
    ),

    async _updateBounds() {
      // Edge, probably HMR-related:
      if (!this.$refs.map.mapObject) {
        return;
      }

      const bounds = this.$refs.map.mapObject.getBounds();
      console.log(
        "AppMap.updateBounds (%s): ",
        this.$data.allowUpdates,
        bounds
      );
      this.$store.commit("mapUpdateBounds", {
        ne: bounds.getNorthEast(),
        sw: bounds.getSouthWest(),
      });
      try {
        this.$store.dispatch("mapUpdateData", bounds);
      } catch (e) {
        this.$emit("error", e);
      }
    },

    updateZoom(zoom) {
      console.log("Zoom level: ", zoom);
      this.$store.commit("mapZoom", zoom);
    },

    updateCenter(center) {
      this.$store.commit("mapCenter", center);
    },

    /* Easier in code than markup */
    updateMarkers: (self, newMarkerData) => {
      newMarkerData = newMarkerData || {};

      console.debug(
        "ENTER on map: %d, new: %d",
        Object.keys(MarkersOnMap).length,
        Object.keys(newMarkerData).length
      );

      Object.keys(newMarkerData).forEach((markerId) => {
        // Update marker
        if (MarkersOnMap.hasOwnProperty(markerId)) {
          console.debug("Update", markerId);
          MarkersOnMap[markerId]
            .setLatLng([
              newMarkerData[markerId].lat,
              newMarkerData[markerId].lng,
            ])
            .update();
        }

        // New markers
        else {
          console.debug("New", markerId);

          MarkersOnMap[markerId] = new L.marker(
            {
              lat: newMarkerData[markerId].lat,
              lng: newMarkerData[markerId].lng,
            },
            {
              fromApi: newMarkerData[markerId],
              icon: divIcon({
                html:
                  "<div class='marker-pin " +
                  (newMarkerData[markerId].htmlClass || "") +
                  "' style='transform: rotate(" +
                  newMarkerData[markerId].rotate +
                  "deg)'></div>" +
                  "<div class='marker-label'>" +
                  newMarkerData[markerId].label +
                  "</div>",
              }),
            }
          ).on("click", () => self.drawerOpen(markerId));

          if (!LayerNames.hasOwnProperty(newMarkerData[markerId].layer)) {
            console.debug("\tcreate layer for", newMarkerData[markerId].layer);
            LayerNames[newMarkerData[markerId].layer] = true;
            LayersOnMap[newMarkerData[markerId].layer] = layerGroup(); // .layerSupport();

            if (self.clustered) {
              Clusters.addLayer(LayersOnMap[newMarkerData[markerId].layer]);
            } else {
              LayersOnMap[newMarkerData[markerId].layer].addTo(
                self.$refs.map.mapObject
              );
            }

            ControlLayers.addOverlay(
              LayersOnMap[newMarkerData[markerId].layer],
              newMarkerData[markerId].layer
            );
          }

          console.debug("\tadd marker to layer", newMarkerData[markerId].layer);
          MarkersOnMap[markerId].addTo(
            LayersOnMap[newMarkerData[markerId].layer]
          );
        }
      });

      // If marker on the map but not in the current list, remove:
      Object.keys(MarkersOnMap).forEach((markerId) => {
        if (!newMarkerData.hasOwnProperty(markerId)) {
          console.debug(
            "Drop markerId %s from layer %s",
            markerId,
            MarkersOnMap[markerId].options.fromApi.layer
          );
          LayersOnMap[MarkersOnMap[markerId].options.fromApi.layer].removeLayer(
            MarkersOnMap[markerId]
          );
          delete LayerNames[MarkersOnMap[markerId].options.fromApi.layer];
          delete MarkersOnMap[markerId];
        }
      });

      // Remove unused layers and control layers:
      Object.keys(LayersOnMap).forEach((layerName) => {
        if (Object.keys(LayersOnMap[layerName]._layers).length === 0) {
          console.debug("\tdrop layer", layerName);

          if (self.clustered) {
            Clusters.removeLayer(LayersOnMap[layerName]);
            self.$refs.map.mapObject.removeLayer(LayersOnMap[layerName]);
          } else {
            self.$refs.map.mapObject.removeLayer(LayersOnMap[layerName]);
          }

          ControlLayers.removeLayer(LayersOnMap[layerName]);
          delete LayersOnMap[layerName];
        }
      });

      console.debug("LEAVE on map: %d", Object.keys(MarkersOnMap).length);
    },

    drawerOpen(markerId) {
      if (this.$store.state.drawer.open) {
        return;
      }

      const latLng = MarkersOnMap[markerId].getLatLng();
      this.$data.highlightMarker = circleMarker(latLng);
      this.$data.highlightMarker.addTo(this.$refs.map.mapObject);

      document.querySelector(".leaflet-bottom.leaflet-left").style.display =
        "none";
      document.querySelector(".leaflet-bottom.leaflet-right").style.display =
        "none";

      this.$store.dispatch("drawerOpen", {
        details: MarkersOnMap[markerId].options.fromApi,
        center: this.$refs.map.mapObject.getCenter(),
        zoom: this.$refs.map.mapObject.getZoom(),
      });

      this.$refs.map.mapObject.setZoom(13);
      this.$refs.map.mapObject.panTo([latLng.lat - 0.009, latLng.lng]);

      MarkersOnMap[markerId].update();
    },

    drawerClosed() {
      if (this.$store.state.drawer.open) {
        document.querySelector(".leaflet-bottom.leaflet-left").style.display =
          "block";
        document.querySelector(".leaflet-bottom.leaflet-right").style.display =
          "block";
        this.$refs.map.mapObject.removeLayer(this.$data.highlightMarker);
        this.$data.highlightMarker = false;
        this.$refs.map.mapObject.setZoom(this.$store.state.drawer.lastZoom);
        this.$refs.map.mapObject.panTo(this.$store.state.drawer.lastCenter);
        this.$store.commit("drawerClose");
      }
    },

    focusMarker(label) {
      this.drawerOpen(label);
    },

    focusUser(zoom) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.$refs.map.mapObject.setZoom(zoom || this.maxZoom);
        this.$refs.map.mapObject.panTo([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    },

    updateUser() {
      // Leaflet has a .locate()
      navigator.geolocation.getCurrentPosition((position) => {
        this.userMarker
          .setLatLng([position.coords.latitude, position.coords.longitude])
          .update();
      });
    },

    setUserMarker() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userMarker = new L.marker(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          {
            icon: divIcon({
              html: "<div class='user-marker-pin'></div>",
            }),
          }
        ).on("click", (e) => this.drawerOpen(markerId, e));
        this.userMarker.addTo(this.$refs.map.mapObject);
      });
    },
  },
};
</script>