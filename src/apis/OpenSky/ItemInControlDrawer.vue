<script>
import Vue from "vue";

export default Vue.component("ItemInControlDrawer", {
  data: () => {
    return {};
  },
  render: function (createElement) {
    console.log("ItemInControlDrawer.render", this.$store.state.drawer);

    return !this.$store.state.drawer.details.openskyState
      ? ""
      : createElement("div", [
          createElement(
            "p",
            "Country: " + this.$store.state.drawer.details.openskyState[2]
          ),

          createElement(
            "p",
            "Special Purpose Flight: " +
              (this.$store.state.drawer.details.openskyState[15] ? "YES" : "no")
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
            "Tracking Degrees: " +
              (this.$store.state.drawer.details.openskyState[10] || "unknown")
          ),
          createElement(
            "p",
            "Velocity: " +
              (this.$store.state.drawer.details.openskyState[9] || "unknown")
          ),
          createElement(
            "p",
            "Vertical Rate: " +
              (this.$store.state.drawer.details.openskyState[11] || "unknown")
          ),
        ]);
  },
});

/*
Sample response `state`: openskyState
[
  0 "4bc842",      transponder
  1 "PGT1182 ",    callsign
  2 "Turkey",      countryName
  3 1610462739,    timePosition
  4 1610462739,    timeGeneral
  5 18.923,        lngOrNull
  6 46.8895,       latOrNull
  7 11262.36,      altBarometricOrNull
  8 false,         fromSurfaceBool
  9 235.51,        velocityMsOrNull
 10 125.22,        trackingDegreesOrNull
 11 -0.65,         verticalRateMsOrNull
 12 null,          recieverIdsOrNull
 13 11026.14,      altGeometricOrNull
 14 "1160",        squarkOrNull
 15 false,         specialPurposeBool
 16 0              posSource
],
*/
</script>

