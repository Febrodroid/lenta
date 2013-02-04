define([
	
    'backbone',
    'slide',
	'mixins/data-options'
	
], function(Backbone, Slide, DataOptionsMixin) {
	
	var Lenta = Backbone.View.extend({
		
		options: {
			height: 0,
			slidesSelector: '> ul > li',
			prevBtn: '.prev-btn',
			nextBtn: '.next-btn',
			transitionSpeed: 'fast',
			index: 0
		},
		
		initialize: function() {
			
			_.bindAll(this);
			
			this.parseOptions();

			this.$el.find(this.options.nextBtn)
				.on('click', this.next);
			
			this.$el.find(this.options.prevBtn)
				.on('click', this.prev);
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
				
				this.$el.addClass(className);
				
				var leftSlider = this.$el.find('ul').position().left;
				var leftSlide = slide.getPosition().left;
				var leftOffset = Math.abs(leftSlider) - leftSlide;
				
				this.$el.find('ul').animate({
					'left': (leftOffset > 0? '+=': '-=') + Math.abs(leftOffset)
				}, this.options.transitionSpeed, function() {
					self.$el.removeClass(className);
				});
			}
		},
		
		render: function() {
			
			var self = this;
			
			this.$el.css('position', 'relative');
			
			this.$el.height(this.options.height);
			
			var offset = 0;
			
			this.slides = this.$el
				.find(this.options.slidesSelector)
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
			
			this.$('ul')
				.width(offset)
				.height(this.options.height);
			
			return this;
		}
	});
	
	_.extend(Lenta.prototype, DataOptionsMixin);

	return Lenta;
});