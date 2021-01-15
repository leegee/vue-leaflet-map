<template>
  <div>
    <header>
      <h1>Search</h1>
    </header>
    <main>
      <table v:if="$store.state.markerData">
        <tr v-for="i in $store.state.markerData" v-bind:key="i">
          <th>{{ i.label }}</th>
          <td>{{ i.lat }}</td>
          <td>{{ i.lng }}</td>
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
.title {
  h1 {
    color: pink;
  }
  table {
    width: auto;
    margin: 0 auto;
  }
}
</style>
