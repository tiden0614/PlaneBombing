define(["dojo/_base/declare"],function(declare){
	return declare(null,{
		_obj: null,
		_initEvent: null,
		_type: null,
		constructor: function(config){
			this.setAttrs(config);
		},
		setObj: function(obj){
			this._obj = obj;
		},
		setInitEvent: function(event){
			this._initEvent = event;
		},
		setType: function(type){
			this._type = type;
		},
		setAttrs: function(config){
			for(var key in config){
				var method = "set" + key.charAt(0).toUpperCase() + key.slice(1);
				this[method](config[key]);
			}
		},
		getObj: function(){
			return this._obj;
		},
		getInitEvent: function(){
			return this._initEvent;
		},
		getType: function(){
			return this._type;
		}
	});
});