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
		
		if (games[data.gid]) {

			games[data.gid].users.push(client.uid);
			console.log(games[data.gid].users);

			client.ws.send(JSON.stringify({
				"type": "join",
				"data": {
					"result": true,
					"properties": games[data.gid].map.properties,
				}
			}));
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
		if (game) {
			var x = data.coordinates.x;
			var y = data.coordinates.y;
			var tip = game.map.layers.tips[y][x];

			var users = game.users;
			for (var id in users) {
				clients[users[id]].ws.send(JSON.stringify({
					"type": "opencells",
					"data": {
						"cells": {
							"x": x, 
							"y": y, 
							"tip": tip,
						}
					},
				}))
			}
		}
	}
};