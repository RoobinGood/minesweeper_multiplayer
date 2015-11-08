define("js/gameController",
	["can", "js/prototypeController", "js/utils", 
	"js/mapController"],
	function(can, PrototypeController, utils, MapController) {

	var GameController = PrototypeController.extend({
		defaults: {
			view: "../static/templates/game.mustache",
		}
	}, {
		init: function(element, options) {
			var self = this;
			self.element = element;
			self.options.localOptions.attr("gameInfo.gameState", true);
			self.options.localOptions.attr("gameInfo.openedCount", 0);
			self.options.localOptions.attr("gameInfo.freeCount", 
				self.options.properties.xCount * self.options.properties.yCount -
				self.options.properties.mineCount);
			self.options.localOptions.attr("gameInfo.flagedCount", 0);
			self.options.localOptions.attr("gameInfo.mineCount", 
				self.options.properties.mineCount);
			element.html(can.view(options.view, self.options.localOptions));

			$(element).fadeIn(self.options.localOptions.attr("gameInfo.animationTime"));

			self.map = new MapController("#map", {
				xCount: self.options.properties.xCount,
				yCount: self.options.properties.yCount,
				mineCount: self.options.properties.mineCount,
				onClick: function() {
					self.onClick.apply(self, arguments);
				},
				onCheck: function() {
					self.onCheck.apply(self, arguments);
				},
			});

			self.options.localOptions.attr("setHandler")("opencells", function(data) {
				data.cells.forEach(function(el) {
					var className = (el.tip < 3) ? "lowWarn" :
						(el.tip < 5) ? "midWarn" :
						"hiWarn";
					self.map.map.attr("layers.openedTips")
						[el.y][el.x].attr({
							tip: el.tip,
							className: className,
							opened: true,
							flaged: false,
						});
				});
				self.options.localOptions.attr("gameInfo.openedCount", 
					self.options.localOptions.attr("gameInfo.openedCount") + 
					data.cells.length);
			});

			self.options.localOptions.attr("setHandler")("check", function(data) {
				self.map.map.attr("layers.openedTips")
					[data.coordinates.y][data.coordinates.x]
					.attr("flaged", data.checkstate);
				// console.log(self.map.map.attr("layers.openedTips")
				// 	[data.coordinates.y][data.coordinates.x].attr("flaged"));
				if (data.checkstate) {
					self.options.localOptions.attr("gameInfo.flagedCount", 
						self.options.localOptions.attr("gameInfo.flagedCount") + 1);				
				} else {
					self.options.localOptions.attr("gameInfo.flagedCount", 
						self.options.localOptions.attr("gameInfo.flagedCount") - 1);
				}
			});

			self.options.localOptions.attr("setHandler")("endgame", function(data) {
				self.options.localOptions.attr("gameInfo.gameState", false);
				self.options.localOptions.attr("gameInfo.gameResult", data.result);
				if (data.result) {
					// alert("YOU WIN!");
				} else {
					self.map.map.attr("layers.openedTips")
						[data.mine.y][data.mine.x].attr({
							tip: "M",
							className: "mine",
							opened: true,
							flaged: false,
						});
					self.options.localOptions.attr("gameInfo.openedCount", 
						self.options.localOptions.attr("gameInfo.openedCount") + 1);
				}
				self.cleanGame();
			});

			self.options.localOptions.attr("setHandler")("join", 
				function(data) {
					$(self.element).fadeOut(self.options.localOptions.attr("gameInfo.animationTime"), 
						function() {
							self.cleanGame();
							self.destroyController();
							self.options.createPage("game", {
								properties: data.properties,
							});
					});
			});
		},
		".leaveButton click": function(el, event) {
			var self = this;
			$(self.element).fadeOut(50, function() {
				self.options.localOptions.attr("ws").send(JSON.stringify({
					"type": "leave",
					"data": {
						"gid": self.options.localOptions.attr("gid"),
						"uid": self.options.localOptions.attr("uid"),
					}
				}));
				self.destroyController();
				self.cleanGame();
				self.options.createPage("login");
			});
		},
		".gidButton click": function(el, event) {
			utils.clip(this.options.localOptions.attr("gid"));
		},
		onClick: function(x, y) {
			console.log("click", x, y);
			var localOptions = this.options.localOptions;
			if (localOptions.attr("gameInfo.gameState")) {
				localOptions.attr("ws").send(JSON.stringify({
					"type": "click",
					"data": {
						"gid": localOptions.attr("gid"),
						"uid": localOptions.attr("uid"),
						"coordinates": {
							"x": x,
							"y": y,
						}
					}
				}));
			}
		}, 
		onCheck: function(x, y, checkState) {
			console.log("check", x, y);
			var localOptions = this.options.localOptions;
			if (localOptions.attr("gameInfo.gameState")) {
				localOptions.attr("ws").send(JSON.stringify({
					"type": "check",
					"data": {
						"gid": localOptions.attr("gid"),
						"uid": localOptions.attr("uid"),
						"coordinates": {
							"x": x,
							"y": y,
						},
						"checkstate": checkState,
					}
				}));
			}
		},
		cleanGame: function() {
			this.options.localOptions.attr("setHandler")("opencells", undefined);
			this.options.localOptions.attr("setHandler")("check", undefined);
			this.options.localOptions.attr("setHandler")("endgame", undefined);
			// console.log("game cleaned");
		},
		"#endGameSplash click": function() {
			var localOptions = this.options.localOptions;
			localOptions.attr("ws").send(JSON.stringify({
				"type": "restart",
				"data": {
					"gid": localOptions.attr("gid"),
					"uid": localOptions.attr("uid"),
				}
			}));
		},
		destroyController: function() {
			this.options.localOptions.attr("setHandler")("join", undefined);
			this.destroy();
		}
	});

	return GameController;
});