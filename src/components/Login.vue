<template>
	<div class="login-wrap">
		<!--<div class="ms-title">综合平台</div>-->
		
		<el-row>
			<el-col :xs="5" :sm="6" :md="7" :lg="8" :xl="9">&nbsp;</el-col>
		  	<el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6" >
		  		<div class="loginForm">
		  			<div class="ms-title">综合平台</div>
		  			<br />
		  			<el-tabs v-model="activeName" >
			    		<el-tab-pane label="扫码登录" name="first">
			    			<div style="margin-top: 20px;">
								<div id="login_container">二维码</div>
							</div>
			    		</el-tab-pane>
			    		<el-tab-pane label="账号登录" name="second">
			    			<div style="margin-top: 20px;">
								<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
									<el-form-item prop="companyId" label="公司">
										<el-input v-model="ruleForm.companyId" placeholder="请输入公司编号"></el-input>
									</el-form-item>
									<el-form-item prop="username" label="用户名">
										<el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
									</el-form-item>
									<el-form-item prop="password" label="密码">
										<el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
									</el-form-item>
									<div>
										<div>
											<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
											<el-button type="primary" @click="addFormVisible = true">注册</el-button>
										</div>
									</div>
								</el-form>
							</div>
			    		</el-tab-pane>
			  		</el-tabs>
		  		</div>
		  	</el-col>
		</el-row>
		
		<!--<div class="ms-login">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
				<el-form-item prop="companyId" label="公司">
					<el-input v-model="ruleForm.companyId" placeholder="请输入公司编号"></el-input>
				</el-form-item>
				<el-form-item prop="username" label="用户名">
					<el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item prop="password" label="密码">
					<el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
				</el-form-item>
				<div>
					<div style="padding-left: 35%;">
						<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
						<el-button type="primary" @click="addFormVisible = true">注册</el-button>
					</div>
				</div>
			</el-form>
		</div>-->
		
		<el-dialog title="注册公司" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="resetForm('addForm')" style="padding-bottom:0;">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm"
			style="height:240px;">
				<el-form-item label="公司ID" prop="company_id">
					<el-input v-model="addForm.company_id" auto-complete="off" placeholder="请输入公司ID"></el-input>
				</el-form-item>
				<el-form-item label="公司名称" prop="company_name">
					<el-input v-model="addForm.company_name" auto-complete="off" placeholder="请输入公司名称"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="telphone">
					<el-input v-model="addForm.telphone" auto-complete="off" placeholder="请输入联系电话"></el-input>
				</el-form-item>
				<el-form-item label="联系地址" prop="address">
					<el-input v-model="addForm.address" auto-complete="off" placeholder="请输入联系地址"></el-input>
				</el-form-item>
				<el-form-item label="法人" prop="legal_person">
					<el-input v-model="addForm.legal_person" auto-complete="off" placeholder="请输入法人"></el-input>
				</el-form-item>
			</el-form>
			<br />
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="regist">提交</el-button>
				<el-button @click="reset()">重置</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { login, apiparas ,pub_query } from '../api/api';
	import { Cookie } from '../js/common';
	import QRCode from 'qrcode';
	import ddLogin from '../js/ddLogin';
	export default {
		data: function() {
			return {
				activeName: 'first',
				appid:STATIC_CONFIG.appid,
				scanDD:STATIC_CONFIG.scanDD,
				
				companyDate:[],
				ruleForm: {
					companyId:'',
					username: '',
					password: ''
				},
				addFormVisible:false,
				addForm:{
					company_id:'',
					company_name:'',
					telphone:'',
					address:'',
					legal_person:''
				},
				rules: {
					companyId: [{
						required: true,
						message: '请输入公司ID',
						trigger: 'blur'
					}],
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				},
				addFormRules: {
					company_id: [
				        { required: true, message: '请输入公司ID', trigger: 'blur' },
			        ],
			     	company_name: [
				        { required: true, message: '请输入公司名称', trigger: 'blur' },
			        ],
			        telphone:[
			        	{ required: true, message: '请输入联系电话', trigger: 'blur' },
			        ],
			        address:[
			        	{ required: true, message: '请输入联系地址', trigger: 'blur' },
			        ],
			        legal_person:[
			        	{ required: true, message: '请输入法人', trigger: 'blur' },
			        ],
			  
				},
			}
		},
		
		mounted: function() {
			var _url = encodeURIComponent(this.scanDD);
			var _goto = encodeURIComponent('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=' + this.appid + '&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=' + _url)

			DDLogin({
				id: "login_container", //这里需要你在自己的页面定义一个HTML标签并设置id，例如或<span id="login_container"></span>
				goto: _goto, //请参考注释里的方式
				style: "border:none;background-color:#FFFFFF;",
				width: "365",
				height: "400"
			});

			if(typeof window.addEventListener != 'undefined') {
				window.addEventListener('message', this.hanndleMessage, false);
			} else if(typeof window.attachEvent != 'undefined') {
				window.attachEvent('onmessage', this.hanndleMessage);
			}
		},
		
		methods: {
			resetForm:function(formName){//重置
				this.$refs[formName].resetFields();
			},
			submitForm(formName) {
				let paras = {
					user: this.ruleForm.username,
					pwd: this.ruleForm.password,
					company:this.ruleForm.companyId
				};
				login(paras).then(response => {
					if(response.errid == 0) { //错误信息(如果返回错误信息为空，则认证通过)
						Cookie.Set("token", response.token, 0);
						Cookie.Set("user_key", response.user_key, 0);
						Cookie.Set("user_name", response.user_name, 0);
						Cookie.Set("company_key", response.company_key, 0);
						Cookie.Set("company_id", response.company_id, 0);
						Cookie.Set("company_name", response.company_name, 0);
						Cookie.Set("datasource", response.datasource, 0);
						Cookie.Set('avatar',response.avatar, 0);
						// localStorage.setItem('ms_username', response.uname);
						//window.location.href="/";
						localStorage.setItem("breadcrumb",JSON.stringify(null));
						localStorage.setItem("storecode",JSON.stringify(null));
						localStorage.setItem("cacheStore",JSON.stringify(null));
						this.$router.push('/'); //登录成功，进入系统首面
					} else {
						this.$notify.error({title: '错误',message:'用户名或密码错误' ,type:'error'});
					}
				}).catch(res => {
					this.$notify.error({title: '错误',message:'网络错误,请重新刷新',type:'error'});
				});
			},
			getCompany: function() { //查询数据
				//显示数据
				let _paras = apiparas.getPubParas('default','get_company');
				pub_query(_paras).then(response => {
					let json_data = response.result;
					this.companyDate = json_data;
				});
			},
			regist:function(){
				this.source = "company.addSubmit(添加公司信息)";	//调用cmd来源
					let jsonparas = [];
					//增加查询条件
					jsonparas = [
						{'name': 'company_id','value':  this.addForm.company_id},
						{'name': 'company_name','value':this.addForm.company_name},
						{'name': 'telphone','value': this.addForm.telphone},
						{'name': 'address','value': this.addForm.address},
						{'name': 'legal_person','value': this.addForm.legal_person}
					];
					//查询汇总
					let _paras = apiparas.getParas('eidw','insert_company', jsonparas,this.source);
					pub_query(_paras).then(response => {
						if(response.errid == 0){
							this.$notify({title:'成功信息',message:'添加完成',type:'success'});
							this.addFormVisible = false;
							this.showdata();
						}
						else
						{
							this.$notify.error({title: '错误',message:response.errmsg ,type:'error'});
						}
					});				
			},
			reset:function(){//重置
				this.addForm = {
					company_id:'',
					company_name:'',
					telphone:'',
					address:'',
					legal_person:''
				}
			},
			hanndleMessage(event) {
				var origin = event.origin;
				if(origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
					var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
					console.log("loginTmpCode", loginTmpCode);
					var redirect_uri = encodeURIComponent(this.scanDD);
					console.log(redirect_uri);
					
					var url ='https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=' + this.appid + '&response_type=code&scope=snsapi_login&state=STATE&redirect_uri='+redirect_uri+'&loginTmpCode='+loginTmpCode;
					window.open(url, "_self");
				}
			},
		},
		created: function() {
			this.getCompany();
		}
	}
</script>

<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.loginForm{
		margin-top: 30%;
		padding: 30px;
		height: 420px;
		background-color: aliceblue;
		text-align: center;
	}
	.ms-title {
		width: 100%;
		text-align: center;
		font-size: 30px;
		color: #324157;
	}
	
	.ms-login {
		position: absolute;
		left: 35%;
		top: 50%;
		width: 30%;
		height: 220px;
		margin: -150px 0 0 -20px;
		padding: 40px;
		border-radius: 5px;
		background: #fff;
	}
	
	.login-btn {
		text-align: center;
	}
	
	.login-btn button {
		width: 100%;
		height: 36px;
	}
</style>