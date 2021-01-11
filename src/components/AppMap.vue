<template>
  <div id="map-container">
    <l-map
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 100%; width: 100%"
      @update:center="updateCenter"
      @update:zoom="updateZoom"
      @update:bounds="updateBounds"
      @leaflet:load="loadEnd"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <ControlDrawer />
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
</style>

<script>
import { debounce } from "debounce";
import { mapState } from "vuex";

import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";
import ControlDrawer from "./controls/ControlDrawer";

export default {
  name: "AppMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    ControlDrawer,
  },
  data() {
    return {
      zoom: 13,
      center: latLng(47.6008, 19.3605),
      url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "",
      currentZoom: 11.5,
      currentCenter: latLng(47.6008, 19.3605),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
    };
  },

  methods: {
    loadEnd() {
      this.$store.dispatch("mapUpdateData");
    },
    updateBounds(bounds) {
      this.currentBounds = bounds;
      this.$store.commit("mapUpdateBounds", {
        ne: bounds.getNorthEast(),
        sw: bounds.getSouthWest(),
      });
      this.$store.dispatch("mapUpdateData");
    },
    updateZoom(zoom) {
      this.currentZoom = zoom;
    },
    updateCenter(center) {
      this.currentCenter = center;
    },
  },
};
</script>