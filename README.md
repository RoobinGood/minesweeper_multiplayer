#MINESWEEPER MULTIPLAYER

##Game flow:
1. "start new game" / "join {gid}" 
2. play
3. maybe leave game -> to 1.
4. after end of game one of users restart and others will be auto-joined


##Server data structure:

###Map
```
map: {
	properties: {
		xCount, 
		yCount, 
		mineCount
	},
	counters: {
		opened,
		flaged
	},
	layers: {
		mines,
		tips,
		opened,
		flaged,
	},

	// methods
	init: function() {
		generateMineMap();
		generateTipsMap();
	},

	openArea: function(x, y) {
		var openedList = [];

		// ...
		this.counters.opened += openedList.length;
		return openedList;
	},

	checkWin: function() {},
}
```

###GameRepository
```
games: {
	gid: {
		map,
		users: [
			uid, 
			ws,
		],
	}
}
```

###Cients
```
clients: {
	uid: {
		ws
	}
}
```


##Protocol

###Login
####Client request
```
type: "login"
```
####Server response
```
type: "login"
data: {
	result: boolean
	*uid
}
```

###Start
####Client request
```
type: "newgame",
data: {
	uid
	properties: [xCount, yCount, mineCount]
}
```
####Server response? Server send gid and then user send join
```
type: "newgame"
data: {
	result: boolean
	*gid
}
```

###Join
####Client request
```
type: "join",
data: {
	uid
	gid
}
```
####Server response
```
type: "join"
data: {
	result: boolean
	*properties: [xCount, yCount, mineCount]
}
```

###Click
####Client request
```
type: "click",
data: {
	uid
	gid
	[x,y]
}
```
####Server response?
```
type: "click"
data: {
	result: boolean
}
```

###Check
####Client request
```
type: "check",
data: {
	uid
	gid
	checkState: boolean
	[x,y]
}
```
####Server response?
```
type: "check"
data: {
	result: boolean
}
```

###Leave
####Client request
```
type: "leave",
data: {
	uid
	gid
}
```

###OpenCells
####Server push
```
type: "opencells"
data: {
	cells: [[x, y, tip]]
}
```

###CheckCell
####Server push
```
type: "checkcell"
data: {
	checkState: boolean
	cells: [x, y]
}
```

###GameInfo
####Server push
```
type: "gameinfo"
data: {
	usercount
}
```

###EndGame
####Server push
```
type: "endgame"
data: {
	result: boolean
	*mine: [[x, y]]
}
```

###Restart
####Client request
```
type: "restart"
data: {
	uid
	gid
}
```
