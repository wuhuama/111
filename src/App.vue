<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/page">Page</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
#nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  z-index: 1;
  background: rgba(0,0,0,0.6);
  color: #fff;
  text-align: center;
  a {
    color: #fff;
  }
}
</style>
