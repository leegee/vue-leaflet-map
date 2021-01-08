<template>
  <main>
    <header>
      <nav>
        <router-link to="/"> Home </router-link> |
        <router-link to="/help"> Help </router-link>
      </nav>
    </header>

    <router-view></router-view />
  </main>
</template>

<style scoped>
header nav {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
}
</style>