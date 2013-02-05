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
		
		setActive: function() {
			this.$el.addClass('active');
		},
		
		getPosition: function() {
			return this.$el.position();
		},
		
		render: function() {
			
			var self = this;
			
			this.$el.css('position', 'absolute');
			
			this.$el.find('img').each(function(i, image) {
				self.$el.addClass('loading');
				
				imageLoader.load(image).then(function() {
					self.$el.removeClass('loading');
				});
			});
			
			return this;
		},
		
		position: function(offset) {
			
			this.$el
				.css({
					'top': 0,
					'left': offset
				});
			
			return this;
		},
		
		resize: function(height) {
			
			var offset = this.getOffset();
			
			height = height - offset.y;
			
			this.$el.height(height);
			this.$el.width(height * this.getAspectRatio() - offset.x);
			
			return this;
		},
	});
	
	_.extend(Slide.prototype, DataOptionsMixin);
	
	return Slide;
});