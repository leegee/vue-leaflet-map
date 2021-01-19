<template>
  <div class="row">
    <span>{{ rowData.label }}</span>
    <span>{{ rowData.lat }}</span>
    <span>{{ rowData.lng }}</span>
    <span>{{ rowData.openskyState[2] }}</span>
  </div>
</template>

<style scoped>
.row {
  border-bottom: 1px dotted var(--app-fg);
  margin-top: 4pt;
  margin-bottom: 4pt;
  width: 100%;
}
span {
  display: inline-block;
  width: 20%;
}
.hidden {
  display: none;
}
</style>

<script>
export default {
  name: "ItemInAppSearchTable",
  props: ["rowData"],
};
</script>

