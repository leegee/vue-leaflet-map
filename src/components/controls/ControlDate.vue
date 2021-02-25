<template>
  <l-control id="control-date" ref="date">
    <div id="current-date">
      <span>
        <label>
          <input
            id="showUndated"
            type="checkbox"
            @change="toggleShowUndated"
            :checked="showUndated"
          />
          Include undated
        </label>
        <label>
          <input
            id="show"
            type="checkbox"
            @change="toggleShow"
            :checked="show"
          />
          Limit to
        </label>
      </span>
      <span v-show="show"> {{ value }} </span>
    </div>
    <label>1969</label>
    <input
      id="date"
      :disabled="!show"
      type="range"
      min="1969"
      step="1"
      :max="max"
      :value="value"
      @change="changeRange($event.target.value)"
      :title="value"
    />
    <label>Now</label>
  </l-control>
</template>

<style scoped>
#control-date {
  position: fixed;
  bottom: 0;
  width: 50vw;
  left: 25vw;
  font-weight: normal;
  text-transform: capitalize;
  padding: 0.5rem;
  padding-bottom: 0;
  background: #fff8;
  border-radius: 4pt;
}
#control-date * {
  border-radius: 4pt;
}
#current-date {
  background: white;
  color: black;
  width: 100%;
  text-align: center;
}
#show {
  width: 1rem;
}
#date {
  width: 40vw;
  font-size: 14pt;
}
label {
  background: white;
  color: black;
  padding: 2pt;
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
      value: new Date().getFullYear(),
      max: new Date().getFullYear(),
      show: this.$store.state.map.useDateFilter,
      showUndated: this.$store.state.map.showUndated,
    };
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
      this.$store.commit("setDate", undefined);
      this.$store.dispatch("mapUpdateData");
    },
    toggleShowUndated() {
      this.showUndated = !this.showUndated;
      this.$store.commit("showUndated", this.showUndated);
      this.$store.dispatch("mapUpdateData");
    },
    changeRange(value) {
      this.value = value;
      this.$store.commit("setDate", value);
      this.$store.dispatch("mapUpdateData");
    },
  },
};
</script>