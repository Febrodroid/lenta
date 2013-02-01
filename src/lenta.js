define([
	
    'backbone',
    'slide'
	
], function(Backbone, Slide) {
	
	var lenta = Backbone.View.extend({
		
		options: {
			height: 0
		},
		
		initialize: function() {
			this.options.height = this.$el.data('lentaHeight');
		},
		
		render: function() {
			var self = this;
			
			this.$el.css('position', 'relative');
			
			this.$el.height(this.options.height);
			
			var offset = 0;
			
			this.slides = this.$el
				.find('.item')
				.map(function(i, element) {
					
					var slide = (new Slide({
						el: $(element)
					}))
					.render()
					.resize(self.options.height)
					.position(offset);
					
					offset += slide.$el.width();
					
					return slide;
				});
			
			return this;
		}
	});
	
	return lenta;
});