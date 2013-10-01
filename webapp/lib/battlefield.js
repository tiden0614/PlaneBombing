define(["dojo/_base/declare", "kinetic","touchable","imarray"],function(declare, Kinetic,Touchable,ImArray){
	
	var marginW  = 20;
	var marginH  = 20;
	var interval = 30;
	var rowLabels =    ["1","2","3","4","5","6","7","8","9"];
	var columnLabels = ["A","B","C","D","E","F","G","H","I"];
	var shape = {
		"north":[
			{x: 0,y:-1}, {x:-2,y: 0}, {x:-1,y: 0}, {x: 0,y: 0}, {x: 1,y: 0},
			{x: 2,y: 0}, {x: 0,y: 1}, {x:-1,y: 2}, {x: 0,y: 2},	{x: 1,y: 2},
		],
		"east":[
		    {x: 1,y: 0}, {x: 0,y:-2}, {x: 0,y:-1}, {x: 0,y: 0}, {x: 0,y: 1},
		    {x: 0,y: 2}, {x:-1,y: 0}, {x:-2,y:-1}, {x:-2,y: 0}, {x:-2,y: 1},
		],
		"south":[
		    {x: 0,y: 1}, {x:-2,y: 0}, {x:-1,y: 0}, {x: 0,y: 0}, {x: 1,y: 0},
		    {x: 2,y: 0}, {x: 0,y:-1}, {x:-1,y:-2}, {x: 0,y:-2}, {x: 1,y:-2},  
		],
		"west":[
		    {x:-1,y: 0}, {x: 0,y:-2}, {x: 0,y:-1}, {x: 0,y: 0}, {x: 0,y: 1},
		    {x: 0,y: 2}, {x: 1,y: 0}, {x: 2,y:-1}, {x: 2,y: 0}, {x: 2,y: 1},
		]
	};
	
	var getBattlePosition = function(battle,p){
		var _p = {
			x:battle.getX(),
			y:battle.getY()
		};
		var topLeftCorner = {
			x: _p.x + marginW,
			y: _p.y + marginH
		};
		var battlePosition = {
			x: Math.floor((p.x - topLeftCorner.x)/interval),
			y: Math.floor((p.y - topLeftCorner.y)/interval)
		};
		
		return battlePosition;
	};
	
	var getActualPosition = function(battle,p){
		var _p = {
			x:battle.getX(),
			y:battle.getY()
		};
		var topLeftCorner = {
			x: _p.x + marginW,
			y: _p.y + marginH
		};
		var actualPosition = {
			x: topLeftCorner.x + (p.x * (interval) + (interval>>1)),	
			y: topLeftCorner.y + (p.y * (interval) + (interval>>1))	
		};
		return actualPosition;
	};
	
	return declare([Kinetic.Layer,Touchable],{
		_rows: 9,
		_columns: 9,
		_maxPlanes: 3,
		_planeList: null,
		_matrix: null,
		constructor: function(config){
			this.setAttrs(config);
			if(config["rows"]) this.setRows(config["rows"]);
			if(config["columns"]) this.setColumns(config["columns"]);
			if(config["maxPlanes"]) this.setMaxPlanes(config["maxPlanes"]);
			this.setWidth(marginW + this._rows * interval);
			this.setHeight(marginH + this._columns * interval);
			var backgroundRect = new Kinetic.Rect({
				x: marginW,
				y: marginH,
				width: this._rows * interval,
				height: this._columns * interval,
				stroke: "black",
				strokeWidth: 2,
				lineJoin: "miter",
				fill: "lightyellow",
				shadowColor : 'black',
				shadowBlur : 10,
				shadowOffset : [ 4, 4 ],
				shadowOpacity : 0.2
			});
			this.add(backgroundRect);
			for(var i = 1; i <= this._rows; i++){
				var offset = i * interval;
				var label = new Kinetic.Text({
					text: rowLabels[i - 1],
					x: 0,
					y: offset + 5,
					fontSize: 10,
					fontFamily : 'Calibri',
					fill : 'black'
				});
				this.add(label);
				if(i != this._rows){
					var l = new Kinetic.Line({
						points: [marginW, marginH + offset, marginW + this._columns * interval, marginH + offset],
						stroke: "black",
						strokeWidth: 2
					});
					this.add(l);
				}
			}
			for(var i = 1; i <= this._columns; i++){
				var offset = i * interval;
				var label = new Kinetic.Text({
					text: columnLabels[i - 1],
					x: offset + 5,
					y: 0,
					fontSize: 10,
					fontFamily : 'Calibri',
					fill : 'black'
				});
				this.add(label);
				if(i != this._columns){
					var l = new Kinetic.Line({
						points: [marginW + offset, marginH, marginW + offset, marginH + this._rows * interval],
						stroke: "black",
						strokeWidth: 2
					});
					this.add(l);
				}
			}
			this.addArea({
				x1:marginW,
				x2:backgroundRect.getWidth(),
				y1:marginH,
				y2:backgroundRect.getHeight()
			});
			this._planeList = new ImArray();
			var m = this._matrix = new Array();
			for(var i=0;i<this._rows;i++){
				m[i] = new Array();
				for(var j=0;j<this._columns;j++)
					m[i][j] = 0;
			}
		},
		setRows: function(rows){
			this._rows = rows;
		},
		getRows: function(){
			return this._rows;
		},
		setColumns: function(columns){
			this._columns = columns;
		},
		getColumns: function(){
			return this._columns;
		},
		setMaxPlanes :function(maxPlanes){
			this._maxPlanes = maxPlanes;
		},
		fitPlane: function(plane,p){
			var bp = getBattlePosition(this,p);
			
			for(var i=0;i<10;i++){
				var _p = {
					x: bp.x + shape[plane.getDirection()][i].x,
					y: bp.y + shape[plane.getDirection()][i].y
				};
				if(_p.x<0||_p.x>=this._rows||_p.y<0||_p.y>=this._columns)
					return false;
				if(this._matrix[_p.y][_p.x] != 0)
					return false;
			}
			
			plane.setBattlePosition(bp);
			var ap = getActualPosition(this,bp);
			plane.setAbsolutePosition(ap);
			return true;
		},
		addPlane: function(plane){
			if(this._planeList.getLength() < this._maxPlanes){
				var _shape = shape[plane.getDirection()];
				for(var i=0;i<_shape.length;i++){
					var bp = plane.getBattlePosition();
					var _x = _shape[i].x + bp.x;
					var _y = _shape[i].y + bp.y;
					this._matrix[_y][_x] = i==0? 2 : 1;
				}
				this._planeList.pushNonRepetition(plane);
				plane.setInBattle(true);
				plane.setBattle(this);
			}
		},
		removePlane: function(plane){
			var p = this._planeList.contains(plane);
			if(p == -1) return;
			var _shape = shape[plane.getDirection()];
			for(var i=0;i<_shape.length;i++){
				var _p = plane.getBattlePosition();
				var _x = _p.x + _shape[i].x;
				var _y = _p.y + _shape[i].y;
				this._matrix[_y][_x] = 0;
			}
			this._planeList.remove(p);
			plane.setInBattle(false);
			plane.setBattle(null);
		}
	});
});