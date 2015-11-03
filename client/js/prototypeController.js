define("js/prototypeController",
	["can"],
	function(can) {

	var PrototypeController = can.Control.extend({}, {
		destroy: function() {
			can.Control.prototype.destroy.call( this );
		}
	});

	return PrototypeController;
});