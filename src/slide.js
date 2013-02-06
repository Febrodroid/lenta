define([
	
    'backbone',
    'image-loader',
    'mixins/data-options'
    
], function(Backbone, imageLoader, DataOptionsMixin) {
	
	var Slide = Backbone.View.extend({
		
		options: {
			width: 0,
			height: 0
		},
		
		initialize: function() {
			this.parseOptions();			
		},

		getOffset: function() {
			
			var offset = {
				x: this.$el.outerWidth(true) - this.$el.width(),
				y: this.$el.outerHeight(true) - this.$el.height()
			};
			
			return offset;
		},
		
		getAspectRatio: function() {
			return this.options.width / this.options.height;
		},
		
		getOuterWidth: function() {
			return this.$el.outerWidth(true);
		},
				
		getPosition: function() {
			return this.$el.position();
		},
		
		render: function() {
			
			var self = this;
			
			this.$el.find('img').each(function(i, image) {
				self.$el.addClass('loading');
				
				imageLoader.load(image).then(function() {
					self.$el.removeClass('loading');
				});
			});
			
			return this;
		},
		
		resize: function(height) {
			
			var offset = this.getOffset();
			
			height = height - offset.y;
			
			this.$el.css({
				'height': height,
				'width': Math.ceil(height * this.getAspectRatio())
			});
			
			return this;
		},
	});
	
	_.extend(Slide.prototype, DataOptionsMixin);
	
	return Slide;
});