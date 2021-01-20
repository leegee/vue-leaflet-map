<template>
  <div id="map-container">
    <l-map
      ref="map"
      :zoom="zoom"
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

      <ControlDrawer
        ref="controlDrawer"
        :show="drawerShow"
        @drawerClosed="drawerClosed"
      />

      <!-- <l-control-layers position="topright"></l-control-layers> -->

      <l-control position="bottomleft">
        <button @click="focusUser(17)">⌂</button>
      </l-control>
    </l-map>
    <slot></slot>
  </div>
</template>

<style>
#map-container {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#focusUserButton {
  font-size: 14pt;
  font-weight: 900;
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
</style>

<script>
import { latLng, divIcon, latLngBounds, layerGroup, control } from "leaflet";
import { LMap, LTileLayer, LControl, LControlLayers } from "vue2-leaflet";
import { debounce } from "debounce";
import ControlDrawer from "./controls/ControlDrawer";

let MarkersOnMap = {};
let LayersOnMap = {};
let LayerNames = [];
let ControlLayers;

export default {
  name: "AppMap",
  components: {
    LMap,
    LTileLayer,
    ControlDrawer,
    LControl,
    LControlLayers,
  },
  data() {
    return {
      userMarker: null, // State from browser, not Vuex
      zoom: 8,
      url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "",
      center: latLng(47.6008, 19.3605),
      showParagraph: false,
      leafletMapOptions: {},
      mapOptions: {
        zoomSnap: 0.5,
      },
      drawerShow: false,
    };
  },

  mounted() {
    ControlLayers = control.layers(null);
    ControlLayers.addTo(this.$refs.map.mapObject);

    if (navigator.geolocation) {
      this.focusUser(8);
      this.setUserMarker();
      setInterval(() => this.updateUser(), this.$store.state.user.updateMs);
    } else {
      this.$refs.focusUserButton.style.display = "none";
    }
  },

  watch: {
    "$store.state.markerData": function () {
      this.updateMarkers(this, this.$store.state.markerData);
    },
    "$store.state.map.focusMarkerLabel": function () {
      this.focusMarker(this, this.$store.state.map.focusMarkerLabel);
    },
  },

  methods: {
    loadEnd() {
      if (this.$store.state.map.updateMs) {
        const self = this;
        setInterval(
          () => self.updateBounds(self.$refs.map.mapObject.getBounds()),
          this.$store.state.map.updateMs
        );
      }
    },

    updateBounds: debounce(
      function (e) {
        this._updateBounds(e);
      },
      1000,
      true
    ),

    async _updateBounds(bounds) {
      console.log("AppMap.updateBounds: ", bounds);
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
      this.$store.commit("mapZoom", zoom);
    },
    updateCenter(center) {
      this.$store.commit("mapCenter", center);
    },

    /* Easier in code than markup */
    updateMarkers: (self, markerData) => {
      // console.debug("On map: ", Object.keys(MarkersOnMap).join(", "));
      // console.debug("New   : ", Object.keys(markerData).join(", "));

      if (!markerData) {
        markerData = {};
      }

      Object.keys(markerData).forEach((markerId) => {
        // Update marker
        if (MarkersOnMap.hasOwnProperty(markerId)) {
          // console.debug("Update", markerId);
          MarkersOnMap[markerId]
            .setLatLng([markerData[markerId].lat, markerData[markerId].lng])
            .update();
        }
        // New markers
        else {
          // console.debug("New", markerId);

          MarkersOnMap[markerId] = new L.marker(
            {
              lat: markerData[markerId].lat,
              lng: markerData[markerId].lng,
            },
            {
              fromApi: markerData[markerId],
              icon: divIcon({
                html:
                  "<div class='marker-pin " +
                  (markerData[markerId].class || "") +
                  "' style='transform: rotate(" +
                  markerData[markerId].rotate +
                  "deg)'></div><div class='marker-label'>" +
                  markerData[markerId].label +
                  "</div>",
              }),
            }
          ).on("click", (e) => self.drawerOpen(markerId, e));

          if (-1 === LayerNames.indexOf(markerData[markerId].layer)) {
            LayerNames.push(markerData[markerId].layer);
            LayersOnMap[markerData[markerId].layer] = layerGroup();
            LayersOnMap[markerData[markerId].layer].addTo(
              self.$refs.map.mapObject
            );
            ControlLayers.addOverlay(
              LayersOnMap[markerData[markerId].layer],
              markerData[markerId].layer
            );
          }

          MarkersOnMap[markerId].addTo(LayersOnMap[markerData[markerId].layer]);
        }
      });

      // If marker on the map but not in the current list, remove:
      Object.keys(MarkersOnMap).forEach((mapMarkerId) => {
        if (!markerData.hasOwnProperty(mapMarkerId)) {
          // console.debug("Drop mapMarkerId", mapMarkerId);
          LayersOnMap[
            MarkersOnMap[mapMarkerId].options.fromApi.layer
          ].removeLayer(MarkersOnMap[mapMarkerId]);
        }
      });

      // Remove unused control layers:
      Object.keys(LayersOnMap).forEach((layerName) => {
        if (Object.keys(LayersOnMap[layerName]._layers).length === 0) {
          // console.debug("Drop layer", layerName);
          self.$refs.map.mapObject.removeLayer(LayersOnMap[layerName]);
        }
      });
    },

    drawerOpen(markerId, e) {
      this.$store.dispatch(
        "drawerOpen",
        MarkersOnMap[markerId].options.fromApi
      );
      this.$data.drawerShow = true; // TODO use store
      this.$refs.map.mapObject.setZoom(14);
      const latLng = MarkersOnMap[markerId].getLatLng();
      this.$refs.map.mapObject.panTo([latLng.lat - 0.009, latLng.lng]);
    },

    drawerClosed() {
      this.$data.drawerShow = false;
      this.$refs.map.mapObject.setZoom(this.$store.state.drawer.lastZoom);
      this.$refs.map.mapObject.panTo(this.$store.state.drawer.lastCenter);
    },

    focusMarker(self, label) {
      this.drawerOpen(label);
    },

    focusUser(zoom = 16) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.$refs.map.mapObject.setZoom(zoom);
        this.$refs.map.mapObject.panTo([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    },

    updateUser() {
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