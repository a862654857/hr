<!--
 * @Author: your name
 * @Date: 2020-04-13 15:59:01
 * @LastEditTime: 2020-04-13 19:09:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vueTest\houtai\src\components\nav-top.vue
 -->
<style scoped>
.el-aside {
  width: 100% !important;
}
.shousuo {
  height: 30px;
  width: 100%;
  text-align: center;
}
.shousuo i {
  font-size: 30px;
  line-height: 30px;
}
/* .el-submenu{
  display: block !important;
} */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

<template>
  <div>
    <el-aside>
      <div class="shousuo">
        <i
          class="el-icon-s-fold"
          @click="isCollapsechange"
          v-if="!isCollapse"
        ></i>
        <i
          class="el-icon-s-unfold"
          v-if="isCollapse"
          @click="isCollapsechange"
        ></i>
      </div>
      <el-menu
        :collapse="isCollapse"
        :router="true"
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :unique-opened="true"
      >
        <el-menu-item index="/">
          <i class="iconfont icon-zhuye"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="iconfont icon-shenpi2"></i>
            <span slot="title">审批</span>
          </template>
          <el-menu-item index="/audit/consumables_order">耗材审批</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="iconfont icon-ziliaoguanli"></i>
            <span slot="title">资料管理</span>
          </template>
          <el-submenu index="3">
            <span slot="title">耗材管理</span>
            <el-menu-item index="/data_management/consumables/consumables_data_management"
              >耗材基础资料管理</el-menu-item
            >
            <el-menu-item index="/data_management/consumables/consumables_inventory">耗材库存</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    isCollapsechange() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    //跳转到某个导航页
    goPage(link) {
      if (link === "home") {
        $this.$router.push("/").catch((error) => error);
      } else if ((link = "order")) {
        $this.$router.push("/order").catch((error) => error);
      }
    },
  },
};
</script>