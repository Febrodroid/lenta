define([
        
	'jquery'
	
], function($) {
	
	return function(options) {
		
		this.animate = function() {
			
			var def = $.Deferred();
			
			options.lenta.slider.fadeOut(options.lenta.options.transitionSpeed, function() {
				
				options.lenta.slider.css('left', options.point);
					
				options.lenta.slider.fadeIn(options.lenta.options.transitionSpeed, function() {
					def.resolve();
				});
			});
						
			return def.promise();
		};
	};
	
});