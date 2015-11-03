require(
	["jquery", "underscore", "can"],
	function($, _, can) {

		var LoginController = can.Control.extend({
			defaults: {
				view: "../static/templates/login.mustache",
			}
		}, {
			init: function(element, options) {
				element.html(can.view(options.view));
			}
		});

		var loginPage = new LoginController("#out");

});