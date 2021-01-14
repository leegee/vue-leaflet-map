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
        :title="drawerTitle"
        :html="drawerHtml"
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

const UPDATE_MS = false;

const _markersOnMap = {};

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
      drawerTitle: null,
      drawerHtml: null,
      drawerLat: null,
      drawerLng: null,
    };
  },

  computed: {
    markerData() {
      return this.$store.state.markerData;
    },
  },

  watch: {
    markerData(markerData) {
      this.updateMarkers(this, markerData);
    },
  },

  methods: {
    loadEnd() {
      console.log("AppMap.loadEnd");
      if (!UPDATE_MS) {
        this.updateBounds(this.$refs.map.mapObject.getBounds());
      } else {
        setInterval(
          () => this.updateBounds(this.$refs.map.mapObject.getBounds()),
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
      const markerData = await this.$store.dispatch("mapUpdateData", bounds);
      if (null !== markerData) {
        this.$store.markerData;
      }
    },
    updateZoom(zoom) {
      this.currentZoom = zoom;
    },
    updateCenter(center) {
      this.currentCenter = center;
    },

    showMarkerDetails(markerId) {
      this.$data.drawerTitle = _markersOnMap[markerId].options.fromApi.label;
      this.$data.drawerHtml = _markersOnMap[markerId].options.fromApi.html;
      this.$data.drawerShow = true;
    },

    drawerClosed() {
      this.$data.drawerShow = false;
    },

    updateMarkers: (self, markerData) => {
      // Drop old markers:
      // console.log("On map: ", Object.keys(_markersOnMap).join(", "));
      // console.log("New   : ", Object.keys(markerData).join(", "));

      Object.keys(markerData).forEach((markerId) => {
        // Update marker
        if (_markersOnMap.hasOwnProperty(markerId)) {
          // console.log("Update", markerId);
          _markersOnMap[markerId]
            .setLatLng([markerData[markerId].lat, markerData[markerId].lng])
            .update();
        }
        // New markers
        else {
          // console.log("New", markerId);
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
          ).on("click", () => self.showMarkerDetails(markerId));
          _markersOnMap[markerId].addTo(self.$refs.map.mapObject);
        }
      });

      Object.keys(_markersOnMap).forEach((mapMarkerId) => {
        // If its on the map but not in the current list, remove:
        if (!markerData.hasOwnProperty(mapMarkerId)) {
          // console.log("Drop mapMarkerId", mapMarkerId);
          self.$refs.map.mapObject.removeLayer(_markersOnMap[mapMarkerId]);
        }
      });
    },
  },
};
</script>