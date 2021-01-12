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
import { mapState } from "vuex";

import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";
import ControlDrawer from "./controls/ControlDrawer";

const _markers = {};

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
    };
  },

  computed: {
    markerData() {
      return this.$store.state.markerData;
    },
  },

  watch: {
    markerData(markerData) {
      if (markerData) {
        console.log(
          `%cmarkerData computed ${JSON.stringify(markerData)}`,
          "color:yellow"
        );
        this.updateMarkers(this, markerData);
      }
    },
  },

  methods: {
    loadEnd() {
      console.log("AppMap.loadEnd");
      this.updateBounds(this.$refs.map.mapObject.getBounds());
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

    updateMarkers: (self, markerData) => {
      console.log("***", this, self);
      Object.keys(markerData).forEach((markerId) => {
        if (_markers.hasOwnProperty(markerId)) {
          // Update marker
          // marker.setLatLng(e.latlng);
        } else {
          _markers[markerId] = markerData[markerId];
          const marker = new L.marker(
            {
              lat: markerData[markerId].lat,
              lng: markerData[markerId].lng,
            },
            {}
          );
          marker.addTo(self.$refs.map.mapObject);
        }
      });
    },
  },
};

/*
greenIcon = L.icon({
    iconUrl: 'leaf-green.png',
    shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
*/
</script>