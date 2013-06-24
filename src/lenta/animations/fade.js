define([
        
	'jquery'
	
], function($) {
	
	return function(options) {
		
		this.animate = function() {

			var def = $.Deferred();
			
			options.lenta.slider.animate({
				'opacity': '0'
			}, options.lenta.options.transitionSpeed, function() {
				
				options.lenta.slider.css('left', options.point);
					
				options.lenta.slider.animate({
					'opacity': '1'
				}, options.lenta.options.transitionSpeed, function() {
					def.resolve();
				});
			});
						
			return def.promise();
		};
	};
	
});