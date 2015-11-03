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

		createPage("login");
});