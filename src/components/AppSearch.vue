<template>
  <div id="search" class="fullscreen">
    <header>
      <h1>
        Search
        <router-link to="/" class="exit-fullscreen"></router-link>
      </h1>
    </header>
    <main>
      <div class="table" v:if="$store.state.markerData">
        <div
          class="row"
          v-for="row in $store.state.markerData"
          v-bind:key="row.label"
        >
          <component :is="componentLoader" :rowData="row"></component>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.table,
.row {
  width: 100%;
  border-collapse: collapse;
}
</style>

<script>
export default {
  name: "AppSearch",

  computed: {
    componentLoader() {
      return () =>
        import(
          "@/apis/" + process.env.implementation + "/ItemInAppSearchTable"
        );
    },
  },

  mounted() {
    this.componentLoader().then((comp) => {
      this.component = () => this.componentLoader();
    });
  },
};
</script>

