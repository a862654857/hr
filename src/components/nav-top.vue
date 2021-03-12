<!--
 * @Author: your name
 * @Date: 2020-04-13 15:59:01
 * @LastEditTime: 2020-04-13 18:56:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vueTest\houtai\src\components\nav-top.vue
 -->
<style scoped>
.el-aside {
  display: flex;
  justify-content: center;
  align-items: center;
}

section {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  width: 100px;
  height: 60px;
}
.user-logo {
  float: right;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 1001;
  cursor: pointer;
  color: #409eff;
}

.headerLogo,
.logo {
  cursor: pointer;
}
.user{
  margin-left: 10px;
}
.pic {
  position: absolute;
  top: 9px;
  right: 80px;
}
</style>

<template>
  <div>
    <div>
      <el-container>
        <el-aside width="auto" class="header-logo tap">
          <img class="logo" src="../../static/hr-szelejewo.svg" alt="Logo" />
        </el-aside>
        <div class="pic">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-aside width="auto" class="header-logo tap">
              <img class="user-logo" src="@/assets/imgs/img.jpg" alt="Logo" />
              <div class="user">
                {{ username }}
              </div>
            </el-aside>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="changerPwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="loginout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-container>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePassword">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Cookie } from "../js/common";
import { query, apiparas, execute } from "../api/api";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      activeIndex: "1",
      dialogFormVisible: false,
      ruleForm: {
        password: "",
        checkPass: "",
      },
      rules: {
        password: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        checkPass: [
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    username() {
      let username = Cookie.Get("user_name"); //localStorage.getItem('ms_username');
      return username
    },
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCommand(command) {
      if (command == "loginout") {
        Cookie.Set("user_key", "");
        Cookie.Set("user_name", "");
        Cookie.Set("company_key", "");
        Cookie.Set("company_name", "");
        Cookie.Set("token", "");
        //localStorage.removeItem('ms_username')
        this.$router.push("/Login");
      } else if (command == "changerPwd") {
        this.dialogFormVisible = true;
      }
    },
    updatePassword: function () {
      let jsonparas = [{ name: "psw", value: this.ruleForm.password }];
      //查询汇总
      let _paras = apiparas.getParas(
        "default",
        "sys|updatepassword",
        jsonparas
      );
      execute(_paras).then((response) => {
        if (response.errid == 0) {
          this.addFormVisible = false;
          this.$notify({
            title: "成功信息",
            message: "修改完成，请重新登陆",
            type: "success",
          });
          this.$router.push("/Login");
        } else {
          this.$notify.error({
            title: "错误",
            message: response.errmsg,
            type: "error",
          });
        }
      });
    },
  },
};
</script>