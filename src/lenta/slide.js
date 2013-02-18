define([
	
    'backbone',
    'lenta/mixins/data-options'
    
], function(Backbone, DataOptionsMixin) {
	
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
				
		resize: function(height) {
			
			var offset = this.getOffset();
			
			height = height - offset.y;
			
			this.$el.css({
				'height': height,
				'width': Math.floor(height * this.getAspectRatio())
			});
			
			return this;
		},
	});
	
	_.extend(Slide.prototype, DataOptionsMixin);
	
	return Slide;
});