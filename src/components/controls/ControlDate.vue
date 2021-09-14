<template>
  <l-control id="control-date" ref="date">
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
        <input id="show" type="checkbox" @change="toggleShow" :checked="show" />
        Limit to
      </label>
    </span>
    <span v-show="show"> {{ year }} </span>
    <span>
      <select
        id="date"
        :disabled="!show"
        type="selet"
        min="1969"
        step="1"
        :max="max"
        :value="year"
        @change="changeRange($event.target.value)"
        :title="year"
      >
        <option v-for="i in years" :key="i" :seleted="i === year">
          {{ i }}
        </option>
      </select>
    </span>
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
#show {
  width: 1rem;
}
#date {
  font-size: 14pt;
}
label {
  background: white;
  color: black;
  padding: 2pt;
}
</style>

<script type='application/javascript'>
import { LControl } from "vue2-leaflet";

export default {
  name: "ControlDate",
  components: {
    LControl,
  },

  data() {
    const max = new Date().getFullYear();
    const years = Array.from(
      { length: max - 1969 + 1 },
      (_, index) => index + 1969
    );
    return {
      years,
      year: max,
      max,
      show: this.$store.state.map.useDateFilter,
      showUndated: this.$store.state.map.showUndated,
    };
  },

  methods: {
    toggleShow() {
      this.show = !this.show;
      this.$store.commit("setDate", this.show ? this.year : undefined);
      console.log("calling for an update", this.show);
      this.$store.dispatch("mapUpdateData");
    },
    toggleShowUndated() {
      this.showUndated = !this.showUndated;
      this.$store.commit("showUndated", this.showUndated);
      this.$store.dispatch("mapUpdateData");
    },
    changeRange(year) {
      this.year = year;
      this.$store.commit("setDate", year);
      this.$store.dispatch("mapUpdateData");
    },
  },
};
</script>