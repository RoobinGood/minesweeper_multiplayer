define("js/loginController",
	["can", "js/prototypeController"],
	function(can, PrototypeController) {

	var LoginController = PrototypeController.extend({
		defaults: {
			view: "../static/templates/login.mustache",
		}
	}, {
		init: function(element, options) {
			var self = this;

			self.element = element;
			element.html(can.view(options.view));
			$(element).fadeIn(50);

			self.options.localOptions.attr("setHandler")("newgame", 
				function(data) {
					// console.log(data);
					if (data.result) {
						self.options.localOptions.attr("gid", data.gid);
						self.joinGame(); 
					} else {
						alert("Can't create new game");
					}
			});
			self.options.localOptions.attr("setHandler")("join", 
				function(data) {
					// console.log(data);
					if (data.result) {
						self.startNewGame(data.properties);
					} else {
						alert("There is now game with that GameID");
					}
			});
		},
		".newGameButton click": function(el, event) {
			var self = this;

			self.options.localOptions.attr("ws").send(JSON.stringify({
				"type": "newgame",
				"data": {
					"uid": self.options.localOptions.attr("uid"),
					"properties": {
						"xCount": 15,
						"yCount": 10,
						"mineCount": 3,
					}
				}
			}));

		},
		"input keyup": function(el, event) {
			var KEY_ENTER = 13;

			// console.log(event);
			if (event.keyCode === KEY_ENTER) {
				var self = this;
				var gid = $(el).val();

				self.options.localOptions.attr("gid", gid);
				self.joinGame();
			}

		},
		joinGame: function() {
			var self = this;
			var gid = self.options.localOptions.attr("gid");
			var ws = self.options.localOptions.attr("ws");

			ws.send(JSON.stringify({
				"type": "join",
				"data": {
					"uid": self.options.localOptions.attr("uid"),
					"gid": self.options.localOptions.attr("gid"),
				}
			}))
		},
		startNewGame: function(gameProperties) {
			var self = this;

			$(self.element).fadeOut(50, function() {
				self.destroy();
				self.options.createPage("game", {
					properties: gameProperties,
				});
			});
		},
	});

	return LoginController;
});