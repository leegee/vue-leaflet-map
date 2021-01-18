<template>
  <div id="search" class="fullscreen">
    <header>
      <h1>
        Search
        <router-link to="/" class="exit-fullscreen"></router-link>
      </h1>
    </header>
    <main>
      <table v:if="$store.state.markerData">
        <tr v-for="i in $store.state.markerData" v-bind:key="i.label">
          <th>{{ i.label }}</th>
          <td>{{ i.lat }}</td>
          <td>{{ i.lng }}</td>
          <td>{{ i.openskyState[2] }}</td>
        </tr>
      </table>
    </main>
  </div>
</template>

<script>
export default {
  name: "AppSearch",
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
</style>
