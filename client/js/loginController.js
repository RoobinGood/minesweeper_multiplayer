define("js/loginController",
	["can", "js/prototypeController"],
	function(can, PrototypeController) {

	var LoginController = PrototypeController.extend({
		defaults: {
			view: "../static/templates/login.mustache",
		}
	}, {
		init: function(element, options) {
			this.element = element;
			element.html(can.view(options.view));
			$(element).fadeIn(150);
		},
		".newGameButton click": function(el, event) {
			var self = this;
			$(self.element).fadeOut(150, function() {
				self.destroy();
				self.options.createPage("game");
			});
		},
	});

	return LoginController;
});