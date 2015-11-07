define("js/mapController",
	["can", "js/prototypeController", "js/utils"],
	function(can, PrototypeController, utils) {

	var MapController = PrototypeController.extend({
		defaults: {
			view: "../static/templates/map.mustache",
		}
	}, {
		init: function(element, options) {
			var self = this;
			self.element = element;

			self.map = new can.Map({
				properties: {
					xCount: options.xCount,
					yCount: options.yCount,
					mineCount: options.mineCount,
				},
				counters: {
					opened: 0,
					flaged: 0,
				},
				layers: {
					openedTips: [],
					flaged: [],
				},
			});

			for (var i=0; i<self.map.properties.yCount; i++) {
				self.map.attr("layers.openedTips").push([]);
				self.map.attr("layers.flaged").push([]);
				for (var j=0; j<self.map.properties.xCount; j++) {
					self.map.attr("layers.openedTips")[i].push({
						opened: false,
						tip: undefined,
						className: undefined,
					});
					self.map.attr("layers.flaged")[i].push(false);
				}
			}

			// console.log(self.map);

			can.view.attr("bindcheck", function(el) {
				$(el).prev().find("td").on("contextmenu", function(cellEl) {
					cellEl.preventDefault();
					var coordinates = self.getCoordinates(cellEl.currentTarget);
					if (!self.map.layers.openedTips
							[coordinates.y][coordinates.x].opened) {

						self.options.onCheck(coordinates.x, coordinates.y);
					}
				})
			});
   			
			element.html(can.view(options.view, self.map));
		},
		"td click": function(el, event) {
			var coordinates = this.getCoordinates(el);
			if (!this.map.layers.openedTips
					[coordinates.y][coordinates.x].opened) {

				this.options.onClick(coordinates.x, coordinates.y);
			}
		},
		getCoordinates: function(el) {
			var x = $(el).data("x");
			var y = $(el).closest("tr").data("y");
			// console.log(x, y, el);
			return {
				x: x,
				y: y
			}
		},
		apply: function() {
			// this.element.html(can.view(this.options.view, this.map));
		},

	});

	return MapController;
});