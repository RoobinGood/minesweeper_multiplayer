var _ = new require("underscore");

var Map = function(properties) {
	this.properties = properties;
	this.counters = {
		opened: 0,
		flaged: 0,
	};
	this.layers = {
		opened: [],
		tips: [],
		mines: [],
		flaged: [],
	};

	for (var i=0; i<this.properties.yCount; i++) {
		this.layers.mines.push([]);
		this.layers.opened.push([]);
		this.layers.flaged.push([]);
		this.layers.tips.push([]);
		for (var j=0; j<this.properties.xCount; j++) {
			this.layers.mines[i].push(false);
			this.layers.opened[i].push(false);
			this.layers.flaged[i].push(false);
			this.layers.tips[i].push(0);
		}
	}

	this.generateMineMap();
	this.generateTipsMap();
}

Map.prototype.generateMineMap = function() {
	for (var i=0; i<this.properties.mineCount; i++) {
		var planted = false;
		while (!planted) {
			var x = _.random(this.properties.xCount-1);
			var y = _.random(this.properties.yCount-1);

			planted = !this.layers.mines[y][x];
			if (planted) {
				this.layers.mines[y][x] = true;
			}
		}
	}
}

// todo: rewrite - generate by mine map
Map.prototype.generateTipsMap = function() {
	for (var x=0; x<this.properties.xCount; x++) {
		for (var y=0; y<this.properties.yCount; y++) {

			var counter = 0;
			for (var i = x===0 ? x : x-1; i<this.properties.xCount && i<=x+1; i++) {
				for (var j = y===0 ? y : y-1; j<this.properties.yCount && j<=y+1; j++){
					this.layers.mines[j][i] && counter++;
				}
			}

			this.layers.tips[y][x] = counter;
		}
	}
}

Map.prototype.openArea = function(initialX, initialY) {
	var self = this;
	var openedList = [];

	var expandOpenArea = function(x, y) {
		// console.log("expand", x, y);
		for (var k = x===0 ? x : x-1; k<self.properties.xCount && k<=x+1; k++) {
			// console.log("x:", k);
			for (var l = y===0 ? y : y-1; l<self.properties.yCount && l<=y+1; l++) {
				// console.log(k, l, !self.layers.opened[l][k]);
				if (!self.layers.opened[l][k]) {
					self.layers.opened[l][k] = true;
					openedList.push({
						x: k,
						y: l,
						tip: self.layers.tips[l][k],
					});
					if (self.layers.tips[l][k] === 0) {
						expandOpenArea(k, l);
					}
				}
			}
		} 
	};

	expandOpenArea(initialX, initialY);
	return openedList;
}


module.exports = Map;

var test_openArea = function() {
	var testMap = new Map({
		xCount: 3, 
		yCount: 3, 
		mineCount: 0});
	testMap.layers.mines[2][2] = true;
	testMap.generateTipsMap();
	
	console.log(testMap.layers.tips);

	console.log(testMap.openArea(0, 0));
	console.log(testMap.layers.opened);
};

// test_openArea();