import axios from 'axios';
import { Cookie } from '../js/common' ;

export const getjson = params => {return axios.get('/static/json/' + params +'.json').then(res=>res.data) ; }
export const getmd = params => {return axios.get('/static/md/' + params +'.md').then(res=>res.data) ; }

export const query = params => { return axios.post('/api/cc/query', params).then(res => res.data).catch(res => res); };

export const querytocache = params => { return axios.post('/api/cc/querytocache', params).then(res => res.data).catch(res => res); };
export const getquerybycache = params => { return axios.post('/api/cc/getquerybycache', params).then(res => res.data).catch(res => res); };
export const getcache = params => { return axios.post('/api/cc/getcache', params).then(res => res.data).catch(res => res); };
export const getcachetoxls = params => { return axios.post('/api/cc/getcachetoxls', params).then(res => res.data).catch(res => res); };

export const pub_query = params => { return axios.post('/api/cc/pubquery', params).then(res => res.data).catch(res => res); };

export const execute = params => { return axios.post('/api/cc/execute', params).then(res => res.data).catch(res => res); };

export const login = params => { return axios.post('/api/auth/login',params).then(res => res.data).catch(res => res ); };

export const ScanCodeLogin = params => { return axios.post('/api/auth/ScanCodeLogin',params).then(res => res.data).catch(res => res ); };

export const syncusers = params => { return axios.get('/api/auth/syncusers/' + params).then(res => res.data).catch(res => res ); };

export const dd_getconfig = params => {return axios.get('/api/auth/GetConfig/'+ params).then(res => res.data).catch(res => res);};
export const dd_getuserinfo = params => {return axios.get('/api/auth/GetUserInfo/' + params).then(res => res.data).catch(res => res);};

export const apiparas = {
	pushPara: function(paras, pname, pvalue) {
		let p = {
			'name': pname,
			'value': pvalue
		};
		paras.push(p);
	},
	
	getParas_rtype: function(db,rptname,resulttype, rptparas,source) {
		
		rptparas.push({'name':'agent_key','value':STATIC_CONFIG.agentkey});
		
		let token = Cookie.Get('token');
		if(source === undefined){
			source = "bi"
		}else{
			source = "bi." + source;
		}
		let p = {
			ds:db,
			cmd: rptname,
			paras: rptparas,
			rtype: resulttype,
			token: token,
			source:source
		};
		return p;
	},
	getParas: function(db,rptname, rptparas,source) {
		
		rptparas.push({'name':'agent_key','value':STATIC_CONFIG.agentkey});
		
		let token = Cookie.Get('token');
		if(source === undefined){
			source = "bi"
		}else{
			source = "bi." + source;
		}
		let p = {
			ds:db,
			cmd: rptname,
			paras: rptparas,
			token: token,
			source:source
		};
		return p;
	},
	getJsonObj:function(db,rptname,json){
		let token = Cookie.Get('token');
		let p = {
			ds:db,
			cmd:rptname,
			paras:[],
			jsonobj:json,
			token:token
		};
		return p;
	},
	
	getPubParas:function(db,rptname){
		let p = {
			ds:db,
			cmd:rptname
		}
		return p;
	}
};


