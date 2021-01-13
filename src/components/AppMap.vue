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

.leaflet-div-icon {
  background: unset;
  border: unset;
}

.marker-pin {
  background: transparent url("../images/icons/arrow-up.svg") no-repeat center;
  border: 1pt solid red;
  border-radius: 50%;
  min-width: 24pt;
  min-height: 24pt;
}
</style>

<script>
import { mapState } from "vuex";

import { latLng, divIcon } from "leaflet";

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LIcon,
  LTooltip,
} from "vue2-leaflet";

import ControlDrawer from "./controls/ControlDrawer";

const _markers = {};

export default {
  name: "AppMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
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
            {
              icon: divIcon({
                // shadowUrl: "leaf-shadow.png",
                // iconUrl: "/assets/icons/arrow-up.svg",
                html:
                  "<div class='marker-pin' style='transform: rotate(" +
                  markerData[markerId].rotate +
                  "deg)'></div>",
                iconSize: [20, 20], // size of the icon
                shadowSize: [0, 0], // size of the shadow
                iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 0], // the same for the shadow
                popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
              }),
            }
          );
          marker.addTo(self.$refs.map.mapObject);
        }
      });
    },
  },
};
</script>