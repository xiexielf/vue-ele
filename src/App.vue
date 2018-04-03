<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <nav class="border-bottom-1px">
      <div>
        <router-link to="/goods">商品</router-link>
      </div>
      <div>
        <router-link to="/ratings">评价</router-link>
      </div>
      <div>
        <router-link to="/sellers">商家</router-link>
      </div>
    </nav>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header.vue'

export default {
  name: 'App',
  components: {
    'v-header': header
  },
  data() {
    return {
      seller: {}
    }
  },
  created() {
    const self = this;
    this.$http.get('/api/sellers').then(response => {
      if (response.data.errno == 0) {
        self.seller = response.data.data
      }
    })
      .catch(error => {
        console.log(error)
      })
  },
  mounted() {

  }
}
</script>

<style lang="less" scoped>
@import 'commom/less/mixin.less';

#app {

  nav {
    display: flex;
    height: 40px;
    line-height: 40px;
    .border-bottom-1px(rgba(7, 17, 27, 0.1));

    >div {
      flex: 1;
      text-align: center;

      >a {
        display: block;
        height: 100%;
        font-size: 14px;
        line-height: 40px;
        color: rgb(77, 58, 93);

        &.link-active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
}
</style>
