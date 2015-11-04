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
			map: {},
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

			client.ws.send(JSON.stringify({
				"type": "join",
				"data": {
					"result": true,
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

	}
};