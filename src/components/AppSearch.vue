<template>
  <div id="search">
    <header>
      <h1>Search</h1>
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
#search {
  margin: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
</style>
