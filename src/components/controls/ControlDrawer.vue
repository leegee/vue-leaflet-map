<template>
  <l-control id="control-drawer" ref="drawer">
    <header v-on:mousedown.stop.prevent="close">
      <div id="handle"></div>
      <h1>{{ $store.state.drawer.details.label }}</h1>
    </header>
    <main>
      <component :is="componentLoader"></component>
    </main>
  </l-control>
</template>

<style scoped>
#control-drawer {
  --header-height: 2rem;
  position: fixed;
  width: 100vw;
  height: 0;
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
  height: var(--header-height);
  min-height: var(--header-height);
  max-height: var(--header-height);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  text-align: center;
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
main {
  padding: 2rem;
  width: auto;
  margin: 0 auto;
}
</style>

<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "ControlDrawer",
  components: {
    LControl,
  },

  props: ["show", "type", "title"],

  emit: ["drawerClosed"],

  data() {
    return {};
  },

  watch: {
    show(newValue) {
      console.debug("newValue,this", newValue, this);
      if (newValue) {
        this.open();
      } else {
        this.close();
      }
    },
  },

  computed: {
    componentLoader() {
      return () =>
        import("@/apis/" + this.$props.type + "/ItemInControlDrawer");
    },
  },

  mounted() {
    this.componentLoader().then((comp) => {
      this.component = () => this.componentLoader();
    });
    // .catch(() => {
    // this.component = () => import("@/components/templates/Error");
    // });
  },
  methods: {
    open: function () {
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