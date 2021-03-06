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

		isNearTo: function() {
			return false;
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
			
			this.trigger('resize:before');
			
			var offset = this.getOffset();
			
			height = height - offset.y;
			
			var width = Math.ceil(height * this.getAspectRatio());
			
			if(this.options.maxWidth && this.options.maxWidth < width) {
				width = this.options.maxWidth;
			}
						
			this.$el.css({
				'height': height,
				'width': width
			});
			
			this.trigger('resize:after');
			
			return this;
		},
		
		render: function() {
			
			this.trigger('render:before');
			
			return this;
		}
	});
	
	_.extend(Slide.prototype, DataOptionsMixin);
	
	return Slide;
});