var WebSocketServer = new require("ws");
var Map = new require("./map");
var _ = new require("underscore");

var clients = {};
var games = {};
var onMessageHandlers = {};

var webSocketServer = new WebSocketServer.Server({
	port: 8081,
});

webSocketServer.on('connection', function(ws) {

	var id = _.random(100500);
	clients[id] = {
		ws: ws,
		uid: id,
	};

	ws.on('message', function(message) {
		var messageObj = JSON.parse(message);
		console.log('Received', messageObj.type);

		var handler = onMessageHandlers[messageObj.type];
		handler && handler(clients[id], messageObj.data);

	}).on('close', function() {
		console.log('WS closed ' + id);
		delete clients[id];
	});

});


var sendBroadcastMessage = function(game, messageObj) {
	var message = JSON.stringify(messageObj);
	var users = game.users;
	var disconnectedUsers = [];
	for (var id in users) {
		if (clients[users[id]]) {
			clients[users[id]].ws.send(message);
		} else {
			disconnectedUsers.push(id);
		}
	}

	if (disconnectedUsers.length > 0) {
		for (var i = disconnectedUsers.length-1; i>=0; i--) {
			users.splice(disconnectedUsers[i], 1);
		}
		sendGameInfo(game);
	}
};

var sendGameResult = function(game) {
	sendBroadcastMessage(game, {
		"type": "endgame",
		"data": game.result,
	});
};

var sendGameInfo = function(game) {
	sendBroadcastMessage(game, {
		"type": "gameinfo",
		"data": {
			"usercount": game.users.length,
		},
	});
};

onMessageHandlers = {
	login: function(client, data) {
		// client.ws
		console.log("send login");
		client.ws.send(JSON.stringify({
			"type": "login",
			"data": {
				"uid": client.uid,
			}
		}));
	},
	newgame: function(client, data) {
		var gid = _.random(100500);

		games[gid] = {
			map: new Map(data.properties),
			users: [],
			state: true,
		}

		client.ws.send(JSON.stringify({
			"type": "newgame",
			"data": {
				"gid": gid,
				"result": true,
 			}
		}));
	},
	join: function(client, data) {
		var game = games[data.gid];
		if (game) {
			game.users.push(client.uid);
			console.log(game.users);

			client.ws.send(JSON.stringify({
				"type": "join",
				"data": {
					"result": true,
					"properties": game.map.properties,
				}
			}));

			client.ws.send(JSON.stringify({
				"type": "opencells",
				"data": {
					"gid": data.gid,
					"cells": game.map.serializeOpenedCells(),
				}
			}));

			if (!game.state) {
				client.ws.send(JSON.stringify({
					"type": "endgame",
					"data": game.result,
				}));
			}

			sendGameInfo(game);
		} else {
			client.ws.send(JSON.stringify({
				"type": "join",
				"data": {
					"result": false,
				}
			}));
		}
	},
	click: function(client, data) {
		var game = games[data.gid];
		if (game && game.state) {
			var x = data.coordinates.x;
			var y = data.coordinates.y;

			// console.log("mine:", game.map.layers.mines[y][x]);
			if (game.map.layers.mines[y][x]) {
				game.state = false;
				game.result = {
					"result": false,
					"mine": {
						"x": x,
				    	"y": y,
					},
				};
				sendGameResult(game);
			} else {
				var messageObj = {
					"type": "opencells",
					"data": {
						"gid": data.gid,
						"cells": game.map.openCell(x, y),
					},
				};
				sendBroadcastMessage(game, messageObj);

				if (game.map.checkWin()) {
					game.state = false;
					game.result = {
						"result": true,
					};
					sendGameResult(game);
				}
			}

		}
	},
	check: function(client, data) {
		var game = games[data.gid];
		if (game && game.state) {
			var x = data.coordinates.x;
			var y = data.coordinates.y;
			var checkState = data.checkstate;

			if (!game.map.layers.opened[y][x] && 
				game.map.layers.flaged[y][x] !== checkState) {

				game.map.layers.flaged[y][x] = checkState;
				var messageObj = {
					"type": "check",
					"data": {
						"coordinates": {
							"x": x,
							"y": y,
						},
						"checkstate": checkState,
					}
				};
				
				sendBroadcastMessage(game, messageObj);
			}
		}
	}, 
	leave: function(client, data) {
		var game = games[data.gid];
		if (game) {
			var ind = _.indexOf(game.users, client.uid);
			if (ind !== -1) {
				game.users.splice(ind, 1);
				
				sendGameInfo(game);
			}
		}
	}

};