var WebSocketServer = new require("ws");
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
		console.log('Received ' + messageObj.type);

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

		// wh: create game routine

		client.ws.send(JSON.stringify({
			"type": "newgame",
			"data": {
				"gid": gid,
			}
		}));
	}
};