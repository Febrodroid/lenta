define([
	
    'backbone',
    'images'
	
], function(Backbone, images) {
	
	var slide = Backbone.View.extend({
		
		options: {
			width: 0,
			height: 0
		},
		
		initialize: function() {
			
			this.options.width = this.$el.data('lentaWidth');
			this.options.height = this.$el.data('lentaHeight');
			this.options.aspectRatio = this.options.width/this.options.height;
		},
		
		render: function() {
			
			this.$el.css('position', 'absolute');
			
			this.$el.find('img').each(function(i, image) {
				images.load(image);
			});
			
			return this;
		},
		
		position: function(offset) {
			
			this.$el.css('left', offset);
			
			return this;
		},
		
		resize: function(height) {
			
			this.$el.height(height);
			this.$el.width(height * this.options.aspectRatio);
			
			return this;
		},
	});
	
	return slide;
});