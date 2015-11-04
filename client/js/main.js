require(
	["jquery", "underscore", "can",
	"js/prototypeController",
	"js/loginController",
	"js/gameController",],
	function($, _, can, PrototypeController, LoginController, GameController) {

		var localOptions = new can.Map({
			uid: undefined,
			gid: undefined,
			ws: undefined,
			onMessageHandlers: {},
		});

		var createPage = function(pageName) {
			if (pageName === "game") {
				self.currentController = new GameController("#out", {
					createPage: createPage,
					localOptions: localOptions,
				});
			} else if (pageName === "login") {
				self.currentController = new LoginController("#out", {
					createPage: createPage,
					localOptions: localOptions,
				});
			}
		};

		var socket = new WebSocket("ws://localhost:8081");
		localOptions.attr("ws", socket);

		socket.onopen = function(event) {
			createPage("login");

			localOptions.attr("onMessageHandlers.login", 
				function(data) {
					localOptions.attr("uid", data.uid);
					console.log("uid", localOptions.attr("uid"));
			});

			socket.send(JSON.stringify({
				"type": "login",
			}));
		};

		socket.onmessage = function(message) {
			var messageObj = JSON.parse(message.data);
			console.log("Received", messageObj.type);

			var handler = localOptions.attr("onMessageHandlers")[messageObj.type];
			handler && handler(messageObj.data);
		}
		
});