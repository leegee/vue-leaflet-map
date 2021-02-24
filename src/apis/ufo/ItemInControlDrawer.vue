<script>
import Vue from "vue";

export default Vue.component("ItemInControlDrawer", {
  data: () => {
    return {};
  },
  render: function (createElement) {
    return !this.$store.state.drawer.details.ufo
      ? ""
      : createElement("div", [
          createElement(
            "p",
            "Date: " + this.$store.state.drawer.details.ufo.date_time
          ),

          createElement(
            "p",
            "Position: " +
              this.$store.state.drawer.details.lat +
              ", " +
              this.$store.state.drawer.details.lng
          ),

          createElement(
            "p",
            "Shape: " + this.$store.state.drawer.details.ufo.shape
          ),

          createElement("p", this.$store.state.drawer.details.ufo.stats),

          createElement("p", this.$store.state.drawer.details.ufo.text),
        ]);
  },
});
</script>