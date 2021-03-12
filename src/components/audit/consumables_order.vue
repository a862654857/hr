
<template>
  <div>
    <el-form :inline="true" :model="user" class="demo-form-inline">
      <el-form-item label="申请人" label-width="54px">
        <el-input
          v-model="user.name"
          placeholder="请输入申请人,为空查询全部"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div style="float: left">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-tabs v-model="status" @tab-click="handleClick">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="待审批" name="40010"></el-tab-pane>
      <el-tab-pane label="待领取" name="40020"></el-tab-pane>
      <el-tab-pane label="已领取" name="40030"></el-tab-pane>
      <el-tab-pane label="已拒绝" name="40040"></el-tab-pane>
    </el-tabs>
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
        :max-height="tabHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="耗材名称" label="耗材名称" width="180">
        </el-table-column>
        <el-table-column prop="规格" label="规格" width="180">
        </el-table-column>
        <el-table-column prop="单位" label="单位"> </el-table-column>
        <el-table-column prop="申请数量" label="申请数量"> </el-table-column>
        <el-table-column prop="申请时间" label="申请时间"> </el-table-column>
        <el-table-column prop="申请人" label="申请人"> </el-table-column>
        <el-table-column prop="状态" label="状态"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="
                    scope.row['状态'] == '待审批' ||
                    scope.row['状态'] == '已拒绝'
                  "
                  @click.native="
                    audit(
                      scope.row.consumables_outbound_key,
                      'hr|hr_consumables|consumables_pass'
                    )
                  "
                  >审核通过</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="scope.row['状态'] == '待审批'"
                  @click.native="
                    audit(
                      scope.row.consumables_outbound_key,
                      'hr|hr_consumables|consumables_nopass'
                    )
                  "
                  >审核拒绝</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="scope.row['状态'] == '待领取'"
                  @click.native="
                    audit(
                      scope.row.consumables_outbound_key,
                      'hr|hr_consumables|consumables_delivery'
                    )
                  "
                  >发货</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
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
</template>

<script>
import {
  query,
  apiparas,
  execute,
  pub_query,
  querytocache,
  getquerybycache,
} from "../../api/api";
export default {
  data() {
    return {
      user: {
        name: "",
      },
      status: "",
      tableData: [],
      cachename: "",
      currentPage: 1,
      pagesize: 50,
      charLength: 0,
      tabHeight: 450,
      inv001Loading: false,
      multipleSelection: [],
    };
  },

  methods: {
    async audit(key, cmd) {
      let a = [
        {
          name: "consumables_outbound_key",
          value: key,
        },
      ];
      let b = apiparas.getParas("default", cmd, a);
      const res = await execute(b);
      if (res.errid == 0) {
        this.$notify({
          title: "成功信息",
          message: "修改状态成功",
          type: "success",
        });
        this.querydata();
      } else {
        this.$notify({
          titile: "错误信息",
          message: res.errmsg || "修改失败",
          type: "error",
        });
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
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
      this.status = "0";
      this.querydata();
    },
    handleClick(tab, event) {
      this.querydata();
    },
    getdata() {
      let c = {
        cachename: this.cachename,
        pagenumber: this.currentPage,
        pagesize: this.pagesize,
      };
      getquerybycache(c).then((res) => {
        if (res.errid == 0) {
          this.tableData = res.result;
        } else {
          this.$notify({
            title: "错误信息",
            message: res.errmsg,
            type: "error",
          });
        }
      });
      if (this.status == "") {
        this.status = "0";
      }
      this.inv001Loading = false;
    },
    querydata() {
      this.currentPage = 1;
      if (this.status == "0") {
        this.status = "";
      }
      let a = [
        {
          name: "user_name",
          value: this.user.name,
        },
        {
          name: "status",
          value: this.status,
        },
      ];
      let b = apiparas.getParas(
        "default",
        "hr|hr_consumables|get_consumable_application_order",
        a
      );
      this.inv001Loading = true;
      querytocache(b).then((res) => {
        if (res.errid == 0) {
          if (res.result.length == 0) {
            this.$notify({
              title: "提示信息",
              message: "未查询到数据",
              type: "info",
            });
            this.tableData = [];
            this.cachename = "";
            this.charLength = 0;
            this.inv001Loading = false;
            return;
          }
          this.cachename = res.cachename;
          this.charLength = res.count;
          this.getdata();
        } else {
          this.$notify({
            titile: "错误信息",
            message: res.errmsg || "未查询到数据",
            type: "error",
          });
          this.inv001Loading = false;
        }
      });
    },
  },
  created() {
    this.querydata();
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
<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
