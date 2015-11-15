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
			self.loginOptions  = new can.Map({
				showLogin: false,
				properties: [{
					"xCount": 14,
					"yCount": 11,
					"mineCount": 20,
				}, {
					"xCount": 20,
					"yCount": 15,
					"mineCount": 50,
				}, {
					"xCount": 30,
					"yCount": 20,
					"mineCount": 100,
				}, {
					"xCount": 50,
					"yCount": 40,
					"mineCount": 250,
				}],
				showSettings: false,
				server: self.options.localOptions.attr("server"),
				showLoader: false,
			});
			$(element).fadeIn(self.options.localOptions.attr("gameInfo.animationTime"));
			element.html(can.view(options.view, self.loginOptions));

			if (self.options.localOptions.attr("uid")) {
				self.setHandlers();
			}
		},
		setHandlers: function() {
			var self = this;
			self.options.localOptions.attr("setHandler")("newgame", 
				function(data) {
					// console.log(data);
					if (data.result) {
						self.options.localOptions.attr("gid", data.gid);
						self.joinGame(); 
					} else {
						self.loginOptions.attr("showLoader", false);
						alert("Can't create new game");
					}
			});
			self.options.localOptions.attr("setHandler")("join", 
				function(data) {
					// console.log(data);
					if (data.result) {
						self.showNewGame(data.properties);
					} else {
						self.loginOptions.attr("showLoader", false);
						alert("There is now game with that GameID");
					}
			});
		},
		".newGameButton li click": function(el, event) {
			var self = this;
			var properties = $(el).data().data;

			self.startNewGame(function() {
				self.options.localOptions.attr("ws").send(JSON.stringify({
					"type": "newgame",
					"data": {
						"uid": self.options.localOptions.attr("uid"),
						"properties": properties,
					}
				}));
			});

			this.loginOptions.attr("showLogin", false);
		},
		".newGameButton mouseenter": function() {
			this.loginOptions.attr("showLogin", true);
		}, 
		".newGameButton mouseleave": function() {
			this.loginOptions.attr("showLogin", false);
		},
		".loginSettings .button click": function() {
			this.loginOptions.attr("showSettings", 
				!this.loginOptions.attr("showSettings"));
		},
		"#gidInput keyup": function(el, event) {
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

			self.startNewGame(function() {
				self.options.localOptions.attr("ws").send(JSON.stringify({
					"type": "join",
					"data": {
						"uid": self.options.localOptions.attr("uid"),
						"gid": self.options.localOptions.attr("gid"),
					}
				}));
			});
		},
		startNewGame: function(callback) {
			this.loginOptions.attr("showLoader", true);
			this.login(callback);
		},
		login: function(success) {
			var self = this;
			if (self.options.localOptions.attr("ws")) {
				success();
			} else {
				self.options.createWebsocket(function() {
					if (self.options.localOptions.attr("ws")) {
						self.setHandlers();
						success();
					}
				});
			}
		},
		showNewGame: function(gameProperties) {
			var self = this;

			$(self.element).fadeOut(self.options.localOptions.attr("gameInfo.animationTime"), 
				function() {
					self.destroy();
					self.options.localOptions.attr("setHandler")("join", undefined);
					self.options.localOptions.attr("setHandler")("newgame", undefined);

					self.options.createPage("game", {
						properties: gameProperties,
					});
			});
		},
		"#serverInput change": function(el, event) {
			var serverAddress = $(el).val();
			var localOptions = this.options.localOptions;
			if (localOptions.attr("uid")) {
				localOptions.attr("ws").close();
			}
			localOptions.attr("server", serverAddress);
		}
	});

	return LoginController;
});