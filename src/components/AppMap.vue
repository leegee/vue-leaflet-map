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
        type="OpenSky"
        :show="drawerShow"
        @drawerClosed="drawerClosed"
      />
    </l-map>
  </div>
</template>

<style>
#map-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.leaflet-control-attribution {
  position: fixed;
  top: 0;
  right: 0;
}

.leaflet-div-icon {
  background: unset;
  border: unset;
}

.marker-pin {
  background: transparent url("../images/icons/arrow-up.svg") center no-repeat;
  border: 2px solid black;
  color: black;
  border-radius: 50%;
  min-width: 24pt;
  min-height: 24pt;
}
</style>

<script>
import { mapState } from "vuex";

import { latLng, divIcon } from "leaflet";

import { LMap, LTileLayer, LMarker, LIcon, LTooltip } from "vue2-leaflet";

import ControlDrawer from "./controls/ControlDrawer";

const UPDATE_MS = 0; // 15000;

let _markersOnMap = {};

export default {
  name: "AppMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip,
    ControlDrawer,
  },
  data() {
    return {
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

  watch: {
    "$store.state.markerData": function () {
      this.updateMarkers(this, this.$store.state.markerData);
    },
  },

  methods: {
    loadEnd() {
      _markersOnMap = {};
      this.updateBounds(this.$refs.map.mapObject.getBounds());
      if (UPDATE_MS) {
        const self = this;
        setInterval(
          () => self.updateBounds(self.$refs.map.mapObject.getBounds()),
          UPDATE_MS
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
                  "deg)'></div>",
              }),
            }
          ).on("click", () => self.drawerOpen(markerId));
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

    drawerOpen(markerId) {
      this.$store.dispatch(
        "drawerOpen",
        _markersOnMap[markerId].options.fromApi
      );
      this.$data.drawerShow = true; // TODO use store
    },
  },
};
</script>