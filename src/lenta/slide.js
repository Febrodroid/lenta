define([
	
    'backbone',
    'lenta/mixins/data-options'
    
], function(Backbone, DataOptionsMixin) {
	
	var Slide = Backbone.View.extend({
		
		options: {
			width: 0,
			height: 0,
			maxWidth: null
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
			
			var aspectRatio = this.options.aspectRatio;
			
			if(!aspectRatio) {
				aspectRatio = this.options.width / this.options.height;
			}
			
			return aspectRatio;
		},
		
		getOuterWidth: function() {
			return this.$el.outerWidth(true);
		},
				
		getPosition: function() {
			return this.$el.position();
		},
				
		resize: function(height) {
			
			var offset = this.getOffset();
			
			height = height - offset.y;
			
			var width = Math.floor(height * this.getAspectRatio());
			
			if(this.options.maxWidth && this.options.maxWidth < width) {
				var width = this.options.maxWidth;
			}
			
			this.$el.css({
				'height': height,
				'width': width
			});
			
			return this;
		},
	});
	
	_.extend(Slide.prototype, DataOptionsMixin);
	
	return Slide;
});