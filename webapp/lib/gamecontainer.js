define(["dojo/_base/declare","kinetic","battlefield","plane","imarray","eventPackage"],
		function(declare,Kinetic,BF,Plane,ImArray,EventPackage){
	var stage = null;
	var listenList = new ImArray();
	var dropList = new ImArray();
	var mouseIsDown = false;
	var currentFocus = null;
	var currentDropPlace = null;
	var consoleLayer = null;
	var consoleText = null;
	var skylayer = null;
	
	var init = function(_stage){
		stage = _stage;
		consoleLayer = new Kinetic.Layer({
			x:400,
			y:300,
			width:500,
			height:200
		});
		consoleText = new Kinetic.Text({
			x:50,
			y:50,
			fontSize: 10,
			fontFamily : 'Calibri',
			fill : 'black'
		});
		consoleLayer.add(consoleText);
		stage.add(consoleLayer);
	};
	var onStageActionStart = function(event){
		if(mouseIsDown) return;
		else {
			
			var p = {x:event.clientX,y:event.clientY};
			var sp = getPositionOnStage(p);
			var obj = findActionRecipient(sp);
			
			if(obj != null){
				mouseIsDown = true;
				var ep = new EventPackage({
					obj: obj,
					initEvent: event,
					type: "drag"
				});
				obj.setEventPackage(ep);
				currentFocus = obj;
				
				if(currentFocus.isInBattle()){
					var bt = currentFocus.getBattle();
					bt.removePlane(currentFocus);
				}
					
			}
			
			// for debug use
			//console(onStageActionStart);
		}
	};
	var onStageActionMove  = function(event){
		if(mouseIsDown){
			if(currentFocus.getEventPackage().getType() == "drag"){
				var p = {x:event.clientX, y:event.clientY};
				var sp = getPositionOnStage(p);
				
				var dp = findDropPlace(sp);
				if(dp != null){
					dp.fitPlane(currentFocus, sp);
					currentDropPlace = dp;
					
					// for debug use
					//console("current drop place: " + dp);
				}
				else
					currentFocus.setAbsolutePosition(sp);
				skylayer.batchDraw();
			}
			
		}
	};
	var onStageActionEnd   = function(event){
		if(mouseIsDown) {
			var p = {x:event.clientX, y:event.clientY};
			var sp = getPositionOnStage(p);
			if(currentDropPlace != null && findDropPlace(sp) == currentDropPlace){
				currentDropPlace.addPlane(currentFocus);
			}
			
			mouseIsDown = false;
			currentFocus = null;
			currentDropPlace = null;
			
			// for debug use
			//console("dropplace");
		}
		else return;
	};
	var findActionRecipient = function(mousePosition){
		var r = null;
		for(var i = 0; i<listenList.getLength();i++){
			var o = listenList.get(i);
			if(o.isInside(mousePosition))
				r = o;
		}
		return r;
	};
	var findDropPlace = function(mousePosition){
		var r = null;
		for(var i = 0; i<dropList.getLength();i++){
			var o = dropList.get(i);
			if(o.isInside(mousePosition))
				r = o;
		}
		return r;
	};
	var getPositionOnStage = function(p){
		var x = p.x;
		var y = p.y;

		var _c = stage.getContainer();
	    var bbox = _c.getBoundingClientRect();

	    
	    return {
	    	x: x - bbox.left,
	    	y: y - bbox.top
	    };
	};
	var addWatchee = function(obj){
//		if(listenList.contains(obj) != -1) return false;
		listenList.push(obj);
		return true;
	};
	var addDropPlace = function(obj){
		return dropList.pushNonRepetition(obj);
	};
	var console = function(text){
		consoleText.setText(text);
		consoleLayer.draw();
	};
	
	return declare(Kinetic.Stage,{
		constructor: function(config){
			this.setAttrs(config);
			init(this);
			this.on("mousedown touchstart", onStageActionStart);
			this.on("mousemove touchmove",  onStageActionMove);
			this.on("mouseup touchend",     onStageActionEnd);
			
			var bf1 = new BF({
				x: 20,
				y: 20
			});
			
			var bf2 = new BF({
				x:400,
				y: 20
			});
			
			var airport = new Kinetic.Rect({
				x:0,
				y:0,
				width:300,
				height:300,
				fill:"lightyellow",
				stroke:"black",
				strokeWidth:2,
				shadowColor : 'black',
				shadowBlur : 10,
				shadowOffset : [ 4, 4 ],
				shadowOpacity : 0.2
			});
			
			var p1 = new Plane({
				x: 100,
				y: 100
			});
			var p2 = new Plane({
				x: 100,
				y: 100,
				direction:"east"
			});
			
			var airport_c = new Kinetic.Layer({
				x:20,
				y:400,
				width:500,
				height:500
			});
			
			airport_c.add(airport);
			airport_c.add(p1);
			airport_c.add(p2);
			
			this.add(bf1);
			this.add(bf2);
			this.add(airport_c);
			
			addWatchee(p1);
			addWatchee(p2);
			addDropPlace(bf1);
			addDropPlace(bf2);
			
			skylayer = airport_c;
		}
	});
});