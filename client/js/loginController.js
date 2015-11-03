define("js/loginController",
	["can", "js/prototypeController"],
	function(can, PrototypeController) {

	var LoginController = PrototypeController.extend({
		defaults: {
			view: "../static/templates/login.mustache",
		}
	}, {
		init: function(element, options) {
			console.log(element, options);
			element.html(can.view(options.view));
		},
		".newGameButton click": function(el, event) {
			this.destroy();
			this.options.createPage("game");
		},
	});

	return LoginController;
});