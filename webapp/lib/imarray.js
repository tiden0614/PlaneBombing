define(["dojo/_base/declare"],function(declare){
	return declare(null,{
		_array: null,
		constructor: function(){
			this._array = new Array();
		},
		getLength: function(){
			return this._array.length;
		},
		remove: function(i){
			if(i >= this._array.length) return null;
			var t = this._array[i];
			for(var j=i;j<length-1;j++)
				this._array[j] = this._array[j+1];
			this._array.length--;
			return t;
		},
		insert: function(i,obj){
			if(i>this._array.length) return false;
			for(var j=i; j<length; j++){
				this._array[j+1] = this._array[j];
			}
			this._array[i] = obj;
			return true;
		},
		contains: function(obj){
			if(obj.equals){
				for(var i=0; i<this._array.length;i++)
					if(obj.equals(this._array[i])) return i;
				return -1;
			} else {
				for(var i=0; i<this._array.length;i++)
					if(obj == (this._array[i])) return i;
				return -1;
			}
		},
		push: function(obj){
			this._array.push(obj);
		},
		get: function(i){
			return this._array[i];
		},
		set: function(i,obj){
			if(i>this._array.length) return false;
			this._array[i] = obj;
			return true;
		},
		pushNonRepetition: function(obj){
			if(this.contains(obj) != -1) return false;
			this.push(obj);
			return true;
		}
	});
});