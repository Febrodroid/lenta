define([
	
    'jquery'
	
], function($) {
	
	var queue = new Array();
	
	var loading = false;
	
	var load = function () {
		
		var item = queue.shift();
		
		if(item) {
			
			loading = true;
			
			var src = item.image.data('src');
			
			item.image.attr('src', src);
			
			item.image
				.on('load', function() {
					
					item.def.resolve(item.image);
					load();
				});
			
		} else {
			loading = false;
		}
	};
	
	return {
		
		load: function(image) {
			
			var def = $.Deferred();
			
			queue.push({
				def: def,
				image: $(image)
			});
			
			if(!loading) {
				load();
			}
			
			return def;
		}
		
	};
});