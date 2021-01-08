<template>
  <l-control id="control-drawer" ref="drawer">
    <header v-on:mousedown.stop.prevent="open">
      <div id="handle"></div>
    </header>
  </l-control>
</template>

<style scoped>
#control-drawer {
  --closed-height: 2rem;
  position: fixed;
  width: 100vw;
  height: var(--closed-height);
  max-height: var(--closed-height);
  bottom: 0;
  left: 0;
  background: var(--app-bg);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  transform-origin: bottom;
  transition: max-height 0.3s;
}
#control-drawer.open {
  height: 90vh;
  max-height: 90vh;
  transition: max-height 0.3s;
}
header {
  height: var(--closed-height);
  min-height: var(--closed-height);
  max-height: var(--closed-height);
}
#handle {
  opacity: 0.5;
  background: var(--app-bg);
  border: 1pt solid var(--app-fg);
  text-align: center;
  padding: 1pt;
  margin: 2pt;
  max-height: 1pt;
  border-radius: 4pt;
  margin-left: 30vw;
  width: 40vw;
}
</style>

<script>
import { latLng } from "leaflet";
import { LControl } from "vue2-leaflet";

export default {
  name: "ControlDrawer",
  components: {
    LControl,
  },
  data() {
    return {};
  },
  methods: {
    open: function () {
      if (this.$store.state.drawer.open) {
        this.$store.commit("drawerClose");
        this.$refs.drawer.$el.classList.remove("open");
      } else {
        this.$store.commit("drawerOpen");
        console.log(this.$refs);
        this.$refs.drawer.$el.classList.add("open");
      }
    },
  },
};
</script>