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


module.exports = Map;