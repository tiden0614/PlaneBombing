define(["dojo/_base/declare","kinetic","touchable"],function(declare,Kinetic,Touchable){
	
	var directions = ["north","east","south","west"];
	
	return declare([Kinetic.Group,Touchable],{
		_battlePosition: {x: 0, y: 0},
		_direction: "north",
		_eventPackage: null,
		_putInBattle: false,
		_battle: null,
		constructor: function(config){
			this.setAttrs(config);
			var color = Kinetic.Util.getRandomColor();
			var body = new Kinetic.Ellipse({
				x: 0,
				y: 10,
				width: 30,
				height: 120,
				radius:{x: 15, y: 55},
				fill: color
			});
			var bigWing = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: 150,
				height: 30,
				offset: [75,15],
				lineJoin: "round",
				fill: color,
			});
			var smallWing = new Kinetic.Rect({
				x: 0,
				y: 60,
				width: 90,
				height: 30,
				offset: [45,15],
				lineJoin: "round",
				fill: color,
			});
			var rotateClockWiseButton = new Kinetic.Circle({
				x: 50,
				y: -50,
				radius:10,
				fill: color
			});
			this.add(body);
			this.add(bigWing);
			this.add(smallWing);
			this.add(rotateClockWiseButton);
//			this.setStroke("black");
//			this.setStrokeWidth(1);
			if(config.direction) this.setDirection(config.direction);
			if(config.battlePosition) this.setBattlePosition(config.battlePosition);
			
			this.addArea({
				x1:-15,
				x2:15,
				y1:-45,
				y2:75
			});
			this.addArea({
				x1:-75,
				x2:75,
				y1:-15,
				y2:15
			});
			this.addArea({
				x1:-45,
				x2:45,
				y1:-45,
				y2:75
			});
		},
		setBattlePosition: function(battlePosition){
			this._battlePosition = battlePosition;
		},
		getBattlePosition: function(){
			return this._battlePosition;
		},
		setDirection: function(direction){
			this._direction = direction;
			switch(direction){
				case "east":  this.setRotation(Math.PI/2); break;
				case "south": this.setRotation(Math.PI); break;
				case "west":  this.setRotation(Math.PI + (Math.PI/2)); break;
				default: this.setRotation(0);
			}
		},
		getDirection: function(){
			return this._direction;
		},
		setEventPackage: function(eventP){
			this._eventPackage = eventP;
		},
		getEventPackage: function(){
			return this._eventPackage;
		},
		getNextDirection: function(){
			for(var i=0; this._direction != directions[i] && i < 5;i++);
			if(i > 3) return "error";
			if(++i > 3) i -= 4;
			return directions[i];
		},
		getPreDirection: function(){
			for(var i=0; this._direction != directions[i] && i < 5;i++);
			if(i > 3) return "error";
			if(--i < 0) i += 4;
			return directions[i];
		},
		setInBattle: function(inBattle){
			this._putInBattle = inBattle;
		},
		isInBattle: function(){
			return this._putInBattle;
		},
		setBattle: function(battle){
			this._battle = battle;
		},
		getBattle: function(){
			return this._battle;
		},
		equals: function(obj){
			if(obj.getBattlePosition() == this._battlePosition &&
					obj.getDirection() == this._direction)
				return true;
			return false;
		}
	});
});