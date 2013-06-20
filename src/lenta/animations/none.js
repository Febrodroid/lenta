define([
        
    'jquery'
    	
], function($) {
	
	return function(options) {
		
		this.animate = function() {
			
			var def = $.Deferred();
			
			options.lenta.slider.css('left', options.point);
			
			def.resolve();
			
			return def.promise();
		};
	};
	
});