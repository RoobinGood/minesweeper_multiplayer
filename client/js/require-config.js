require.config({
	paths: {
		'jquery': 'bower_components/jquery/dist/jquery',
		'underscore': 'bower_components/underscore/underscore-min',
		'can': 'bower_components/canjs/can.jquery',
		'fastclick': "bower_components/fastclick/lib/fastclick",
	},
	shim: {
		'can': {
			deps: ['jquery'],
			exports: "can"
		},
	}
});
