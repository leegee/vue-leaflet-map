<template>
  <div class="row">
    <span>{{ rowData.ufo.shape }}</span>
    <span>{{ rowData.ufo.date_time }}</span>
    <span
      >{{ rowData.lat }}<br />
      {{ rowData.lng }}</span
    >
    <span>{{ rowData.ufo.city }}</span>
  </div>
</template>

<style scoped>
.row {
  border-bottom: 1px dotted var(--app-fg);
  margin-top: 4pt;
  margin-bottom: 4pt;
  width: 100%;
  display: flex;
}
span {
  width: calc(100% / 6);
  cursor: pointer;
  padding-right: 1em;
  font-size: 10pt;
}
span:last-child {
  padding-right: 0;
  align-self: stretch;
}
.hidden {
  display: none;
}
</style>

<script type='application/javascript'>
export default {
  name: "ItemInAppSearchTable",
  props: ["rowData"],
};
</script>

