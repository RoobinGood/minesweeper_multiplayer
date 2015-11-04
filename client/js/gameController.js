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
				onClick: self.onClick,
				onCheck: self.onCheck,
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
		}, 
		onCheck: function(x, y) {
			console.log("check", x, y);
		},
	});

	return GameController;
});