<template>
  <div class="app-control leaflet-control">
    <l-control id="control-date" ref="date">
      1969
      <input
        type="range"
        min="1968"
        step="1"
        :max="max"
        :value="max"
        @change="change($event.target.value)"
      />
      Now
    </l-control>
  </div>
</template>

<style scoped>
#control-date {
  position: fixed;
  bottom: 0;
  width: 50vw;
  left: 25vw;
  background: white;
  color: black;
  font-weight: normal;
  text-transform: capitalize;
  padding: 0.5rem;
}
#control-date input {
  width: 40vw;
  font-size: 14pt;
}
</style>

<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "ControlDate",
  components: {
    LControl,
  },
  data() {
    return {
      max: new Date().getFullYear(),
    };
  },
  methods: {
    change(value) {
      this.$store.commit("setDate", value === 1968 ? "0000" : value);
      this.$store.dispatch("mapUpdateData");
    },
  },
};
</script>