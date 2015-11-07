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
			element.html(can.view(options.view, self.options.localOptions));

			$(element).fadeIn(50);

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
			});

			self.options.localOptions.attr("setHandler")("check", function(data) {
				self.map.map.attr("layers.openedTips")
					[data.coordinates.y][data.coordinates.x]
					.attr("flaged", data.checkstate);
				console.log(self.map.map.attr("layers.openedTips")
					[data.coordinates.y][data.coordinates.x].attr("flaged"));
			});

			self.options.localOptions.attr("setHandler")("endgame", function(data) {
				self.options.localOptions.attr("gameInfo.gameState", false);
				if (data.result) {
					alert("YOU WIN!");
				} else {
					self.map.map.attr("layers.openedTips")
						[data.mine.y][data.mine.x].attr({
							tip: "M",
							className: "mine",
							opened: true,
							flaged: false,
						});
				}
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
				self.destroy();
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
	});

	return GameController;
});