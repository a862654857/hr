<!--
   	 作者：陈泽椿
   	 时间：2018-08-23
   	 描述：导入解析Excel表文件
   	 
  			v-import前面若是有其他控件，需要用<div style="float: left;">包裹起来
  			
  	参数: colnameData[]参数--约定的列名列表
  		colName[]------------数据库字段名列表
  		cmd  ''--------------调用的cmd命令名
	回调函数:
  			@importResult--------------返回导入结果
        说明：在组件中用v-if="showInput"	,在回调函数里面用
        this.showInput = false;
		this.$nextTick(function(){
		    this.showInput = true;
		})可以避免第二次上传相同文件无法响应change事件的问题		
-->

<template>
	<div >
		<input  ref="fileInput" type="file"  @change="handleChange" style="display: none" > 
		<el-button @click="onPickFile" type="primary" >Excel导入</el-button>
	</div>
</template>

<script>
	import { query, apiparas, execute } from '../../api/api';
	export default {
		props: ['colnameData','colName','cmd','type','map'],
		data() {
			return {
				xlsData: {},
				dataHead: [{"name":"dd","value":"dd"}],
				paras:{}
			}
		},
		mounted: function() {
			//生命周期
			
		},
		computed: {
			//计算属性
			
		},
		methods: { //函数
			onPickFile () {
			  this.$refs.fileInput.click()
			},
			handleChange(event){
				//console.log(BASE_API);
				if(event.target.files.length===0||event===null){
					return;
				}
				let _this = this;
//				console.log(event,"我是event")
				// 通过DOM取文件数据
				let file = event.target.files[0];
//				console.log(file,"w shi file")
				//return;
				let rABS = false; //是否将文件读取为二进制字符串
				let f = file;
				let reader = new FileReader();
				//if (!FileReader.prototype.readAsBinaryString) {
				FileReader.prototype.readAsBinaryString = function(f) {
					let binary = "";
					let rABS = false; //是否将文件读取为二进制字符串
					let pt = this;
					let wb; //读取完成的数据
//					console.log(wb,"我是wb")
					let outdata;
					let reader = new FileReader();
					
					reader.onload = function(e) {
						try{
							let bytes = new Uint8Array(reader.result);
							let length = bytes.byteLength;
							for(let i = 0; i < length; i++) {
								binary += String.fromCharCode(bytes[i]);
							}
							let XLSX = require('xlsx');
							if(rABS) {
								wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
									type: 'base64'
								});
							} else {
								wb = XLSX.read(binary, {
									type: 'binary'
								});
							}
	
							outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
								header: 1
							}); //outdata就是你想要的东西
							_this.xlsData = [...outdata];
							console.log(_this.xlsData,'_this.xlsData');
							
							
							_this.dataHead = [];
							let colIndex = []; //找到列对应的位置
							let t_col = [];
							let row_start = 1;
							for(let i = 0; i < _this.xlsData[0].length; i++) {
								apiparas.pushPara(_this.dataHead , _this.xlsData[0][i], _this.xlsData[0][i]);
							}
							t_col = _this.colnameData; 
							
							for(let i = 0; i < t_col.length; i++) {
								for(let j = 0; j < _this.dataHead.length; j++) {
	
									if(_this.dataHead[j]['name'] == t_col[i]) //找需要导入数据列的对应列顺序
									{
										colIndex.push(j);
										continue;
									}
								}
	
							}
							if(colIndex.length !== t_col.length ){
								_this.$message({
									message: '导入失败！请导入相应的文件',
									type: 'error'
								});
								return ;
							}
							console.log(colIndex,'colIndex')
							let objs = [];
							for(let i = row_start; i < _this.xlsData.length; i++) {
									let obj = {};
									for(let j = 0,len = _this.colName.length; j<len;j++){
										obj[_this.colName[j]] = _this.xlsData[i][colIndex[j]]
									}									
									objs.push(obj);
							}
							
							
							let json = {};
							json.subs = objs;
							//遍历，将map中的数据添加进json对象
							if(_this.map!=null){
								for (let [key, value] of _this.map.entries()) {
									json[key] = value;
								}
							}
							console.log(json,'json')
							
							_this.$message({
								message: '请耐心等待导入',
								type: 'info'
							});
							if(_this.type == 'string'){
								let str = '';
								let middlestr = '';
								
								let recount = 0;
								let row = '';
								console.log(objs,'objs')
								for(let i = 0;i<objs.length;i++){
									let count = 0;
									Object.keys(objs[i]).forEach(function(key){
										middlestr = middlestr + objs[i][key] + ',';
										if(objs[i][key] == undefined){
											count = count + 1;
										}
									});
									
									if(count >=14){
										break;
									}else{
										if(objs[i].entity_code == undefined || objs[i].target_year == undefined){
											recount = recount + 1 
											let msg = '';
											i = i + 1;
											msg = '第'+ i + '行' + '店铺编码或年份不能为空' ;
											_this.$notify.error({title: '错误',message:msg,type:'error'});
										}else{
											middlestr = middlestr.substring(0,middlestr.length-1);
											middlestr = '[' + middlestr + '],';
										    str = str + middlestr ;
										    middlestr = '';
										}
									}
								}
//								console.log(count,'count');
								if(recount >= 1){
									return ;
								}else{
									console.log(str,'str')
									str = str.substring(0,str.length-1);
									console.log(str,'str')
									let jsonparas = [{'name':'objStr','value':str.replace(/undefined/g,'null')}];
									//查询汇总
									let _paras = apiparas.getParas('eidw',_this.cmd,jsonparas);
									console.log(_paras,'paras22');
									execute(_paras).then(response => {
										if(response.errid == 0){
											_this.$notify({title: '成功信息',message: '导入成功！',type: 'success'});
											_this.$emit('importResult',true);
										}
										else
										{
											_this.$emit('importResult',false);
											_this.$notify.error({title: '错误',message:response.errmsg ,type:'error'});
										}
										event = null;
									});	
								}
								
							}else{
								if(json.subs.length==0){
									_this.$notify({title: '错误',message:'请填写数据!' ,type:'info'});
									return ;
								}
								let _paras = apiparas.getJsonObj('eidw',_this.cmd, json);
								// console.log(json,'json')
								execute(_paras).then(response => {
									if(response.errid == 0){
										_this.$notify({title: '成功信息',message: '导入成功！',type: 'success'});
										_this.$emit('importResult',true);
									}
									else
									{
										_this.$emit('importResult',false);
										_this.$notify.error({title: '错误',message:response.errmsg ,type:'error'});
									}
									event = null;
								});	
							}
//							console.log(objs,'objs')
						}catch(e){
							_this.$message({
								message: '导入失败！请导入Excel文件',
								type: 'error'
							});
						}
					}
					reader.readAsArrayBuffer(f);
				}
				if(rABS) {
					reader.readAsArrayBuffer(f);
				} else {
					reader.readAsBinaryString(f);
				}
			}
		},
		created: function() {
			
		},
		update:function(){
			
		},
		watch: {
		
		}

	}
</script>

<style>
.content-a-upload {
    position: relative;
    top:0px;
    height: 39px;
    /*width: 50px;*/ 
   	font: 10 15px/40px "宋体";
    text-align: center;
    cursor: pointer;
    color: #fff;
    background: #409EFF;
    border: 1px solid #b3d8ff;
    border-radius: 5px;
    overflow: hidden;
    display: inline-block;
    text-decoration: none;
		padding: 0 10px;
}
.content-a-upload input {
    position: absolute;
    font-size: 15px;
    height: 40px;
    right: 0;
    top: 0px;
    opacity: 0;
    cursor: pointer;
}
.content-a-upload:hover {
    color: #fff;
    background: #409EFF;
    border-color: #409EFF;
    text-decoration: none
}
</style>