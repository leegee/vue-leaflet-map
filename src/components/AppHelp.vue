<template>
  <div id="help" class="fullscreen">
    <header>
      <h1>
        About
        <router-link to="/" class="exit-fullscreen"></router-link>
      </h1>
    </header>
    <main>
      <component :is="componentLoader"></component>
    </main>
  </div>
</template>

<script>
export default {
  name: "AppHelp",

  computed: {
    componentLoader() {
      return () => import("@/apis/" + process.env.implementation + "/Help");
    },
  },
  mounted() {
    this.componentLoader().then((comp) => {
      this.component = () => this.componentLoader();
    });
  },
};
</script>

<style lang="scss" scoped>
#help {
  overflow: auto;
}
</style>
