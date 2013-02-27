define([
	
    'backbone',
    'lenta/mixins/data-options'
    
], function(Backbone, DataOptionsMixin) {
	
	var Scrollbar = Backbone.View.extend({

		slider: null,

		viewport: null,

		lenta: null,

		handler: null,

		options: {
			handlerSelector: '.lenta-scrollbar-handler',
			trackSelector: '.lenta-scrollbar-track'		
		},

		initialize: function() {
			
			_.bindAll(this);

			this.lenta = this.options.lenta;
			this.slider = this.lenta.slider;
			this.viewport = this.lenta.viewport;		

			this.handler = this.$(this.options.handlerSelector);
			this.track = this.$(this.options.trackSelector);

			this.lenta
				.on('moving', this.changePosition)
				.on('resized', this.render);

			this.handler.draggable({
			    axis: 'x',
			    containment: 'parent',
			    start: this.activateAllSlides,
			    drag: this.changeContainerPosition,
			    stop: this.toCenterSlide
			});
		},

		activateAllSlides: function() {
			this.lenta.activateAllSlides();
		},

		findCenterSlide: function() {

			var center = {
				slide: null,
				offset: null
			};

			var centerPoint = 
					this.viewport.width() / 2 + Math.abs(parseInt(this.slider.css('left')));

			_.each(this.lenta.slides, function(slide) {

				var offset = Math.abs(centerPoint - slide.getPosition().left);

				if(offset < center.offset || center.offset == null) {
					center.offset = offset;
					center.slide = slide;
				}					
			});

			return center.slide;
		},

		changePosition: function(e) {

			var left = 
				e.point / this.viewport.width() * this.handler.width();
			    
			this.handler.animate({
				'left': -1 * left
			}, this.lenta.options.transitionSpeed);
		},

		changeContainerPosition: function() {

			var left = parseInt(this.handler.css('left'));
			
			var scroll = 
				left / this.handler.width() * this.viewport.width();
			 
			this.slider.css('left', -1 * scroll);	
		},

		toCenterSlide: function() {

			var slide = this.findCenterSlide();
					
			this.lenta.toSlide(slide.$el);
		},

		render: function() {

			var handlerWidth = 
				this.viewport.width() / this.slider.width() * this.track.width();

			this.handler.width(handlerWidth);

			if(this.slider.width() <= this.viewport.width()) {
				this.$el.hide();
			} else {
				this.$el.show();
			}

			return this;
		}

	});

	return Scrollbar;
});