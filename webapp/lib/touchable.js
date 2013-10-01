define(["dojo/_base/declare","imarray"],function(declare,ImArray){
	
	
	
	return declare(null,{
		_area: null,
		constructor: function(){
			this._areas = new ImArray();
		},
		addArea: function(area){
			return this._areas.pushNonRepetition(area);
		},
		isInside: function(p){
			var c = false;
			var tp = this.getAbsolutePosition();
			for(var i=0;i<this._areas.getLength();i++){
				var a = this._areas.get(i);
				if(p.x>a.x1+tp.x&&p.x<a.x2+tp.x&&p.y>a.y1+tp.y&&p.y<a.y2+tp.y)
					c = true;
			}
			return c;
		}
	});
});