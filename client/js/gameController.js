define("js/gameController",
	["can", "js/prototypeController", "js/utils"],
	function(can, PrototypeController, utils) {

	var GameController = PrototypeController.extend({
		defaults: {
			view: "../static/templates/game.mustache",
		}
	}, {
		init: function(element, options) {
			element.html(can.view(options.view));
		},
		".leaveButton click": function(el, event) {
			this.destroy();
			this.options.createPage("login");
		},
		".gidButton click": function(el, event) {
			utils.clip("GID");
		},
	});

	return GameController;
});