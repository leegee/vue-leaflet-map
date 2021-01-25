<template>
  <l-control id="control-drawer" ref="drawer">
    <header>
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
  background: var(--app-bg);
  color: var(--app-fg);
  position: fixed;
}
@media (orientation: landscape) {
  #control-drawer {
    width: 35%;
    left: -35%;
    transition: left 0.3s;
    height: 100%;
    top: 0;
    transform-origin: left;
    margin: 1rem;
    margin: 0;
  }
  #control-drawer.open {
    left: 0;
    transition: left 0.3s;
  }
}

@media (orientation: portrait) {
  #control-drawer {
    width: 100vw;
    height: 0;
    transition: height 0.3s;
    bottom: 0;
    left: 0;
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
  main {
    padding: 2rem;
    width: auto;
    margin: 0 auto;
    overflow: auto;
    height: 100%;
  }
}
</style>

<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "ControlDrawer",
  components: {
    LControl,
  },

  props: ["show", "title"],

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

  computed: {
    componentLoader() {
      return () =>
        import("@/apis/" + process.env.implementation + "/ItemInControlDrawer");
    },
  },
  mounted() {
    this.componentLoader().then((comp) => {
      this.component = () => this.componentLoader();
    });
  },

  methods: {
    open: function () {
      this.$refs.drawer.$el.classList.add("open");
    },
    close: function () {
      // this.$store.commit("drawerClose");
      this.$refs.drawer.$el.classList.remove("open");
      this.$emit("drawerClosed");
    },
  },
};
</script>