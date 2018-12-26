var enhanceUrl = function(target,attr,url){
	/*var func = v3VueUtil.getUrlEnHancer();
	if(func){
		func(target,attr,url);
	}else{*/
		var val = target.getAttribute(attr);
		if(val!==url){
			target.setAttribute(attr,url);
		}
	//}
}
Vue.directive("res",function(el,binding,node){
	var vue = node.context;
	var componentCode = vue._getComponentCode();
	var path = "itop/resources/"+componentCode+"_"+binding.value;
	var val = window.GlobalVariables ? GlobalVariables.getServerUrl() + "/" + path:path;
	enhanceUrl(el,binding.arg,val);
});
Vue.directive("url",function(el,binding){
	var val = window.GlobalVariables ? GlobalVariables.getServerUrl() + "/" + binding.value:binding.value;
	enhanceUrl(el,binding.arg,val);
});
Vue.directive("id2url",function(el,binding){
	if(binding.value == undefined ||binding.value == null ||!binding.value ||binding.value =="" ){  // value 为空
		return;
	}
	var url = "module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22"+binding.value+"%22%2C%22ImageObj%22%3A%22"+binding.value+"%22%7D%7D";
	var val = window.GlobalVariables ? GlobalVariables.getServerUrl() + "/" + url:url;
	enhanceUrl(el,binding.arg,val);
});
window._$V3Vue = function(params){
	var globalCode = params.element;
	if(!_$V3Vue.instance){
		_$V3Vue.instance = {};
	}
	_$V3Vue.instance[globalCode] = this;
	var pros = params.pros;
//	if(params.Html) this.html = params.Html;
//	if(params.ModuleJavaScript) this.html=params.ModuleJavaScript;
//	if(params.JavaScript) this.html=params.JavaScript;
//	if(params.Css) this.html=params.Css;
//	if(params.ModuleCss) this.html=params.ModuleCss;
	this.html = pros && pros.Html || params.Html || null;
	this.javascript = pros && pros.ModuleJavaScript || params.ModuleJavaScript || null;
	this.globalCss = pros && pros.Css || params.Css || null;
	this.globalJavascript = pros && pros.JavaScript || params.JavaScript || null;
	this.css = pros && pros.ModuleCss || params.ModuleCss || null;
	this.entityMapping = pros && pros.entityMapping || params.entityMapping || {};
	this.windowEntitys = pros && pros.windowEntitys || params.windowEntitys || {};
	this.treeMapping = pros && pros.treeMapping || params.treeMapping || {};
	this.cssSymbol = pros && pros.cssSymbol || params.cssSymbol || params.css_prefix_symbol || null;
	this.entities = pros && pros.Entities || params.entities || [];
//	if(pros){
//		this.entities = pros.Entities||[];
//		this.cssSymbol = pros.cssSymbol||null;
//		this.entityMapping = pros.entityMapping||{};
//		this.treeMapping = pros.treeMapping||{};
//		this.windowEntitys = pros.windowEntitys||{};
//	}else{
//		this.cssSymbol = params.cssSymbol||null;
//		this.entities = params.entities ? params.entities:[];
//		this.windowEntitys = {};
//		this.treeMapping = {};
//		this.entityMapping = {};
//	}
	this.componentCode = params.componentCode;
	this.parseCss = params.parseCss||true;
	this.parseJavascript = params.parseJavascript||true;
	this.processHtml = params.processHtml||true;
	this.widgetCode = params.widgetCode||null;
	this.eventTargetCode = params.eventTargetCode||null;
	this.element = params.element||null;
	this.datas = params.datas||null;
	this.moduleScriptId = params.moduleScriptId||null;
	this.autoMoutStyle = typeof(params.autoMoutStyle)=='boolean' ? params.autoMoutStyle:true;
	this.forEntities = params.forEntities||[];
	this.processedHtml = params.processedHtml||null;
	this.hanleEventFunc = params.handleEvent||null;
	this.eventHandlers = {};
	this.moduleDefineFunc = {};
	this.sandbox = null;
	this.duringDS2Vue = {};//从ds同步到ui
	this._init();
}
window._$V3Vue.getInstance = function(globalCode){
	return _$V3Vue.instance ? _$V3Vue.instance[globalCode]:null;
}
window._$V3Vue.prototype = {
	_init : function(){
		this._injectCss();
		this._injectScript();
	},
	_injectCss : function(){
		if(this.parseCss){
			var cssStr=[];
			if(this.globalCss){
				cssStr.push(this.globalCss);
			}
			if(this.css){
				cssStr.push(this.css);
			}
			if(cssStr.length>0){
				var css = cssStr.join('');
				//var cssProcessor = v3VueUtil.getCssProcessor();
				//css = cssProcessor ? cssProcessor(css) : css;
				//environment.parseCssStr(css);
				var style = document.createElement("style");
				style.innerHTML = css;
				document.getElementsByTagName("head")[0].appendChild(style);
			}
			//清除样式信息，防止占用内存
			this.globalCss = null;
			this.css = null;
		}
	},
	_defaultModuleScript:"var _$hanleEventFunc$_,sandbox,_$V3Vue,vdk;vdk = window[_vdk];window[_vdk]=null;exports._$putV3Vue=function(v3Vue){this._$V3Vue=v3Vue};exports._$putSandbox=function(sb){sandbox=sb};var getSandbox=function(){return this._$V3Vue.sandbox;};exports._$putHandleEventFunc=function(func){_$hanleEventFunc$_=func;};var handleEvent=function(){if(_$hanleEventFunc$_)_$hanleEventFunc$_.apply(this,arguments)};",
	_injectScript : function(){
		if(this.parseJavascript){
			var javascriptStr=[];
			if(this.globalJavascript){
				javascriptStr.push(this.globalJavascript);
			}
			if(this.javascript){
				if(javascriptStr.length>0){
					javascriptStr.push(';');
				}
				this.moduleScriptId = this._generate();
				javascriptStr.push("(function(exports,_vdk){");
				javascriptStr.push(this._defaultModuleScript);
				javascriptStr.push(this.javascript);
				var uuid = this._generate();
				window[uuid] = this;
				javascriptStr.push("})(window._$V3Vue.getInstance('" + this.element + "')._getCallFunc(),'" + uuid + "');");
			}
			if(javascriptStr.length>0){
				var script = ["<script type=\"text/javascript\">"];
				script = script.concat(javascriptStr);
				script.push("</script>");
				$("head").append(script.join(''));
			}
			//清除脚本信息，防止占用内存
			this.globalJavascript = null;
			this.javascript = null;
		}
	},
	_getCallFunc : function(){
		return this.moduleDefineFunc;
	},
	_existFunc : function(name){
		var funcs = this._getCallFunc();
		if(funcs && typeof(funcs[name]) == "function"){
			return true;
		}
		return false;
	},
	_generate : function(){
		var S4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16)
					.substring(1);
		};
		return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
	},
	_extendDiff : function(aim,source){
		for(var f in source){
			if(source.hasOwnProperty(f)&&source[f]!==aim[f]){
				aim[f] = source[f];
			}
		}
	},
	_createVueData : function(){
		var data = {
			_$v3paltformData : {
                setCurrentHandlers : [],
                setSelectHandlers : [],
                multipleSelect : []
            }
		};
		var entitys = this.windowEntitys;
		if(entitys){
			for(var entityCode in entitys){
				var fieldList = entitys[entityCode];
				var fieldMap = {};
				for(var j = 0,len = fieldList.length;j<len;j++){
					fieldMap[fieldList[j]] = null;
				}
				data[entityCode] = fieldMap;
			}
		}
//		for(var i=0,l=this.entities.length;i<l;i++){
//			var entityCode = this.entities[i];
//			if(entitys && entitys[entityCode]){
//				var fieldList = entitys[entityCode];
//				var fieldMap = {};
//				for(var j = 0,len = fieldList.length;j<len;j++){
//					fieldMap[fieldList[j]] = null;
//				}
//				data[entityCode] = fieldMap;
//			}else{
//				data[entityCode]= {};
//			}
//		}
		for(var oldEntiyCode in this.entityMapping){
			if(this.entityMapping.hasOwnProperty(oldEntiyCode)){
				var newEntityCode = this.entityMapping[oldEntiyCode];
				data[newEntityCode]= [];
			}
		}
		for(var oldEntiyCode in this.treeMapping){
			if(this.treeMapping.hasOwnProperty(oldEntiyCode)){
				var singleInfo = this.treeMapping[oldEntiyCode];
				var newEntityCode = singleInfo["newEntityCode"];
				data[newEntityCode]= [];
			}
		}
		return data;
	},
	_createVueMethod : function(){
		var handleEvent = this.hanleEventFunc||(function(nowVue){
			return function(eventName){
				var func = nowVue._$handleEvent;
				if(func){
					func.apply(nowVue,arguments);
				}
			}
		})(this);
//		var md = function(){
//			return this._$mdHandle;
//		};
		/**
		 * 往moduleDefineFunc注入对象方法
		 * */
		var _moduleDefineFunc = this.moduleDefineFunc;
		if(_moduleDefineFunc){
			/* 注入handleEvent方法 */
			if(typeof(_moduleDefineFunc._$putHandleEventFunc)=='function')
				_moduleDefineFunc._$putHandleEventFunc(handleEvent);
		}
		var _$registerVuiTagEvent = function(widgetCode,eventName,handle){
			if(!this._$vuiTagEventStorage){
				this._$vuiTagEventStorage = {}
			}
			var _vuiTagEventStorage = this._$vuiTagEventStorage;
			if(!_vuiTagEventStorage[widgetCode]){
				_vuiTagEventStorage[widgetCode] = {};
			}
			var _event = _vuiTagEventStorage[widgetCode];
			_event[eventName] = handle;
		} 
		var _$fireVuiTagEvent = function(widgetCode,eventName,params){
			var _vuiTagEventStorage = this._$vuiTagEventStorage;
			if(_vuiTagEventStorage && _vuiTagEventStorage[widgetCode]){
				var tagEvents = _vuiTagEventStorage[widgetCode];
				if(typeof(tagEvents[eventName]) == "function"){
					var handle = tagEvents[eventName];
					handle(params);
				}
			}
		}
		var _refFn = (function(v3Vue){
			return function(func){
				if(v3Vue._existFunc(func)){
					var _func = v3Vue._getCallFunc()[func];
					return _func;
//					var rs = _func.apply(v3Vue.vueInstance,Array.prototype.slice.call(arguments, 1));
//					return rs;
				}else{
					throw Error("未找到方法["+func+"]，请检查！");
				}
			};
		})(this);
		return {
			handleEvent : handleEvent,
			call : (function(nowVue){
				return function(func){
					nowVue._$callEvent.apply(nowVue,arguments);
				}
			})(this),
			refFn : _refFn,
			_$registerVuiTagEvent : _$registerVuiTagEvent,
			_$fireVuiTagEvent : _$fireVuiTagEvent,
			_getComponentCode : (function(componentCode){
				return function(){
					return componentCode;
				};
			})(this.componentCode),
			_$v3platform : function(){
                var _this = this;
        		return {
        			datasource : {
	        			synCurrentRecordToDs : function(entityCode,current,oldCurrent){
	        				var func = _this._$synCurrentRecordToDs;
	        				if(func){
	        					func.apply(_this,[entityCode,current,oldCurrent]);
	        				}
	        			},
	        			synCurrentIdToDs : function(entityCode,current,oldCurrent){
	        				var func = _this._$synCurrentIdToDs;
	        				if(func){
	        					func.apply(_this,[entityCode,current,oldCurrent]);
	        				}
	        			},
                        synSelectRecordToDs : function(entityCode,data,isSel){
	        				var func = _this._$synSelectRecordToDs;
	        				if(func){
	        					func.apply(_this,[entityCode,data,isSel]);
	        				}
                        },
                        synCurrentRecordToUi : function(entityCode,current){
                            var funcs = _this._data._$v3paltformData.setCurrentHandlers;
                            if(funcs.length>0){
                                for(var i=0,len=funcs.length;i<len;i++){
                                    var func = funcs[i];
                                    func(entityCode,current);
                                }
                            }
                        },
                        synSelectRecordToUi : function(entityCode,datas,isSel){
                            var funcs = _this._data._$v3paltformData.setSelectHandlers;
                            if(funcs.length>0){
                                for(var i=0,len=funcs.length;i<len;i++){
                                    var func = funcs[i];
                                    func(entityCode,datas,isSel);
                                }
                            }
                        },
                        registerCurrentHandler : function(handler){
                            _this._data._$v3paltformData.setCurrentHandlers.push(handler);
                        },
                        registerSelectHandler : function(handler){
                            _this._data._$v3paltformData.setSelectHandlers.push(handler);
                        },
                        markDsMultipleSelect : function(entityCode){
                        	_this._data._$v3paltformData.multipleSelect.push(entityCode);
                        }
        			}
        		};
        	}
		};
	},
	_createVueWatcher : function(){
		var watchers = {};
		var getWatcher = function(code,nowV){
			return {
				deep:true,
				sync:true,
				handler : (function(entityCode,nowVue){
					return function(val){
						var func = nowVue._$synData;
						if(func){
							func.apply(nowVue,[entityCode,val]);
						}
					};
				})(code,nowV)
			};
		}
		var entitys = this.windowEntitys;
		for(var entityCode in entitys){
			watchers[entityCode] = getWatcher(entityCode,this);
		}
//		for(var i=0,l=this.entities.length;i<l;i++){
//			var entityCode = this.entities[i];
//			watchers[entityCode] = getWatcher(entityCode,this);
//		}
		if(this.entityMapping){
			for(var entityCode in this.entityMapping){
				if(this.entityMapping.hasOwnProperty(entityCode)){
					var newEntityCode = this.entityMapping[entityCode];
					if(!watchers[newEntityCode]){
						watchers[newEntityCode] = getWatcher(entityCode,this);
					}
				}
			}
		}
		return watchers;
	},
	render : function(){
		if(this.moduleDefineFunc && this.moduleDefineFunc._$putV3Vue){
			this.moduleDefineFunc._$putV3Vue(this);
		}
		//解析html绑定的实体名称
		this.analyEntity(this.html);
		var el = typeof(this.element)=="string" ? document.getElementById(this.element):this.element;
		if(this.autoMoutStyle){
			el.setAttribute("symbol",this.cssSymbol);
		}
		el.innerHTML = this.html;
		var vm = new Vue({
			el:el,
			data : this._createVueData(),
			methods : this._createVueMethod(),
			watch : this._createVueWatcher()
		});
		this._$vue_vm = vm;
	},
	strTrim : function(str){
		return str ? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''):str;
	},
	toNewEntityCode : function(entityCode){
		return entityCode + "_" + (new Date()).getTime();
	},
	_getNewEntityCode : function(pool,entityCode){
		entityCode = this.strTrim(entityCode);
		if(!pool[entityCode]){
			pool[entityCode] = this.toNewEntityCode(entityCode);
		}
		return pool[entityCode];
	},
	analyEntity : function(html){//分析实体
		if(!html) return;
		var template = html;
		var entityMapping = {};//普通实体映射新名称
		var treeMapping = this.treeMapping ? this.treeMapping : {};//属性实体映射新名称
//		var entitys = this.windowEntitys;//实体字段信息
		var tmpThis = this;
		var entitys = this.windowEntitys ? this.windowEntitys : [];
		var analyFunc = (function(tmp_this){//分析非 实体.字段和v-for 这两个格式的实体
			return function(childNode){
				var components;
				var nodeName = childNode.nodeName;
				if(window._$V3Vue&&window._$V3Vue._getComponents){
					components = window._$V3Vue._getComponents(nodeName);
				}
				if(components&&components.length > 0){
					var component = components[0];
					var dataPro = component.getDataProp();
					var attrName = childNode.hasAttribute(":"+dataPro) ? ":" + dataPro : (childNode.hasAttribute("v-bind:"+dataPro) ? "v-bind:"+dataPro : null);
					var dataType = component.getDataType();
					if(dataType == "Array"){
						if(attrName){//绑定实体方式为 :data 或 v-bind:data
							var entityCode = childNode.getAttribute(attrName);
							var newEntityCode = this._getNewEntityCode(entityMapping,entityCode);
							childNode.setAttribute(attrName,newEntityCode);
							childNode.setAttribute(":entity-code","'"+entityCode+"'");
						}
					}else if(dataType == "Tree"){//以树的方式绑定实体
						if(attrName){//绑定实体方式为 :data 或 v-bind:data
							var entityCode = childNode.getAttribute(attrName);
							var newEntityCode = this.toNewEntityCode(entityCode);
							var newMappingInfo = {
								"newEntityCode":newEntityCode
							};
							var treeStructProp = component.getTreeStructProp();
							if(childNode.hasAttribute(":"+treeStructProp)){
								var _fieldMapping = childNode.getAttribute(":"+treeStructProp);
								try{
									newMappingInfo.fieldMapping = eval("(" + _fieldMapping + ")");
								}catch(e){
									newMappingInfo.fieldMapping = {
										"id":"id",
										"parentField":"pid",
										"title":"title"
									}
								}
							}else{
								newMappingInfo.fieldMapping = {
									"id":"id",
									"parentField":"pid",
									"title":"title"
								}
							}
							treeMapping[entityCode] = newMappingInfo;
							childNode.setAttribute(attrName,newEntityCode);
							childNode.setAttribute(":entity-code","'"+entityCode+"'");
						}
					}
				}
				var attrName = "v-for";
				if(childNode.hasAttribute(attrName)){
					var expArray = childNode.getAttribute(attrName).split(" in ");
					var varName = expArray[0],entityCode=expArray[1];
					if(entitys[entityCode]){
						childNode.setAttribute(attrName,varName + " in " + this._getNewEntityCode(entityMapping,entityCode));
						childNode.setAttribute(":entity-code","'"+entityCode+"'");
						childNode.setAttribute(":key",varName+".id");
					}
				}
				var tagName = nodeName.toLowerCase()
				if(tagName.substring(0,4)=="vui-"){
					childNode.setAttribute("vui-type",tagName);
				}
				var childs = childNode.children;
	    		if(childs && childs.length > 0){
	    			for(var i = 0,l=childs.length;i<l;i++){
	    				analyFunc.call(tmp_this,childs[i]);
	    			}
	    		}
			}
		})(tmpThis);
    	var tmpDom = document.createElement("div");
    	tmpDom.innerHTML = template;
    	analyFunc(tmpDom);
    	var _tmplate = tmpDom.outerHTML;
    	this.html = _tmplate.substring(5,_tmplate.length - 6);
    	this.treeMapping = treeMapping;
		this.entityMapping = entityMapping;
	},
	on : function(params){
		var eventName = params.eventName,handler = params.handler;
		var handlers = this.eventHandlers[eventName];
		if(!handlers){
			handlers = [];
			this.eventHandlers[eventName] = handlers;
		} 
		handlers.push(handler);
	},
	
	Events : {
		Rendered : "Rendered"
	}
}