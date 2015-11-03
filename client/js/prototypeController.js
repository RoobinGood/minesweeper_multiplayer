define("js/prototypeController",
	["can"],
	function(can) {

	var PrototypeController = can.Control.extend({}, {
		destroy: function() {
			console.log("destroy");
			can.Control.prototype.destroy.call( this );
		}
	});

	return PrototypeController;
});