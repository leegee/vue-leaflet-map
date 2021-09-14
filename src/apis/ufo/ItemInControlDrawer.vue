<script type='application/javascript'>
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
            "Date: " +
              this.$store.state.drawer.details.ufo.date_time.substring(0, 10)
          ),

          createElement(
            "p",
            "Latitude, Longitude: " +
              this.$store.state.drawer.details.lat +
              ", " +
              this.$store.state.drawer.details.lng
          ),

          createElement("p", this.$store.state.drawer.details.ufo.stats),

          createElement("p", this.$store.state.drawer.details.ufo.text),
        ]);
  },
});
</script>