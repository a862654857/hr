<!--
 * @Author: your name
 * @Date: 2020-04-13 10:56:45
 * @LastEditTime: 2020-04-13 18:57:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vueTest\houtai\src\page\layout.vue
 -->
<style>
.el-main {
  background-color: #f5f7f9;
}
.el-card__body{
  padding-top: 0;
}
.el-breadcrumb{
margin-bottom: 20px;
}

.el-header,
.el-footer {
  background-color: white;
  box-sizing: border-box;
  border-bottom: 1px solid #f5f1f1;
}

.el-container {
  height: 100%;
}

</style>

 <template>
  <el-container>
    <!-- header部分 -->
    <el-header>
      <navtop></navtop>
    </el-header>
    <el-container>
      <!-- aside部分 -->
      <leftNav></leftNav>
      <el-main>
        <el-card class="box-card">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <template v-for="(item, index) in breadcrumbData">
          <el-breadcrumb-item :key="index">
            <span style="line-height: 30px">{{ item }}</span>
          </el-breadcrumb-item>
        </template>
        </el-breadcrumb>
        <!-- main部分 -->
        <router-view />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>


 <script>
import navtop from "@/components/nav-top.vue";
import leftNav from "@/components/nav.vue";
export default {
  components: {
    navtop,
    leftNav,
  },
  data() {
    return {
      breadcrumbData:[]
    };
  },
  methods: {},
  created(){
    this.breadcrumbData=this.$route.meta.title.split('->')
  },
  watch:{
  $route(to,from){
    this.breadcrumbData=to.meta.title.split('->')
  }
},
};
</script>



