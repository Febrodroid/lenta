define([
	
    'backbone',
    'slide',
	'mixins/data-options'
	
], function(Backbone, Slide, DataOptionsMixin) {
	
	var Lenta = Backbone.View.extend({
		
		options: {
			height: 0,
			sliderSelector: '> ul',
			slidesSelector: '> ul > li',
			prevBtn: '.prev-btn',
			nextBtn: '.next-btn',
			transitionSpeed: 'fast',
			index: 0
		},
		
		initialize: function() {
			
			_.bindAll(this);
			
			this.parseOptions();

			this.$(this.options.nextBtn)
				.on('click', this.next);
		
			this.$(this.options.prevBtn)
				.on('click', this.prev);
			
			this.$(this.options.slidesSelector)
				.on('click', this.toSlide);
		},
		
		toSlide: function(e) {
			e.preventDefault();
	
			var index = this.$el
				.find(this.options.slidesSelector)
				.index(e.currentTarget);
			
			if(index + 1 <= this.slides.length && index >= 0)
				this.transition(this.options.index = index);				
		},
		
		prev: function(e) {
			e.preventDefault();
			
			if(this.options.index - 1 >= 0)
				this.transition(--this.options.index);			
		},
		
		next: function(e) {

			e.preventDefault();
			
			if(this.options.index + 1 < this.slides.length)
				this.transition(++this.options.index);
		},
			
		transition: function(index) {
		
			var self = this;
			
			var className = 'transitioning';
			
			if(this.$el.hasClass(className))
				return false;
			
			var slide = this.slides[index];

			if(slide) {
				
				var changeTo = this.$el.width() / 2 - (slide.getOuterWidth() / 2 + slide.getPosition().left);
				
				var min = 0;
				var max = this.$el.width() - this.slider.width();
				
				this.$el.addClass(className);
				
				this.slider.animate({
					'left':  Math.max(Math.min(min, changeTo),  max)
				}, this.options.transitionSpeed, function() {
					self.$el.removeClass(className);
					self.setFocus(slide);					
				});
			}
		},
		
		setFocus: function(slide) {
			
			this.$el
				.find(this.options.slidesSelector)
				.removeClass('focus');
		
			slide.$el.addClass('focus');
		},
		
		render: function() {
			
			var self = this;
			
			this.$el.css('position', 'relative');
			
			this.$el.height(this.options.height);
			
			var offset = 0;
			
			this.slider = this.$(this.options.sliderSelector);
			
			this.slides = this.$(this.options.slidesSelector)
				.map(function(i, element) {
					
					var slide = (new Slide({
						el: $(element)
					}))
					.render()
					.resize(self.options.height)
					.position(offset);
					
					offset += slide.$el.width() + slide.getOffset().x;
					
					return slide;
				});
			
			this.slider
				.width(offset)
				.height(this.options.height);
			
			this.transition(this.options.index);
			
			return this;
		}
	});
	
	_.extend(Lenta.prototype, DataOptionsMixin);

	return Lenta;
});