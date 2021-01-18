<template>
  <div>
    <main>
      <header>
        <nav>
          <router-link to="/">🗺</router-link>
          <router-link to="/search">🔍</router-link>
          <router-link to="/help">ℹ</router-link>
        </nav>
      </header>

      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
header nav {
  z-index: 99;
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: 12pt;
  background-color: white;
  box-shadow: 1px 2px gray;
  border-radius: 4pt;
}
header nav a {
  padding: 2pt;
  display: inline-block;
  text-decoration: none;
  margin: 2pt 8pt;
  border: 1px solid #4444;
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
  border-radius: 50%;
}
</style>

