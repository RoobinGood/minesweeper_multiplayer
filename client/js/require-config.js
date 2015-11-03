require.config({
	paths: {
		'jquery': 'bower_components/jquery/dist/jquery',
		'underscore': 'bower_components/underscore/underscore-min',
		'can': 'bower_components/CanJS/can.jquery',
	},
	shim: {
		'can': {
			deps: ['jquery'],
			exports: "can"
		},
	}
});