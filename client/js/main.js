require(
	["jquery", "underscore", "can",
	"js/prototypeController",
	"js/loginController",
	"js/gameController",],
	function($, _, can, PrototypeController, LoginController, GameController) {

		var localOptions = new can.Map({
			uid: undefined,
			gid: undefined,

			gameInfo: {
				userCount: undefined,
				gameState: false,
				animationTime: 10,
			},
			
			ws: undefined,
			onMessageHandlers: {},
			messageQueue: [],
			setHandler: undefined,
		});

		localOptions.attr("setHandler", function(type, handler) {
			localOptions.attr(["onMessageHandlers", type].join("."), handler);
			if (handler) {
				console.log("set handler:", type);
			} else {
				console.log("delete handler:", type);
			}
			// console.log("queue:", localOptions.attr("messageQueue").length);

			// handle received messages
			if (handler) {
				var len = localOptions.attr("messageQueue").length;
				for (var i=len-1; i>=0; i--) {
					if (localOptions.attr("messageQueue")[i].type === type /*&& 
						localOptions.attr("messageQueue")[i].data.gid === 
							localOptions.attr("gid")*/) {

						handler(localOptions.attr("messageQueue")[i].data);
						// console.log(type, "handled");
						localOptions.attr("messageQueue").splice(i, 1);
					}
				}
			}
		});

		var createPage = function(pageName, data) {
			var pageData = {
				createPage: createPage,
				localOptions: localOptions,
			};
			data && $.extend(pageData, data);
			// console.log("extended data", pageData);
			if (pageName === "game") {
				self.currentController = new GameController("#out", pageData);
			} else if (pageName === "login") {
				self.currentController = new LoginController("#out", pageData);
			}
		};

		try {
			var socket = new WebSocket("ws://localhost:8081");
			localOptions.attr("ws", socket);

			socket.onopen = function(event) {
				createPage("login");

				localOptions.attr("setHandler")("login", 
					function(data) {
						localOptions.attr("uid", data.uid);
						// console.log("uid", localOptions.attr("uid"));
				});
				localOptions.attr("setHandler")("gameinfo", 
					function(data) {
						localOptions.attr("gameInfo.userCount", data.usercount);
						// console.log("userCount", localOptions.attr("gameInfo.userCount"));
				});

				socket.send(JSON.stringify({
					"type": "login",
				}));
			};

			socket.onmessage = function(message) {
				var messageObj = JSON.parse(message.data);
				console.log("Received", messageObj.type, messageObj.data);

				var handler = localOptions.attr("onMessageHandlers")[messageObj.type];
				if (handler) {
					handler(messageObj.data);
				} else {
					localOptions.attr("messageQueue").push(messageObj);
					console.log("Push to queue");
				}
			}
		} catch (err) {
			console.log("error", err);
			$("#out").html(["<div style=\"padding: 20px\"><h1>:'(</h1><br>",
				"<h3>You browser doesn't support websockets<h3></div>"].join(""));
		}
		
});