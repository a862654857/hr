<template>
  <div>
    <div>
      <el-form :inline="true" :model="consumables" class="demo-form-inline">
        <el-form-item label="耗材代码">
          <el-input v-model="consumables.no" placeholder="耗材代码"></el-input>
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
          <el-table-column prop="耗材代码" label="耗材代码"> </el-table-column>
          <el-table-column prop="耗材名称" label="耗材名称"> </el-table-column>
          <el-table-column prop="规格" label="规格"> </el-table-column>
          <el-table-column prop="单位" label="单位"> </el-table-column>
          <el-table-column prop="剩余数量" label="剩余数量" width="180">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="opendialogVisible(scope.row.consumables_key)"
                >添加库存</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="添加库存"
          :visible.sync="dialogVisible"
          width="31%"
          center
          @close="dialogclose"
        >
          <el-form
            :inline="true"
            :model="consumablesform"
            class="demo-form-inline"
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item label="单价" prop="price">
              <el-input
                v-model="consumablesform.price"
                placeholder="请输入单价"
              ></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="quantity">
              <el-input
                v-model="consumablesform.quantity"
                placeholder="请输入数量"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="check">提交</el-button>
            <el-button @click="resetadd()">重置</el-button>
          </div>
        </el-dialog>

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
/*数字（正整数）*/

export default {
  components: {
    vImport,
  },
  data() {
    const isInteger = (rule, value, callback) => {
      if (
        Number.isInteger(Number(value)) &&
        Number(value) > 0 &&
        Number(value) < 9999
      ) {
        callback();
      } else {
        callback(new Error("请输入1-9999的正整数"));
      }
    };

    /*保留两位小数*/ const isMoneynum = (rule, value, callback) => {
      const reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if ((value || "") != "") {
        if (!reg.test(value)) {
          callback(new Error("请输入正确的数字，最多保留两位小数!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      consumables: {
        no: "",
        name: "",
      },
      consumablesform: {
        quantity: 1,
        price: "",
      },

      tableData: [],
      cachename: "",
      currentPage: 1,
      pagesize: 50,
      dialogVisible: false,
      charLength: 0,
      inv001Loading: false,
      name: "User",
      tabHeight: 500,
      showInput: true,
      colnameData: ["耗材代码", "数量", "单价"],
      colName: ["consumables_no", "quantity", "price"],
      importCmd: "hr|hr_consumables|import_hr_consumables_outbound",
      consumables_key: 0,
      rules: {
        quantity: [
          { required: true, message: "请输入数量", trigger: "blur" },
          { validator: isInteger, trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { validator: isMoneynum, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    check() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return;
        }
        let a = [
          {
            name: "consumables_key",
            value: this.consumables_key,
          },
          {
            name: "quantity",
            value: this.consumablesform.quantity,
          },
          {
            name: "price",
            value: this.consumablesform.price,
          },
        ];
        let b = apiparas.getParas(
          "default",
          "hr|hr_consumables|insert_consumables_inventory",
          a
        );
        execute(b).then((res) => {
          if (res.errid == 0) {
            this.$notify({
              title: "成功",
              message: "添加成功",
              type: "success",
            });
            this.getcache()
            this.dialogVisible=false
          } else {
            this.$notify({
              title: "错误信息",
              message: res.errmsg,
              type: "error",
            });
          }
        });
      });
    },
    resetadd() {
      this.quantity = "";
      this.price = "";
      this.$refs.ruleForm.resetFields();
    },
    importResult(val) {
      this.showInput = false;
      this.$nextTick(function () {
        this.showInput = true;
      });
      if (val === true) {
        this.getcache();
      }
    },
    dialogclose() {
      this.resetadd();
    },
    opendialogVisible(val) {
      this.consumables_key = val;
      this.dialogVisible = true;
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
        "hr|hr_consumables|get_consumables",
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
          this.tableData = res.result;
        } else {
          this.$notify({
            title: "错误信息",
            message: res.errmsg,
            type: "error",
          });
        }
      });
    },
    stock() {},
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