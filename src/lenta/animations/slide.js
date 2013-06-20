define([
        
	'jquery'
	
], function($) {
	
	return function(options) {
		
		this.animate = function() {
			
			var def = $.Deferred();
			
			options.lenta.slider.animate({
				'left': options.point
			}, options.lenta.options.transitionSpeed, function() {
				def.resolve();
			});
			
			return def.promise();
		};
	};
	
});