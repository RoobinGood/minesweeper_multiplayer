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

			element.html(can.view(options.view));

			$(element).fadeIn(150);

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

			self.options.localOptions.attr("onMessageHandlers.opencells", function(data) {
				console.log(data);
				self.map.map.attr("layers.opened")[data.cells.y][data.cells.x] = true;
				self.map.apply();
			});
		},
		".leaveButton click": function(el, event) {
			var self = this;
			$(self.element).fadeOut(150, function() {
				self.destroy();
				self.options.createPage("login");
			});
		},
		".gidButton click": function(el, event) {
			utils.clip("GID");
		},
		onClick: function(x, y) {
			console.log("click", x, y);
			var localOptions = this.options.localOptions;

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
		}, 
		onCheck: function(x, y) {
			console.log("check", x, y);
		},
	});

	return GameController;
});