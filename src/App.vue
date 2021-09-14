<template>
  <AppMap>
    <transition>
      <router-view></router-view>
    </transition>
  </AppMap>
</template>

<script type='application/javascript'>
import AppMap from "@/components/AppMap";

export default {
  components: {
    AppMap,
  },
};
</script>

<style>
.v-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.v-enter,
.fade-leave-to {
  opacity: 0;
}
</style>