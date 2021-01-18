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
      <l-tile-layer :url="url" :attribution="attribution" />

      <ControlDrawer
        ref="controlDrawer"
        :show="drawerShow"
        @drawerClosed="drawerClosed"
      />

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
  position: fixed;
  bottom: 0;
  right: 0;
  display: none;
}

.leaflet-div-icon {
  background: unset;
  border: unset;
}
</style>

<script>
import { latLng, divIcon, latLngBounds } from "leaflet";

import { LMap, LTileLayer, LControl } from "vue2-leaflet";

import ControlDrawer from "./controls/ControlDrawer";

let _markersOnMap = {};

export default {
  name: "AppMap",
  components: {
    LMap,
    LTileLayer,
    ControlDrawer,
    LControl,
  },
  data() {
    return {
      userMarker: null, // State from browser, not Vuex
      leafletMapOptions: {},
      zoom: 8,
      url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "",
      currentZoom: 8,
      center: latLng(47.6008, 19.3605),
      currentCenter: latLng(47.6008, 19.3605),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
      drawerShow: false,
    };
  },

  mounted() {
    if (navigator.geolocation) {
      this.focusUser();
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
      this.updateBounds(this.$refs.map.mapObject.getBounds());
      if (this.$store.state.map.updateMs) {
        const self = this;
        setInterval(
          () => self.updateBounds(self.$refs.map.mapObject.getBounds()),
          this.$store.state.map.updateMs
        );
      }
    },
    async updateBounds(bounds) {
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
      this.currentZoom = zoom;
    },
    updateCenter(center) {
      this.currentCenter = center;
    },

    drawerClosed() {
      this.$data.drawerShow = false;
    },

    updateMarkers: (self, markerData) => {
      // Drop old markers:
      // console.debug("On map: ", Object.keys(_markersOnMap).join(", "));
      // console.debug("New   : ", Object.keys(markerData).join(", "));

      if (!markerData) {
        return;
      }

      Object.keys(markerData).forEach((markerId) => {
        // Update marker
        if (_markersOnMap.hasOwnProperty(markerId)) {
          // console.debug("Update", markerId);
          _markersOnMap[markerId]
            .setLatLng([markerData[markerId].lat, markerData[markerId].lng])
            .update();
        }
        // New markers
        else {
          // console.debug("New", markerId);
          _markersOnMap[markerId] = new L.marker(
            {
              lat: markerData[markerId].lat,
              lng: markerData[markerId].lng,
            },
            {
              fromApi: markerData[markerId],
              icon: divIcon({
                html:
                  "<div class='marker-pin' style='transform: rotate(" +
                  markerData[markerId].rotate +
                  "deg)'></div><div class='marker-label'>" +
                  markerData[markerId].label +
                  "</div>",
              }),
            }
          ).on("click", (e) => self.drawerOpen(markerId, e));
          _markersOnMap[markerId].addTo(self.$refs.map.mapObject);
        }
      });

      Object.keys(_markersOnMap).forEach((mapMarkerId) => {
        // If its on the map but not in the current list, remove:
        if (!markerData.hasOwnProperty(mapMarkerId)) {
          // console.debug("Drop mapMarkerId", mapMarkerId);
          self.$refs.map.mapObject.removeLayer(_markersOnMap[mapMarkerId]);
        }
      });
    },

    drawerOpen(markerId, e) {
      this.$store.dispatch(
        "drawerOpen",
        _markersOnMap[markerId].options.fromApi
      );
      this.$data.drawerShow = true; // TODO use store
      this.$refs.map.mapObject.setZoom(14);
      const latLng = _markersOnMap[markerId].getLatLng();
      this.$refs.map.mapObject.panTo([latLng.lat - 0.009, latLng.lng]);
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
            lat: position.latitude,
            lng: position.longitude,
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