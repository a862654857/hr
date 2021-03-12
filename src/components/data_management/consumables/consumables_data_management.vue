<template>
  <div>
    <div>
        <el-form :inline="true" :model="consumables" class="demo-form-inline">
          <el-form-item label="耗材代码">
            <el-input
              v-model="consumables.no"
              placeholder="耗材代码"
            ></el-input>
          </el-form-item>
          <el-form-item label="耗材名称">
            <el-input
              v-model="consumables.name"
              placeholder="耗材名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div style="float: left">
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </div>
            <div style="float: left; margin-left: 3px">
              <v-import
                v-if="showInput"
                :colname-data="colnameData"
                :colName="colName"
                :cmd="importCmd"
                v-on:importResult="importResult"
              ></v-import>
            </div>
          </el-form-item>
        </el-form>
        <div
          style="margin-top: -10px"
          class="tableinvoice"
          v-loading="inv001Loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table
            :data="tableData"
            style="width: 100%"
            border
            :stripe="true"
            :max-height="tabHeight"
            :header-cell-style="{ background: '#E3E3E3', padding: '2px' }"
            :cell-style="{ padding: '2px' }"
          >
            <el-table-column prop="耗材代码" label="耗材代码">
            </el-table-column>
            <el-table-column prop="耗材名称" label="耗材名称">
            </el-table-column>
            <el-table-column prop="规格" label="规格"> </el-table-column>
            <el-table-column prop="单位" label="单位"> </el-table-column>
            <el-table-column prop="创建时间" label="创建时间" width="180">
            </el-table-column>
            <el-table-column prop="user_name" label="创建人" width="180">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[50, 100, 500, 1000]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="charLength"
          >
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import {
  query,
  apiparas,
  execute,
  pub_query,
  querytocache,
  getquerybycache,
} from "../../../api/api";
import vImport from "../../charts/importExcel.vue";
export default {
  components: {
    vImport,
  },
  data() {
    return {
      consumables: {
        no: "",
        name: "",
      },
      tableData: [],
      cachename: "",
      currentPage: 1,
      pagesize: 50,
      charLength: 0,
      inv001Loading: false,
      name: "User",
      tabHeight: 500,
      showInput: true,
      colnameData: ["耗材代码", "耗材名称", "规格", "单位"],
      colName: ["consumables_no", "consumables_name", "specifications", "unit"],
      importCmd: "hr|hr_consumables|import_hr_consumables",
    };
  },
  methods: {
    importResult(val) {
      this.showInput = false;
      this.$nextTick(function () {
        this.showInput = true;
      });
      if (val === true) {
        this.getcache();
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.currentPage = 1;
      this.getdata();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getdata();
    },
    onSubmit() {
      this.getcache();
    },
    getcache() {
      let a = [
        {
          name: "consumables_no",
          value: this.consumables.no,
        },
        {
          name: "consumables_name",
          value: this.consumables.name,
        },
      ];
      this.inv001Loading = true;
      this.currentPage = 1;
      let b = apiparas.getParas(
        "default",
        "hr|hr_consumables|get_consumables_material",
        a
      );
      querytocache(b).then((res) => {
        if (res.errid == 0 && res.count != 0) {
          this.cachename = res.cachename;
          this.charLength = res.count;
          this.getdata();
        } else {
          this.$notify({
            titile: "错误信息",
            message: res.errmsg || "未查询到数据",
            type: "error",
          });
        }
        this.inv001Loading = false;
      });
    },
    getdata() {
      let c = {
        cachename: this.cachename,
        pagenumber: this.currentPage,
        pagesize: this.pagesize,
      };
      getquerybycache(c).then((res) => {
        if (res.errid == 0) {
          console.log(res);
          this.tableData = res.result;
          console.log(this.tableData);
        } else {
          this.$notify({
            title: "错误信息",
            message: res.errmsg,
            type: "error",
          });
        }
      });
    },
  },
  created() {
    this.getcache();
    this.tabHeight =
      document.documentElement.scrollHeight - 190 ||
      document.body.scrollHeight - 190;
  },
  mounted() {
    window.addEventListener("resize", () => {
      //窗口缩放时监听的方法，重新获取页面的高度
      this.tabHeight =
        document.documentElement.scrollHeight - 190 ||
        document.body.scrollHeight - 190;
    });
  },
};
</script>
 <style>
</style>