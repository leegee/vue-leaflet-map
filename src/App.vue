<template>
  <header>
    <nav>
      <router-link to="/"> Home </router-link> |
      <router-link to="/help"> Help </router-link>
      <router-view />
    </nav>
  </header>
</template>

<style scoped>
header nav {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
}
</style>