<template>
  <l-control id="control-drawer" ref="drawer">
    <header v-on:mousedown.stop.prevent="close">
      <div id="handle"></div>
    </header>
    <h1>{{ title }}</h1>
    <div v-html="html"></div>
  </l-control>
</template>

<style scoped>
#control-drawer {
  --closed-height: 0rem;
  position: fixed;
  width: 100vw;
  height: var(--closed-height);
  transition: height 0.3s;
  bottom: 0;
  left: 0;
  background: var(--app-bg);
  color: var(--app-fg);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  transform-origin: bottom;
}
#control-drawer.open {
  height: 50vh;
  transition: height 0.3s;
}
header {
  height: var(--closed-height);
  min-height: var(--closed-height);
  max-height: var(--closed-height);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
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
import { LControl } from "vue2-leaflet";

export default {
  name: "ControlDrawer",
  components: {
    LControl,
  },

  props: ["show", "title", "html"],

  emit: ["drawerClosed"],

  data() {
    return {};
  },

  watch: {
    show(newValue) {
      if (newValue) {
        this.open();
      } else {
        this.close();
      }
    },
  },

  methods: {
    open: function () {
      this.$store.commit("drawerOpen");
      this.$refs.drawer.$el.classList.add("open");
    },
    close: function () {
      this.$store.commit("drawerClose");
      this.$refs.drawer.$el.classList.remove("open");
      this.$emit("drawerClosed");
    },
  },
};
</script>